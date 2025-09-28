from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils.text import slugify

from ninja import Router
from ninja.errors import HttpError
from typing import List, Optional

from api.authentication import jwt_auth
from events.models import Event, Registration
from api.schemas import (
    EventSchema,
    EventCreateSchema,
    EventUpdateSchema,
    EventListSchema,

    RegistrationSchema,
    RegistrationStatusUpdateSchema,

    MessageSchema,
    ErrorSchema,
)

events_router = Router()

# Event endpoints
@events_router.get("/", response=List[EventListSchema])
def list_events(
    request,
    status: Optional[str] = None,
    event_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    """List events with filtering and pagination"""
    queryset = Event.objects.filter(is_deleted=False).prefetch_related('gallery_images')

    if status:
        queryset = queryset.filter(status=status)
    if event_type:
        queryset = queryset.filter(event_type=event_type)
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(description__icontains=search)
        )

    events = queryset[offset:offset + limit]
    return events

@events_router.get("/{int:event_id}", response=EventSchema)
def get_event(request, event_id: int):
    """Get event details by ID"""
    event = get_object_or_404(
        Event.objects.prefetch_related('gallery_images'),
        id=event_id,
        is_deleted=False
    )
    return event

@events_router.get("/slug/{str:slug}", response=EventSchema)
def get_event_by_slug(request, slug: str):
    """Get event details by slug"""
    event = get_object_or_404(
        Event.objects.prefetch_related('gallery_images'),
        slug=slug,
        is_deleted=False
    )
    return event

@events_router.post("/", response=EventSchema)
def create_event(request, payload: EventCreateSchema):
    """Create a new event"""
    gallery_image_ids = payload.dict().pop('gallery_image_ids', [])
    event = Event.objects.create(**payload.dict(exclude={'gallery_image_ids'}))

    if gallery_image_ids:
        event.gallery_images.set(gallery_image_ids)

    return event

@events_router.put("/{int:event_id}", response=EventSchema)
def update_event(request, event_id: int, payload: EventUpdateSchema):
    """Update an existing event"""
    event = get_object_or_404(Event, id=event_id, is_deleted=False)

    update_data = payload.dict(exclude_unset=True)
    gallery_image_ids = update_data.pop('gallery_image_ids', None)

    for attr, value in update_data.items():
        setattr(event, attr, value)

    if 'title' in update_data:
        event.slug = slugify(event.title)

    event.save()

    if gallery_image_ids is not None:
        event.gallery_images.set(gallery_image_ids)

    return event

@events_router.delete("/{int:event_id}", response=MessageSchema)
def delete_event(request, event_id: int):
    """Soft delete an event"""
    event = get_object_or_404(Event, id=event_id, is_deleted=False)
    event.delete()
    return {"message": "Event deleted successfully"}

# Registration endpoints
@events_router.get("/{int:event_id}/registrations", response=List[RegistrationSchema])
def list_event_registrations(request, event_id: int, limit: int = 20, offset: int = 0):
    """List registrations for a specific event"""
    event = get_object_or_404(Event, id=event_id, is_deleted=False)
    queryset = event.registrations.filter(is_deleted=False).select_related('user')

    registrations = queryset[offset:offset + limit]
    return registrations

@events_router.post("/{int:event_id}/register", response=RegistrationSchema, auth=jwt_auth)
def register_for_event(request, event_id: int):
    """Register current user for an event"""
    event = get_object_or_404(Event, id=event_id, is_deleted=False)
    user = request.auth

    if event.capacity and event.capacity == 0:
        raise HttpError(400, "Capacity is full for this event.")
    
    if event.registration_end_date and event.registration_end_date < timezone.now():
        raise HttpError(400, "Registration time has ended.")
    
    if event.registration_start_date and event.registration_start_date > timezone.now():
        raise HttpError(400, "Registration time has not started yet.")

    if not event.has_available_slots:
        raise HttpError(400, "Event is full")

    # Create or get existing registration
    registration, created = Registration.objects.get_or_create(
        event=event,
        user=user,
        defaults={'status': Registration.StatusChoices.PENDING}
    )

    if not created and registration.status == Registration.StatusChoices.CONFIRMED:
        return HttpError(400, "Already registered for this event")
    
    if not event.price:
        registration.status = Registration.StatusChoices.CONFIRMED
        registration.save(update_fields=["status"])

    return registration

@events_router.put("/registrations/{int:registration_id}", response=RegistrationSchema, auth=jwt_auth)
def update_registration_status(request, registration_id: int, payload: RegistrationStatusUpdateSchema):
    """Update registration status"""
    user = request.auth

    registration = get_object_or_404(Registration, id=registration_id, user=user, is_deleted=False)
    registration.status = payload.dict(exclude_unset=True).get('status')
    registration.full_clean()
    registration.save()

    return registration

@events_router.delete("/registrations/{int:registration_id}", response=MessageSchema, auth=jwt_auth)
def cancel_registration(request, registration_id: int):
    """Cancel a registration"""
    user = request.auth

    registration = get_object_or_404(Registration, id=registration_id, user=user, is_deleted=False)
    registration.delete()
    return {"message": "Registration cancelled successfully"}
