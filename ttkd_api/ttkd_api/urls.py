"""
ttkd_api URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers

# Import ViewSets
from .views.attendance_record_views import AttendanceRecordViewSet
from .views.person_views import PersonViewSet
from .views.program_views import ProgramViewSet, StudentList
from .views.registration_views import RegistrationViewSet
from .views.email_views import EmailViewSet
from .views import UserViewSet

router = routers.DefaultRouter()

# Register Viewsets
router.register(r'users', UserViewSet)
router.register(r'persons', PersonViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'check-ins', AttendanceRecordViewSet)
router.register(r'registrations', RegistrationViewSet)
router.register(r'students', StudentList, 'student-list')
router.register(r'emails', EmailViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
]
