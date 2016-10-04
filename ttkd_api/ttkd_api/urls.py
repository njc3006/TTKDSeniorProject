"""
ttkd_api URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers

# Import ViewSets
from .views.attendance_record_views import AttendanceRecordViewSet, AttendanceRecordCreateSet
from .views.person_views import PersonViewSet
from .views.program_views import ProgramViewSet, ProgramCreateSet
from .views.registration_views import RegistrationViewSet, RegistrationCreateSet
from .views import UserViewSet

router = routers.DefaultRouter()

# Register Viewsets
router.register(r'^user(s|/\d+)$', UserViewSet)
router.register(r'^person(s|/\d+)$', PersonViewSet)
router.register(r'^program(s|/\d+)$', ProgramViewSet)
router.register(r'^program/create$', ProgramCreateSet, 'program-create')
router.register(r'^check-in(s|/\d+)$', AttendanceRecordViewSet)
router.register(r'^check-in/create$', AttendanceRecordCreateSet, 'attendance-create')
router.register(r'^registration(s|/\d+)$', RegistrationViewSet)
router.register(r'^registration/create$', RegistrationCreateSet, 'registration-create')

urlpatterns = [
    url(r'^api/', include(router.urls))
]
