"""
Django REST Framework Serializers & Telemetry Ingestion Serializer
Token-Authenticated IoT Ingestion
"""

from rest_framework import serializers
from .models import (
    Factory, ProductionLine, Machine, Shift, Product,
    ProductionLog, DowntimeEvent, QualityCheck, InventoryItem, ThresholdAlert
)


class MachineTelemetryIngestSerializer(serializers.Serializer):
    """
    Validates high-frequency PLC / edge gateway IoT payload
    Example:
    {
      "machine_code": "HP-500",
      "produced_count_increment": 1,
      "scrap_count_increment": 0,
      "status": "running",
      "temperature_c": 64.2,
      "vibration_rms": 2.1,
      "rpm": 1200,
      "operator_id": 1,
      "shift_code": "SHIFT-A"
    }
    """
    machine_code = serializers.CharField(max_length=50)
    produced_count_increment = serializers.IntegerField(min_value=0, default=0)
    scrap_count_increment = serializers.IntegerField(min_value=0, default=0)
    status = serializers.ChoiceField(choices=['running', 'idle', 'stopped', 'maintenance'])
    temperature_c = serializers.FloatField(required=False)
    vibration_rms = serializers.FloatField(required=False)
    rpm = serializers.IntegerField(required=False)
    shift_code = serializers.CharField(max_length=20, default='SHIFT-A')
    notes = serializers.CharField(max_length=255, required=False, allow_blank=True)


class ProductionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionLog
        fields = '__all__'


class DowntimeEventSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.name', read_only=True)
    line_name = serializers.CharField(source='line.name', read_only=True)

    class Meta:
        model = DowntimeEvent
        fields = '__all__'


class QualityCheckSerializer(serializers.ModelSerializer):
    defect_percentage = serializers.ReadOnlyField()

    class Meta:
        model = QualityCheck
        fields = '__all__'


class InventoryItemSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = InventoryItem
        fields = '__all__'


class ThresholdAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThresholdAlert
        fields = '__all__'
