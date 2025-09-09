from django.contrib import admin
from django.utils.translation import gettext_lazy as _

class SoftDeleteListFilter(admin.SimpleListFilter):
    title = _('Soft Delete Status')
    parameter_name = 'is_deleted'

    def lookups(self, request, model_admin):
        return [
            ('0', _('Active')),
            ('1', _('Deleted')),
        ]

    def queryset(self, request, queryset):
        if self.value() == '0':
            return queryset.filter(is_deleted=False)
        if self.value() == '1':
            return queryset.model.deleted_objects.all()
        return queryset.model.all_objects.all()
