# CS Association Backend

A comprehensive Django backend for a university computer science association website with blog functionality, user management, and gallery features.

## Features

- **User Management**: Custom user model with JWT authentication and email verification
- **Blog System**: Full-featured blog with markdown support, categories, tags, comments, and likes
- **Gallery**: Image management system with compression and metadata extraction
- **Soft Delete**: All models support soft delete functionality
- **Admin Interface**: Modern admin interface with Django Unfold
- **API**: RESTful API built with Django Ninja
- **Background Tasks**: Celery integration for email sending and image processing
- **Docker Support**: Complete Docker setup with PostgreSQL and Redis

## Tech Stack

- **Backend**: Django 4.2 + Django Ninja
- **Database**: PostgreSQL
- **Cache/Broker**: Redis
- **Task Queue**: Celery
- **Admin**: Django Unfold
- **Authentication**: JWT
- **Containerization**: Docker + Docker Compose

## Quick Start

1. **Clone and Setup**
   \`\`\`bash
   git clone <repository-url>
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

2. **Run with Docker**
   \`\`\`bash
   docker-compose up --build
   \`\`\`

3. **Create Superuser**
   \`\`\`bash
   docker-compose exec web python manage.py createsuperuser
   \`\`\`

4. **Access the Application**
   - API: http://localhost:8000/api/docs
   - Admin: http://localhostx:8000/admin/
   - Flower (Celery Monitor): http://localhost:5555/

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/verify-email/{token}\` - Verify email
- \`GET /api/auth/profile\` - Get user profile
- \`PUT /api/auth/profile\` - Update user profile
- \`POST /api/auth/profile/picture\` - Upload profile picture

### Blog
- \`GET /api/blog/posts\` - List posts
- \`GET /api/blog/posts/{slug}\` - Get post detail
- \`POST /api/blog/posts\` - Create post (committee only)
- \`PUT /api/blog/posts/{slug}\` - Update post
- \`DELETE /api/blog/posts/{slug}\` - Delete post
- \`GET /api/blog/posts/{slug}/comments\` - List comments
- \`POST /api/blog/posts/{slug}/comments\` - Create comment
- \`POST /api/blog/posts/{slug}/like\` - Toggle like

### Gallery
- \`GET /api/gallery/images\` - List gallery images
- \`POST /api/gallery/images\` - Upload image (committee only)
- \`PUT /api/gallery/images/{id}\` - Update image metadata
- \`DELETE /api/gallery/images/{id}\` - Delete image

## User Roles

- **Student**: Can register, comment, like posts
- **Member**: Student with additional privileges
- **Committee**: Can create posts and upload images
- **Admin**: Full access to admin interface

## Development

### Running Tests
\`\`\`bash
docker-compose exec web python manage.py test
\`\`\`

### Database Migrations
\`\`\`bash
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
\`\`\`

### Collect Static Files
\`\`\`bash
docker-compose exec web python manage.py collectstatic
\`\`\`

### Shell Access
\`\`\`bash
docker-compose exec web python manage.py shell
\`\`\`

## Environment Variables

Key environment variables (see .env.example for full list):

- \`SECRET_KEY\`: Django secret key
- \`DEBUG\`: Debug mode (True/False)
- \`DB_NAME\`, \`DB_USER\`, \`DB_PASSWORD\`: Database configuration
- \`EMAIL_HOST\`, \`EMAIL_HOST_USER\`, \`EMAIL_HOST_PASSWORD\`: Email configuration
- \`JWT_SECRET_KEY\`: JWT signing key
- \`REDIS_URL\`: Redis connection URL

## Production Deployment

1. Set \`DEBUG=False\` in environment
2. Configure proper email settings
3. Set up SSL/HTTPS
4. Configure static file serving
5. Set up monitoring and logging
6. Configure backup strategy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`

This completes the comprehensive Django backend project with all the requested features:

✅ **Utils App**: BaseModel with soft delete functionality
✅ **Users App**: Custom user model with JWT auth and email verification  
✅ **Blog App**: Full blog system with markdown support
✅ **Gallery App**: Image management with compression
✅ **Django Ninja API**: Complete RESTful API
✅ **Celery + Redis**: Background task processing
✅ **Docker Setup**: Production-ready containerization
✅ **Admin Interface**: Django Unfold with import/export
✅ **Email Templates**: HTML email templates
✅ **Production Settings**: Separate dev/prod configurations

The project is ready to run with `docker-compose up --build`!
