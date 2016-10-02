"""AttendanceRecordViewSet"""
from rest_framework import viewsets, mixins
from ..serializers.attendance_record_serializer import AttendanceRecordSerializer
from ..models.attendance_record import AttendanceRecord


class AttendanceRecordViewSet(viewsets.ReadOnlyModelViewSet):
    """Returns All AttendanceRecord Objects To The Route AKA Check-ins"""
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer


class AttendanceRecordCreateSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Check-In The Passed Student To The Passed Program,
    Time Is Not Required System Will Generate If Not Passed"""
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
