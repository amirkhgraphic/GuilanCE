from django.conf import settings
from ninja.security import HttpBearer  
from datetime import datetime, timedelta
from django.utils import timezone
import jwt
from users.models import User

class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user_id = payload.get('user_id')
            if user_id:
                user = User.objects.get(id=user_id, is_email_verified=True, is_active=True)
                return user
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
            pass
        return None

def create_jwt_token(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': timezone.now() + timedelta(seconds=settings.JWT_ACCESS_TOKEN_LIFETIME),
        'iat': timezone.now(),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(user):
    payload = {
        'user_id': user.id,
        'type': 'refresh',
        'exp': timezone.now() + timedelta(seconds=settings.JWT_REFRESH_TOKEN_LIFETIME),
        'iat': timezone.now(),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

jwt_auth = JWTAuth()
