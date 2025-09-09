from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.text import slugify

import uuid
import markdown
from location_field.models.plain import PlainLocationField as LocationField

from utils.models import BaseModel


class Event(BaseModel):
    class TypeChoices(models.TextChoices):
        ONLINE = 'online', 'Online'
        ON_SITE = 'on_site', 'On-Site'
        HYBRID = 'hybrid', 'Hybrid'

    class StatusChoices(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        CANCELLED = 'cancelled', 'Cancelled'
        COMPLETED = 'completed', 'Completed'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(help_text="Event description in Markdown format")

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    address = models.CharField(max_length=255, blank=True, null=True, help_text="Physical address or venue name")
    location = LocationField(based_fields=['address'], zoom=15, blank=True, null=True,
                             help_text="Select location on map")

    event_type = models.CharField(max_length=10, choices=TypeChoices.choices, default=TypeChoices.ON_SITE)
    online_link = models.URLField(max_length=500, blank=True, null=True,
                                  help_text="Link for online events (e.g., Zoom, Google Meet)")

    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.DRAFT)
    capacity = models.PositiveIntegerField(null=True, blank=True,
                                           help_text="Maximum number of attendees (leave blank for unlimited)")

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                help_text="Price of the event. Leave blank for free events.")

    registration_start_date = models.DateTimeField(null=True, blank=True)
    registration_end_date = models.DateTimeField(null=True, blank=True)
    featured_image = models.ImageField(upload_to='events/featured/', null=True, blank=True)
    gallery_images = models.ManyToManyField('gallery.Gallery', blank=True, related_name='event_galleries',
                                            help_text="Images taken during or related to the event.")

    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['status', 'start_time']),
            models.Index(fields=['event_type']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def description_html(self):
        """Convert markdown description to HTML"""
        return markdown.markdown(
            self.description,
            extensions=[
                'markdown.extensions.extra',
                'markdown.extensions.toc',
            ]
        )

    @property
    def is_registration_open(self):
        """Check if registration is currently open (only if price is not null or capacity is set)"""
        if self.price is None and self.capacity is None:
            return False

        now = timezone.now()
        return (self.registration_start_date is None or now >= self.registration_start_date) and \
            (self.registration_end_date is None or now <= self.registration_end_date)

    @property
    def current_attendees_count(self):
        """Count confirmed attendees"""
        return self.registrations.filter(status=Registration.StatusChoices.CONFIRMED, is_deleted=False).count()

    @property
    def has_available_slots(self):
        """Check if there are available slots for registration"""
        if self.capacity is None:
            return True  # Unlimited capacity
        return self.current_attendees_count < self.capacity


class Registration(BaseModel):
    class StatusChoices(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'
        ATTENDED = 'attended', 'Attended'

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_registrations')
    registered_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=StatusChoices.choices,
                              default=StatusChoices.PENDING)
    ticket_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    class Meta:
        unique_together = ['event', 'user']
        ordering = ['registered_at']
        indexes = [
            models.Index(fields=['event', 'status']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.user.username} registered for {self.event.title}"
