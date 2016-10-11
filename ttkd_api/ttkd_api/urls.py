"""
ttkd_api URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings

# Import ViewSets
from .views.attendance_record_views import AttendanceRecordViewSet, AttendanceRecordCreateSet
from .views.person_views import PersonViewSet
from .views.program_views import ProgramViewSet, ProgramCreateSet, StudentList
from .views.registration_views import RegistrationViewSet, RegistrationCreateSet
from .views.email_views import EmailViewSet, EmailCreateSet
from .views import UserViewSet

router = routers.DefaultRouter()

# Register Viewsets
router.register(r'users', UserViewSet)
router.register(r'persons', PersonViewSet)
router.register(r'person', PersonViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'program/create', ProgramCreateSet, 'program-create')
router.register(r'check-ins', AttendanceRecordViewSet)
router.register(r'check-in/create', AttendanceRecordCreateSet, 'attendance-create')
router.register(r'registrations', RegistrationViewSet)
router.register(r'registration/create', RegistrationCreateSet, 'registration-create')
router.register(r'students', StudentList, 'student-list')
router.register(r'emails', EmailViewSet)
router.register(r'email/create', EmailCreateSet, 'email-create')

urlpatterns = [
    url(r'^api/', include(router.urls)),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
