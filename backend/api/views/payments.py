from django.conf import settings
from django.shortcuts import redirect, get_object_or_404
from django.utils import timezone

from ninja import Router
from ninja.errors import HttpError
import requests

from payments.models import Payment, DiscountCode
from events.models import Event, Registration
from api.authentication import jwt_auth
from api.schemas.payments import CreatePaymentIn, CreatePaymentOut

payments_router = Router(tags=["Payments"])


@payments_router.post("create", response=CreatePaymentOut, auth=jwt_auth)
def create_payment(request, payload: CreatePaymentIn):
    event = get_object_or_404(Event, pk=payload.event_id)

    if Payment.objects.filter(status=Payment.OrderStatusChoices.PAID, user=request.auth, event=event).exists():
        raise HttpError(400, "You have already registered in this event")

    discount_code = None
    discount_amount = 0
    final_amount = event.price

    if payload.discount_code:
        discount_code = DiscountCode.objects.filter(code=payload.discount_code).first()

        if discount_code:
            final_amount, discount_amount = discount_code.calculate_discount(event, request.auth)

    pay = Payment.objects.create(
        user=request.auth,
        event=event,
        base_amount=event.price,
        discount_code=discount_code,
        discount_amount=discount_amount,
        amount=final_amount,
        status=Payment.OrderStatusChoices.INIT,
    )

    callback_url = getattr(settings, "ZARINPAL_CALLBACK_URL", "http://localhost:8000/api/payments/callback")
    body = {
        "merchant_id": settings.ZARINPAL_MERCHANT_ID,
        "amount": final_amount,
        "callback_url": callback_url,
        "description": payload.description,
        "metadata": {
            k: v for k, v in {
                "mobile": payload.mobile,
                "email":  payload.email,
                "event_id": event.id,
                "user_id": request.auth.id,
                "payment_id": pay.id,
                "discount_code": discount_code.code if discount_code else None,
            }.items() if v
        }
    }

    try:
        response = requests.post(
            settings.ZARINPAL_REQUEST_URL,
            json=body,
            headers={"accept":"application/json","content-type":"application/json"},
            timeout=15
        )
        jd = response.json()
    except Exception as e:
        pay.delete()
        raise HttpError(502, f"Gateway request failed: {e}")

    code = (jd.get("data") or {}).get("code")
    if code != 100:
        pay.delete()
        raise HttpError(502, f"Zarinpal error: {jd.get('errors') or jd}")

    authority = jd["data"]["authority"]
    pay.authority = authority
    pay.status = Payment.OrderStatusChoices.PENDING
    pay.save(update_fields=["authority","status"])

    return {
        "start_pay_url": f"{settings.ZARINPAL_STARTPAY}{authority}",
        "authority": authority,
        "base_amount": event.price,
        "discount_amount": discount_amount if discount_amount else 0,
        "amount": final_amount,
    }

@payments_router.get("callback")
def callback(request, Authority: str | None = None, Status: str | None = None):
    if not Authority:
        raise HttpError(400, "Missing Authority")

    pay = Payment.objects.filter(authority=Authority).select_related("event","user","discount_code").first()
    if not pay:
        raise HttpError(404, "Payment not found")

    frontend_root = getattr(settings, "FRONTEND_ROOT", "http://localhost:3000").rstrip("/")

    if Status != "OK":
        pay.status = Payment.OrderStatusChoices.CANCELED
        pay.save(update_fields=["status"])
        return redirect(f"{frontend_root}/payments/result?status=failed&event_id={pay.event_id}")

    verify_body = {
        "merchant_id": settings.ZARINPAL_MERCHANT_ID,
        "amount": pay.amount,
        "authority": Authority,
    }

    try:
        vresp = requests.post(
            settings.ZARINPAL_VERIFY_URL,
            json=verify_body,
            headers={"accept":"application/json","content-type":"application/json"},
            timeout=15
        )
        vjd = vresp.json()
    except Exception:
        pay.status = Payment.OrderStatusChoices.FAILED
        pay.save(update_fields=["status"])
        return redirect(f"{frontend_root}/payments/result?status=failed&event_id={pay.event_id}")

    vcode = (vjd.get("data") or {}).get("code")
    if vcode in (100, 101):
        data = vjd.get("data") or {}
        pay.status = Payment.OrderStatusChoices.PAID
        pay.ref_id = data.get("ref_id")
        pay.card_pan = data.get("card_pan")
        pay.card_hash = data.get("card_hash")
        pay.verified_at = timezone.now()
   
        if pay.event.capacity:
            pay.event.capacity = pay.event.capacity - 1
   
        pay.save(update_fields=["status", "ref_id", "card_pan", "card_hash", "verified_at"])

        registration = Registration.objects.filter(user=request.auth, event=pay.event, status=Registration.StatusChoices.PENDING).fitst()
        registration.status = Registration.StatusChoices.CONFIRMED
        registration.save(updated_fields=["status"])
        return redirect(f"{frontend_root}/payments/result?status=success&event_id={pay.event_id}&ref_id={pay.ref_id}")

    pay.status = Payment.OrderStatusChoices.FAILED
    pay.save(update_fields=["status"])
    return redirect(f"{frontend_root}/payments/result?status=failed&event_id={pay.event_id}")
