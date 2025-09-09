from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from unfold.admin import ModelAdmin
from import_export.admin import ImportExportModelAdmin
from simplemde.widgets import SimpleMDEEditor

from users.models import User
from users.resources import UserResource
from utils.admin import SoftDeleteListFilter

class UserAdminForm(forms.ModelForm):
    bio = forms.CharField(widget=SimpleMDEEditor(), required=False)

    class Meta:
        model = User
        fields = '__all__'

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin, ImportExportModelAdmin):
    form = UserAdminForm
    resource_class = UserResource
    list_display = ('email', 'username', 'student_id', 'is_staff', 'is_email_verified', 'is_active', 'is_deleted', 'date_joined')
    list_filter = ('is_email_verified', 'is_active', 'is_staff', 'year_of_study', SoftDeleteListFilter)
    search_fields = ('email', 'username', 'student_id', 'first_name', 'last_name')
    ordering = ('-date_joined',)

    fieldsets = (
        ('Auth Credentials', {'fields': ('username', 'email', 'password')}),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'student_id', 'year_of_study', 'major', 'bio', 'profile_picture')
        }),
        ('Permissions', {
                'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions',),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        
        ('Email Verification', {
            'fields': ('is_email_verified', 'email_verification_token', 'email_verification_sent_at')
        }),
        ('Password Reset', {
            'fields': ('password_reset_token', 'password_reset_token_expires_at'),
            'classes': ('collapse',)
        }),
        ('Soft Delete', {
            'fields': ('is_deleted', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )
    add_fieldsets = (
        (
            'Step 1',
            {
                'classes': ('wide',),
                'fields': ('email', 'student_id', 'password1', 'password2', 'usable_password'),
            },
        ),
    )
    
    readonly_fields = ('email_verification_token', 'email_verification_sent_at', 'deleted_at',
                       'password_reset_token', 'password_reset_token_expires_at')
    
    actions = ['restore_users', 'verify_emails']
    
    def restore_users(self, request, queryset):
        for user in queryset:
            user.restore()
        self.message_user(request, f'Restored {queryset.count()} users.')
    restore_users.short_description = 'Restore selected users'
    
    def verify_emails(self, request, queryset):
        queryset.update(is_email_verified=True)
        self.message_user(request, f'Verified {queryset.count()} user emails.')
    verify_emails.short_description = 'Verify selected user emails'
