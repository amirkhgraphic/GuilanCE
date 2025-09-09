from django.contrib import admin
from django import forms

from unfold.admin import ModelAdmin
from simplemde.widgets import SimpleMDEEditor
from import_export.admin import ImportExportModelAdmin

from utils.admin import SoftDeleteListFilter
from events.models import Event, Registration
from events.resources import EventResource, RegistrationResource

class EventAdminForm(forms.ModelForm):
    description = forms.CharField(
        widget=SimpleMDEEditor(),
        help_text="Event description in Markdown format with live preview"
    )

    class Meta:
        model = Event
        fields = '__all__'


@admin.register(Event)
class EventAdmin(ModelAdmin, ImportExportModelAdmin):
    form = EventAdminForm
    resource_class = EventResource
    list_display = (
        'title', 'event_type', 'start_time', 'end_time', 'status',
        'price_display', 'capacity_display', 'is_registration_open_display', 'is_deleted'
    )
    list_filter = (
        'event_type', 'status', 'is_deleted',
        'start_time', 'end_time', 'registration_start_date', 'registration_end_date',
        SoftDeleteListFilter
    )
    search_fields = ('title', 'description', 'address')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'start_time'
    filter_horizontal = ('gallery_images',)

    fieldsets = (
        ('Event Details', {
            'fields': ('title', 'slug', 'description', 'featured_image')
        }),
        ('Timing & Type', {
            'fields': ('start_time', 'end_time', 'event_type', 'status')
        }),
        ('Location & Online', {
            'fields': ('address', 'location', 'online_link'),
            'description': 'For On-Site or Hybrid events, provide address and select on map. For Online events, provide a link.'
        }),
        ('Registration & Pricing', {
            'fields': ('capacity', 'price', 'registration_start_date', 'registration_end_date'),
            'description': 'Leave capacity blank for unlimited. Leave price blank for free events.'
        }),
        ('Gallery', {
            'fields': ('gallery_images',),
            'description': 'Add images related to this event from the Gallery app.'
        }),
        ('Soft Delete', {
            'fields': ('is_deleted', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ('deleted_at',)

    actions = [
        'make_published', 'make_draft', 'make_cancelled', 'make_completed',
        'restore_events'
    ]

    def price_display(self, obj):
        return f"${obj.price:.2f}" if obj.price is not None else "Free"

    price_display.short_description = "Price"

    def capacity_display(self, obj):
        return obj.capacity if obj.capacity is not None else "Unlimited"

    capacity_display.short_description = "Capacity"

    def is_registration_open_display(self, obj):
        return "Yes" if obj.is_registration_open else "No"

    is_registration_open_display.short_description = "Registration Open"
    is_registration_open_display.boolean = True

    def make_published(self, request, queryset):
        queryset.update(status=Event.StatusChoices.PUBLISHED)
        self.message_user(request, f"Published {queryset.count()} events.")

    make_published.short_description = "Mark selected events as published"

    def make_draft(self, request, queryset):
        queryset.update(status=Event.StatusChoices.DRAFT)
        self.message_user(request, f"Marked {queryset.count()} events as draft.")

    make_draft.short_description = "Mark selected events as draft"

    def make_cancelled(self, request, queryset):
        queryset.update(status=Event.StatusChoices.CANCELLED)
        self.message_user(request, f"Cancelled {queryset.count()} events.")

    make_cancelled.short_description = "Mark selected events as cancelled"

    def make_completed(self, request, queryset):
        queryset.update(status=Event.StatusChoices.COMPLETED)
        self.message_user(request, f"Marked {queryset.count()} events as completed.")

    make_completed.short_description = "Mark selected events as completed"

    def restore_events(self, request, queryset):
        for event in queryset:
            event.restore()
        self.message_user(request, f"Restored {queryset.count()} events.")

    restore_events.short_description = "Restore selected events"


@admin.register(Registration)
class RegistrationAdmin(ModelAdmin, ImportExportModelAdmin):
    resource_class = RegistrationResource
    list_display = (
        'user', 'event', 'status', 'registered_at', 'ticket_id', 'is_deleted'
    )
    list_filter = (
        'status', 'event', 'user', 'is_deleted', 'registered_at',
        SoftDeleteListFilter
    )
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name', 'event__title', 'ticket_id')
    readonly_fields = ('ticket_id', 'registered_at', 'deleted_at')

    fieldsets = (
        ('Registration Details', {
            'fields': ('user', 'event', 'status', 'registered_at', 'ticket_id')
        }),
        ('Soft Delete', {
            'fields': ('is_deleted', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )

    actions = [
        'confirm_registrations', 'cancel_registrations', 'mark_attended',
        'restore_registrations'
    ]

    def confirm_registrations(self, request, queryset):
        queryset.update(status=Registration.StatusChoices.CONFIRMED)
        self.message_user(request, f"Confirmed {queryset.count()} registrations.")

    confirm_registrations.short_description = "Confirm selected registrations"

    def cancel_registrations(self, request, queryset):
        queryset.update(status=Registration.StatusChoices.CANCELLED)
        self.message_user(request, f"Cancelled {queryset.count()} registrations.")

    cancel_registrations.short_description = "Cancel selected registrations"

    def mark_attended(self, request, queryset):
        queryset.update(status=Registration.StatusChoices.ATTENDED)
        self.message_user(request, f"Marked {queryset.count()} registrations as attended.")

    mark_attended.short_description = "Mark selected registrations as attended"

    def restore_registrations(self, request, queryset):
        for registration in queryset:
            registration.restore()
        self.message_user(request, f"Restored {queryset.count()} registrations.")

    restore_registrations.short_description = "Restore selected registrations"
