"""
ttkd_api URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers

# Import the function to serve the UI
from static_serve import serve_ui

# Import ViewSets
from .views import UserViewSet

router = routers.DefaultRouter()

# Register Viewsets
router.register(r'users', UserViewSet)

urlpatterns = [
	url(r'^$', serve_ui)
    url(r'^api/', include(router.urls))
]
