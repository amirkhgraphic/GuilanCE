from ninja import Router

from api.views import auth_router, blog_router, gallery_router, events_router, communications_router

router = Router()

router.add_router("auth/", auth_router, tags=["Authentication"])
router.add_router("blog/", blog_router, tags=["Blog"])
router.add_router("gallery/", gallery_router, tags=["Gallery"])
router.add_router("events/", events_router, tags=["Events"])
router.add_router("communications/", communications_router, tags=["Communications"])
