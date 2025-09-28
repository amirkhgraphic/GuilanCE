from ninja import Schema


class CreatePaymentIn(Schema):
    event_id: int
    description: str
    discount_code: str | None = None
    mobile: str | None = None
    email:  str | None = None


class CreatePaymentOut(Schema):
    start_pay_url: str
    authority: str
    base_amount: int
    discount_amount: int
    amount: int
