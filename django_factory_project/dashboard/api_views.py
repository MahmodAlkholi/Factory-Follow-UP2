"""
Django REST Framework API Views
Token-authenticated IoT ingestion & REST endpoints
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Machine, ProductionLog, Shift, Product, DowntimeEvent, ThresholdAlert
from .serializers import MachineTelemetryIngestSerializer, ProductionLogSerializer, DowntimeEventSerializer


class TelemetryIngestAPIView(APIView):
    """
    POST /api/v1/telemetry/ingest/
    Protected via TokenAuthentication (e.g. Authorization: Token <api-key>)
    Directly updates machine operational status and increments shift production counter.
    """
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = MachineTelemetryIngestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        machine = get_object_or_404(Machine, code=data['machine_code'])

        # 1. Update machine telemetry state
        old_status = machine.status
        machine.status = data['status']
        machine.save(update_fields=['status', 'last_ping'])

        # 2. If status flipped to stopped, create or update a DowntimeEvent
        if old_status != 'stopped' and data['status'] == 'stopped':
            shift = Shift.objects.filter(code=data['shift_code']).first() or Shift.objects.first()
            DowntimeEvent.objects.create(
                machine=machine,
                line=machine.line,
                shift=shift,
                start_time=timezone.now(),
                reason_category='MECHANICAL',
                reason_detail=data.get('notes', 'Automated PLC breakdown trigger'),
                logged_by=request.user
            )

        # 3. If production units produced increment > 0, log production count
        if data['produced_count_increment'] > 0:
            shift = Shift.objects.filter(code=data['shift_code']).first() or Shift.objects.first()
            default_product = Product.objects.first()

            ProductionLog.objects.create(
                factory=machine.line.factory,
                line=machine.line,
                machine=machine,
                shift=shift,
                product=default_product,
                qty_produced=data['produced_count_increment'],
                qty_target=machine.line.target_hourly,
                qty_scrap=data.get('scrap_count_increment', 0),
                timestamp=timezone.now(),
                logged_by=request.user,
                notes="Automated PLC Telemetry Stream"
            )

        return Response({
            "status": "success",
            "machine": machine.code,
            "machine_status": machine.status,
            "produced_increment": data['produced_count_increment'],
            "timestamp": timezone.now().isoformat()
        }, status=status.HTTP_201_CREATED)
