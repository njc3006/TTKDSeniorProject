"""
ttkd_api URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings

# Import ViewSets
from .views.attendance_record_views import AttendanceRecordViewSet, AttendanceRecordUsingPersonViewSet
from .views.person_views import PersonViewSet
from .views.program_views import ProgramViewSet, StudentList
from .views.registration_views import RegistrationViewSet
from .views.email_views import EmailViewSet
from .views import UserViewSet
from .views.stripe_views import StripeViewSet
from .views.person_stripe_views import PersonStripeViewSet

router = routers.DefaultRouter()

# Register Viewsets
router.register(r'users', UserViewSet)
router.register(r'persons', PersonViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'check-ins', AttendanceRecordViewSet)
router.register(r'checked-in/persons', AttendanceRecordUsingPersonViewSet, 'checked-in-persons')
router.register(r'registrations', RegistrationViewSet)
router.register(r'students', StudentList, 'student-list')
router.register(r'emails', EmailViewSet)
router.register(r'stripes', StripeViewSet)
router.register(r'person-stripes', PersonStripeViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
