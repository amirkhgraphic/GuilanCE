from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget

from events.models import Event, Registration
from users.models import User
from gallery.models import Gallery

class EventResource(resources.ModelResource):
    gallery_images = fields.Field(
        column_name='gallery_images',
        attribute='gallery_images',
        widget=ManyToManyWidget(Gallery, field='title', separator='|')
    )

    class Meta:
        model = Event
        fields = (
            'id', 'title', 'slug', 'description', 'start_time', 'end_time',
            'event_type', 'address', 'location', 'online_link', 'status',
            'capacity', 'price', 'registration_start_date', 'registration_end_date',
            'featured_image', 'gallery_images', 'created_at', 'updated_at',
            'is_deleted', 'deleted_at'
        )
        export_order = fields

class RegistrationResource(resources.ModelResource):
    event = fields.Field(
        column_name='event',
        attribute='event',
        widget=ForeignKeyWidget(Event, 'title')
    )
    user = fields.Field(
        column_name='user',
        attribute='user',
        widget=ForeignKeyWidget(User, 'username')
    )

    class Meta:
        model = Registration
        fields = (
            'id', 'event', 'user', 'registered_at', 'status', 'ticket_id',
            'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        )
        export_order = fields
