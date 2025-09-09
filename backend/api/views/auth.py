from typing import List

from django.conf import settings
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

import uuid
from ninja import Router

from users.models import User
from users.tasks import send_verification_email, send_password_reset_email
from api.authentication import create_jwt_token, create_refresh_token, jwt_auth
from api.schemas import (
    UserRegistrationSchema, UserLoginSchema, UserProfileSchema,
    UserUpdateSchema, TokenSchema, MessageSchema, ErrorSchema,
    PasswordResetRequestSchema, PasswordResetConfirmSchema, UsernameCheckSchema
)

auth_router = Router()

@auth_router.post("/register", response={201: MessageSchema, 400: ErrorSchema})
def register(request, data: UserRegistrationSchema):
    """Register a new user"""
    try:
        # Check if user already exists
        if User.objects.filter(email=data.email).exists():
            return 400, {"error": "User with this email already exists"}
        
        if User.objects.filter(student_id=data.student_id).exists():
            return 400, {"error": "User with this student ID already exists"}
        
        # Create user
        User.objects.create_user(
            username=data.username,
            email=data.email,
            password=data.password,
            student_id=data.student_id,
            first_name=data.first_name or "",
            last_name=data.last_name or "",
            year_of_study=data.year_of_study,
            major=data.major or "",
        )
        
        return 201, {"message": "User registered successfully. Please check your email for verification."}
        
    except Exception as e:
        return 400, {"error": "Registration failed", "details": str(e)}

@auth_router.post("/login", response={200: TokenSchema, 401: ErrorSchema})
def login(request, data: UserLoginSchema):
    """Login user and return JWT tokens"""
    user = authenticate(email=data.email, password=data.password)
    
    if not user:
        return 401, {"error": "Invalid credentials"}
    
    if not user.is_email_verified:
        return 401, {"error": "Please verify your email before logging in"}
    
    if not user.is_active:
        return 401, {"error": "Account is deactivated"}
    
    access_token = create_jwt_token(user)
    refresh_token = create_refresh_token(user)
    
    return 200, {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@auth_router.get("/verify-email/{token}", response={200: MessageSchema, 400: ErrorSchema})
def verify_email(request, token: str):
    """Verify user email with token"""
    try:
        user = get_object_or_404(User, email_verification_token=token)
        
        if user.is_email_verified:
            return 400, {"error": "Email already verified"}
        
        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])
        
        return 200, {"message": "Email verified successfully"}
        
    except User.DoesNotExist:
        return 400, {"error": "Invalid verification token"}

@auth_router.post("/resend-verification", response={200: MessageSchema, 400: ErrorSchema})
def resend_verification(request, email: str):
    """Resend verification email"""
    try:
        user = get_object_or_404(User, email=email)
        
        if user.is_email_verified:
            return 400, {"error": "Email already verified"}
        
        # Generate new token
        user.regenerate_verification_token()
        user.email_verification_sent_at = timezone.now()
        user.save(update_fields=['email_verification_sent_at'])
        
        # Send verification email
        verification_url = f"http://localhost:3000/verify-email/{user.email_verification_token}"
        send_verification_email.delay(user.id, verification_url)
        
        return 200, {"message": "Verification email sent"}
        
    except User.DoesNotExist:
        return 400, {"error": "User not found"}

@auth_router.get("/profile", response=UserProfileSchema, auth=jwt_auth)
def get_profile(request):
    """Get current user profile"""
    return request.auth

@auth_router.put("/profile", response={200: UserProfileSchema, 400: ErrorSchema}, auth=jwt_auth)
def update_profile(request, data: UserUpdateSchema):
    """Update current user profile"""
    user = request.auth
    
    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    user.save()
    return 200, user

@auth_router.post("/profile/picture", response={200: MessageSchema, 400: ErrorSchema}, auth=jwt_auth)
def upload_profile_picture(request):
    """Upload profile picture"""
    if 'file' not in request.FILES:
        return 400, {"error": "No file provided"}
    
    file = request.FILES['file']
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        return 400, {"error": "File must be an image"}
    
    # Validate file size (5MB max)
    if file.size > 5 * 1024 * 1024:
        return 400, {"error": "File size must be less than 5MB"}
    
    user = request.auth
    
    # Delete old profile picture if exists
    if user.profile_picture:
        default_storage.delete(user.profile_picture.name)
    
    # Save new profile picture
    filename = f"profile_pictures/{user.id}_{uuid.uuid4().hex}.{file.name.split('.')[-1]}"
    user.profile_picture.save(filename, ContentFile(file.read()))
    
    return 200, {"message": "Profile picture updated successfully"}

@auth_router.delete("/profile/picture", response={200: MessageSchema}, auth=jwt_auth)
def delete_profile_picture(request):
    """Delete current user's profile picture"""
    user = request.auth
    
    if user.profile_picture:
        default_storage.delete(user.profile_picture.name)
        user.profile_picture = None
        user.save(update_fields=['profile_picture'])
    
    return 200, {"message": "Profile picture deleted successfully"}

@auth_router.post("/request-password-reset", response={200: MessageSchema, 400: ErrorSchema})
def request_password_reset(request, data: PasswordResetRequestSchema):
    """Request a password reset email"""
    try:
        user = get_object_or_404(User, email=data.email)
        user.set_password_reset_token()

        reset_url = f"{settings.FRONTEND_PASSWORD_RESET_PAGE}/{user.password_reset_token}"
        send_password_reset_email.delay(user.id, reset_url)

        return 200, {"message": "If an account with that email exists, a password reset email has been sent."}

    except User.DoesNotExist:
        # For security reasons, always return a generic success message
        # to avoid revealing whether an email exists in the system.
        return 200, {"message": "If an account with that email exists, a password reset email has been sent."}

    except Exception as e:
        return 400, {"error": "Failed to request password reset", "details": str(e)}

@auth_router.post("/reset-password-confirm", response={200: MessageSchema, 400: ErrorSchema})
def reset_password_confirm(request, data: PasswordResetConfirmSchema):
    """Confirm password reset with token and new password"""
    try:
        user = get_object_or_404(User, password_reset_token=data.token)

        if user.password_reset_token_expires_at < timezone.now():
            user.password_reset_token = None
            user.password_reset_token_expires_at = None
            user.save(update_fields=['password_reset_token', 'password_reset_token_expires_at'])
            return 400, {"error": "Password reset token has expired."}

        user.set_password(data.new_password)
        user.password_reset_token = None
        user.password_reset_token_expires_at = None
        user.save(update_fields=['password', 'password_reset_token', 'password_reset_token_expires_at'])

        return 200, {"message": "Your password has been reset successfully."}

    except User.DoesNotExist:
        return 400, {"error": "Invalid or expired password reset token."}

    except Exception as e:
        return 400, {"error": "Failed to reset password", "details": str(e)}

@auth_router.get("/users/deleted", response=List[UserProfileSchema], auth=jwt_auth)
def list_deleted_users(request):
    """List all soft-deleted users (Admin/Committee only)"""
    if not (request.auth.is_staff or request.auth.is_superuser):
        return 403, {"error": "Permission denied"}

    return User.deleted_objects.all()  # Use the 'dead' manager to get only deleted users

@auth_router.post("/users/{user_id}/restore", response={200: MessageSchema, 400: ErrorSchema}, auth=jwt_auth)
def restore_user(request, user_id: int):
    """Restore a soft-deleted user (Admin/Committee only)"""
    if not (request.auth.is_staff or request.auth.is_superuser):
        return 403, {"error": "Permission denied"}

    try:
        user = User.deleted_objects.get(id=user_id)
        user.restore()
        return 200, {"message": f"User {user.username} restored successfully."}
    except User.DoesNotExist:
        return 400, {"error": "User not found or not soft-deleted."}
    except Exception as e:
        return 400, {"error": "Failed to restore user", "details": str(e)}

@auth_router.get("/check-username", response=UsernameCheckSchema)
def check_username_availability(request, username: str):
    """Check if a username is available for registration"""
    exists = User.objects.filter(username=username).exists()
    return { "exists": exists }