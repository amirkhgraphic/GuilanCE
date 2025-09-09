from ninja import ModelSchema, Schema
from typing import Optional, List
from datetime import datetime

from api.schemas.blog import AuthorSchema
from events.models import Event, Registration
from gallery.models import Gallery


# Gallery Schemas
class EventGallerySchema(ModelSchema):
    uploaded_by: AuthorSchema
    file_size_mb: float
    markdown_url: str
    absolute_image_url: Optional[str] = None

    class Config:
        model = Gallery
        model_fields = ['id', 'title', 'description', 'image', 'alt_text',
                       'width', 'height', 'is_public', 'created_at']

    @staticmethod
    def resolve_absolute_image_url(obj, context):
        request = context['request']
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

# Events Schemas
class EventSchema(ModelSchema):
    gallery_images: List[EventGallerySchema]
    description_html: str
    registration_count: int
    absolute_featured_image_url: Optional[str] = None

    class Config:
        model = Event
        model_fields = [
            'id', 'title', 'slug', 'description', 'featured_image', 'event_type',
            'address', 'location', 'online_link', 'start_time', 'end_time',
            'registration_start_date', 'registration_end_date',
            'capacity', 'price', 'status', 'created_at', 'updated_at'
        ]

    @staticmethod
    def resolve_absolute_featured_image_url(obj, context):
        request = context['request']
        if obj.featured_image and hasattr(obj.featured_image, 'url'):
            return request.build_absolute_uri(obj.featured_image.url)
        return None

    @staticmethod
    def resolve_registration_count(obj):
        return obj.registrations.filter(status='confirmed').count()

    @staticmethod
    def resolve_description_html(obj):
        return obj.description_html


class EventListSchema(Schema):
    id: int
    title: str
    slug: str
    description: str
    featured_image: Optional[str] = None
    absolute_featured_image_url: Optional[str] = None
    event_type: str
    address: Optional[str] = None
    location: Optional[str] = None
    online_link: Optional[str] = None
    start_time: datetime
    end_time: datetime
    registration_start_date: Optional[datetime] = None
    registration_end_date: Optional[datetime] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    status: str
    registration_count: int
    created_at: datetime

    @staticmethod
    def resolve_absolute_featured_image_url(obj, context):
        request = context['request']
        if obj.featured_image and hasattr(obj.featured_image, 'url'):
            return request.build_absolute_uri(obj.featured_image.url)
        return None

    @staticmethod
    def resolve_registration_count(obj):
        return obj.registrations.filter(status='confirmed').count()

class EventCreateSchema(Schema):
    title: str
    description: str
    event_type: str
    address: Optional[str] = None
    location: Optional[str] = None
    online_link: Optional[str] = None
    start_time: datetime
    end_time: datetime
    registration_start_date: Optional[datetime] = None
    registration_end_date: Optional[datetime] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    status: str = "draft"
    gallery_image_ids: Optional[List[int]] = []

class EventUpdateSchema(Schema):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    address: Optional[str] = None
    location: Optional[str] = None
    online_link: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    registration_start_date: Optional[datetime] = None
    registration_end_date: Optional[datetime] = None
    capacity: Optional[int] = None
    price: Optional[float] = None
    status: Optional[str] = None
    gallery_image_ids: Optional[List[int]] = None

class RegistrationSchema(ModelSchema):
    user: AuthorSchema
    event: EventListSchema

    class Config:
        model = Registration
        model_fields = [
            'id', 'status', 'registered_at', 'ticket_id',
            'created_at', 'updated_at'
        ]

class RegistrationStatusUpdateSchema(Schema):
    status: str