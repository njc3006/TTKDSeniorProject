"""
ttkd_api URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings

# Import ViewSets
from .views.waiver_views import WaiverViewSet, WaiverImageViewSet
from .views.import_views import import_data
from .views.export_views import export_data, export_attendance, export_contacts, export_to_excel
from .views.person_belt_views import PersonBeltViewSet
from .views.belt_views import BeltViewSet
from .views.attendance_record_views import AttendanceRecordViewSet, \
    AttendanceRecordUsingPersonViewSet, DetailedAttendanceRecordViewSet, \
    get_grouped_attendance_records
from .views.person_views import PersonViewSet, PersonPictureViewSet
from .views.program_views import ProgramViewSet, StudentList
from .views.registration_views import MinimalRegistrationViewSet, RegistrationViewSet, \
    RegistrationWithPeopleViewSet, SimpleRegistrationViewSet
from .views.email_views import EmailViewSet
from .views import UserViewSet
from .views.stripe_views import StripeViewSet
from .views.person_stripe_views import PersonStripeViewSet
from .views.people_views import PeopleViewSet

router = routers.DefaultRouter()

# Register Viewsets
router.register(r'users', UserViewSet)
router.register(r'persons', PersonViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'check-ins', AttendanceRecordViewSet)
router.register(r'check-ins-detailed', DetailedAttendanceRecordViewSet)
router.register(r'checked-in/persons', AttendanceRecordUsingPersonViewSet, 'checked-in-persons')
router.register(r'registrations-minimal', MinimalRegistrationViewSet, 'registrations-minimal')
router.register(r'register', RegistrationViewSet, 'register')
router.register(r'registrations', SimpleRegistrationViewSet)
router.register(r'students', StudentList, 'student-list')
router.register(r'emails', EmailViewSet)
router.register(r'stripes', StripeViewSet)
router.register(r'person-stripes', PersonStripeViewSet)
router.register(r'belts', BeltViewSet)
router.register(r'person-belts', PersonBeltViewSet)
router.register(r'people', PeopleViewSet, 'people')
router.register(r'class-people', RegistrationWithPeopleViewSet, 'class-people')
router.register(r'waivers', WaiverViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api/grouped-check-ins-detailed', get_grouped_attendance_records),
    url(r'^api/person/(?P<pk>[0-9]+)/picture', PersonPictureViewSet.as_view({'post': 'picture'})),
    url(r'^api/waiver/(?P<pk>[0-9]+)/image', WaiverImageViewSet.as_view({'post': 'waiver_image'})),
    url(r'^api/import/', import_data),
    url(r'^api/export/', export_data),
    url(r'^api/csv/attendance', export_attendance),
    url(r'^api/csv/contacts', export_contacts),
    url(r'^api/excel/system', export_to_excel)
    ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
