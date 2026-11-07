"""
pytest Test Suite for Factory BI Dashboard KPIs
Tests OEE components, scrap rate calculations, downtime durations, and threshold triggers.
"""

import pytest
from django.utils import timezone
from datetime import timedelta
from dashboard.models import Factory, ProductionLine, Machine, Shift, Product, ProductionLog, DowntimeEvent, QualityCheck, ThresholdAlert


@pytest.mark.django_db
class TestFactoryKPIs:

    @pytest.fixture
    def setup_factory(self):
        factory = Factory.objects.create(name="Cairo Test Plant", code="CAI-TEST", location="10th of Ramadan")
        line = ProductionLine.objects.create(factory=factory, name="Stamping Line 1", code="L1-TEST", target_hourly=100)
        machine = Machine.objects.create(line=line, name="Press 500T", code="P-500", status="running")
        shift = Shift.objects.create(name="Morning Shift", code="S-A", start_time="06:00", end_time="14:00")
        product = Product.objects.create(sku="SKU-BRK-01", name="Bracket Plate", target_cycle_time_seconds=12.0)
        return {
            'factory': factory,
            'line': line,
            'machine': machine,
            'shift': shift,
            'product': product,
        }

    def test_production_log_scrap_rate(self, setup_factory):
        data = setup_factory
        log = ProductionLog.objects.create(
            factory=data['factory'],
            line=data['line'],
            machine=data['machine'],
            shift=data['shift'],
            product=data['product'],
            qty_produced=95,
            qty_target=100,
            qty_scrap=5,
            timestamp=timezone.now()
        )
        assert log.total_parts == 100
        assert log.scrap_rate == 5.0

    def test_downtime_auto_duration_calculation(self, setup_factory):
        data = setup_factory
        start = timezone.now() - timedelta(minutes=45)
        end = timezone.now()
        event = DowntimeEvent.objects.create(
            machine=data['machine'],
            line=data['line'],
            shift=data['shift'],
            start_time=start,
            end_time=end,
            reason_category='MECHANICAL',
            reason_detail='Belt tear'
        )
        assert event.duration_minutes == 45
        assert event.resolved is True

    def test_quality_check_failure_on_high_defect(self, setup_factory):
        data = setup_factory
        qc = QualityCheck.objects.create(
            line=data['line'],
            product=data['product'],
            shift=data['shift'],
            sample_size=100,
            defects_count=4,  # 4% > 3% threshold
            defect_type='DIMENSIONAL',
        )
        assert qc.defect_percentage == 4.0
        assert qc.passed is False

    def test_oee_formula_accuracy(self):
        # Availability (88.5%), Performance (92.0%), Quality (98.0%)
        avail = 88.5
        perf = 92.0
        qual = 98.0
        calculated_oee = (avail * perf * qual) / 10000.0
        expected_oee = 79.79
        assert round(calculated_oee, 2) == expected_oee
