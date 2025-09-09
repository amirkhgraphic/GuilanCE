from ninja import Schema, ModelSchema
from typing import Optional

from users.models import User


# User Schemas
class UserRegistrationSchema(Schema):
    username: str
    email: str
    password: str
    student_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    year_of_study: Optional[int] = None
    major: Optional[str] = None

class UserLoginSchema(Schema):
    email: str
    password: str

class UserProfileSchema(ModelSchema):
    profile_picture: Optional[str] = None

    class Config:
        model = User
        model_fields = ['id', 'username', 'email', 'first_name', 'last_name',
                       'student_id', 'year_of_study', 'major', 'bio', 'date_joined']

    @staticmethod
    def resolve_profile_picture(obj, context):
        """
        Resolves the absolute URL for the profile picture.
        `context` contains the request object, which is needed for build_absolute_uri.
        """
        request = context['request']
        if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
            return request.build_absolute_uri(obj.profile_picture.url)
        return None

class UserUpdateSchema(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    year_of_study: Optional[int] = None
    major: Optional[str] = None

class TokenSchema(Schema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class PasswordResetRequestSchema(Schema):
    email: str

class PasswordResetConfirmSchema(Schema):
    token: str
    new_password: str

class UsernameCheckSchema(Schema):
    exists: bool
