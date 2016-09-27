"""
ttkd_api URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers

# Import ViewSets
from .views import UserViewSet, index

router = routers.DefaultRouter()

# Register Viewsets
router.register(r'users', UserViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls))
]
