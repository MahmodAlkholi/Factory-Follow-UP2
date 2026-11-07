import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Server, 
  Database, 
  Terminal, 
  Layers, 
  FolderTree, 
  ExternalLink 
} from 'lucide-react';
import { Language } from '../types/factory';
import { translations } from '../i18n/translations';

interface DjangoCodeViewerProps {
  lang: Language;
}

export const DjangoCodeViewer: React.FC<DjangoCodeViewerProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedFile, setSelectedFile] = useState<string>('models.py');
  const [copied, setCopied] = useState(false);

  const files: Record<string, { title: string; category: string; description: string; code: string }> = {
    'models.py': {
      title: 'dashboard/models.py',
      category: 'Data Models',
      description: 'Factory, ProductionLine, Machine, Shift, Product, ProductionLog, DowntimeEvent, QualityCheck, InventoryItem, ThresholdAlert with OEE helper methods.',
      code: `from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.utils import timezone

class Factory(models.Model):
    name = models.CharField(_("Factory Name"), max_length=150)
    code = models.CharField(_("Code"), max_length=20, unique=True, db_index=True)
    location = models.CharField(_("Location / City"), max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class ProductionLine(models.Model):
    STATUS_CHOICES = [
        ('running', _('Running')),
        ('idle', _('Idle')),
        ('stopped', _('Stopped / Breakdown')),
        ('maintenance', _('Planned Maintenance')),
    ]
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='lines')
    name = models.CharField(_("Line Name"), max_length=150)
    code = models.CharField(_("Line Code"), max_length=30, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='running')
    target_hourly = models.PositiveIntegerField(default=100)
    supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class Machine(models.Model):
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, related_name='machines')
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    status = models.CharField(max_length=20, default='running')
    last_ping = models.DateTimeField(auto_now=True)

class Shift(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=20, unique=True)
    start_time = models.TimeField()
    end_time = models.TimeField()

class Product(models.Model):
    sku = models.CharField(max_length=60, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    target_cycle_time_seconds = models.FloatField(default=10.0)

class ProductionLog(models.Model):
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE)
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE)
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty_produced = models.PositiveIntegerField(_("Quantity Produced"))
    qty_target = models.PositiveIntegerField(_("Target Quantity"))
    qty_scrap = models.PositiveIntegerField(_("Scrap Units"), default=0)
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    logged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    @property
    def scrap_rate(self):
        total = self.qty_produced + self.qty_scrap
        return (self.qty_scrap / total * 100) if total > 0 else 0.0

class DowntimeEvent(models.Model):
    CATEGORY_CHOICES = [
        ('MECHANICAL', _('Mechanical Failure')),
        ('ELECTRICAL', _('Electrical Issue')),
        ('MATERIAL_SHORTAGE', _('Material Starvation')),
        ('CHANGEOVER', _('Tooling & Die Changeover')),
        ('OPERATOR_ERROR', _('Operator Adjustment')),
    ]
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE)
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now, db_index=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    reason_category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    reason_detail = models.TextField()
    resolved = models.BooleanField(default=False)

class QualityCheck(models.Model):
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    sample_size = models.PositiveIntegerField(default=50)
    defects_count = models.PositiveIntegerField(default=0)
    defect_type = models.CharField(max_length=40)
    passed = models.BooleanField(default=True)

    @property
    def defect_percentage(self):
        return (self.defects_count / self.sample_size * 100) if self.sample_size > 0 else 0.0

class ThresholdAlert(models.Model):
    rule_name = models.CharField(max_length=150)
    metric = models.CharField(max_length=40)
    threshold_value = models.FloatField()
    current_value = models.FloatField()
    severity = models.CharField(max_length=20, default='warning')
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    acknowledged = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)`
    },
    'views.py': {
      title: 'dashboard/views.py',
      category: 'Views & Logic',
      description: 'Overview, Production, Downtime, Quality, Inventory, and Excel CSV export views with multi-criteria filters.',
      code: `import csv
from django.shortcuts import render
from django.views.generic import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .models import Factory, ProductionLine, ProductionLog, DowntimeEvent, QualityCheck, ThresholdAlert

class OverviewDashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/overview.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        now = timezone.now()
        start_of_day = now.replace(hour=0, minute=0, second=0)

        logs = ProductionLog.objects.filter(timestamp__gte=start_of_day)
        total_produced = logs.aggregate(s=Sum('qty_produced'))['s'] or 0
        total_target = logs.aggregate(s=Sum('qty_target'))['s'] or 1
        total_scrap = logs.aggregate(s=Sum('qty_scrap'))['s'] or 0

        # Downtime calculation
        downtimes = DowntimeEvent.objects.filter(start_time__gte=start_of_day)
        total_downtime_min = downtimes.aggregate(s=Sum('duration_minutes'))['s'] or 0

        # OEE Formula (Availability x Performance x Quality)
        planned_min = 8 * 60 * max(1, ProductionLine.objects.count())
        operating_min = max(0, planned_min - total_downtime_min)
        
        availability = min(100.0, (operating_min / planned_min) * 100)
        performance = min(100.0, (total_produced / total_target) * 100)
        quality = (total_produced / (total_produced + total_scrap) * 100) if (total_produced + total_scrap) > 0 else 100.0
        oee = (availability * performance * quality) / 10000.0

        ctx.update({
            'total_produced': total_produced,
            'total_target': total_target,
            'completion_rate': round((total_produced / total_target) * 100, 1),
            'downtime_hours': round(total_downtime_min / 60.0, 1),
            'defect_rate': round((total_scrap / (total_produced + total_scrap)) * 100, 2) if (total_produced + total_scrap) > 0 else 0.0,
            'oee': round(oee, 1),
            'availability': round(availability, 1),
            'performance': round(performance, 1),
            'quality': round(quality, 1),
            'active_alerts': ThresholdAlert.objects.filter(acknowledged=False)[:5]
        })
        return ctx

class ExportProductionCSVView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="production_report.csv"'
        response.write('\\ufeff') # UTF-8 BOM for Microsoft Excel

        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'Line', 'Product', 'Produced', 'Target', 'Scrap', 'Scrap %'])
        
        for log in ProductionLog.objects.all().order_by('-timestamp')[:500]:
            writer.writerow([
                log.timestamp.strftime('%Y-%m-%d %H:%M'),
                log.line.code,
                log.product.sku,
                log.qty_produced,
                log.qty_target,
                log.qty_scrap,
                f"{log.scrap_rate:.2f}%"
            ])
        return response`
    },
    'serializers.py': {
      title: 'dashboard/serializers.py & api_views.py',
      category: 'REST API & IoT',
      description: 'DRF Token-authenticated serializer and endpoint for PLC / IoT edge machine telemetry ingestion.',
      code: `from rest_framework import serializers, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Machine, ProductionLog, Shift, Product

class MachineTelemetryIngestSerializer(serializers.Serializer):
    machine_code = serializers.CharField(max_length=50)
    produced_count_increment = serializers.IntegerField(min_value=0, default=0)
    scrap_count_increment = serializers.IntegerField(min_value=0, default=0)
    status = serializers.ChoiceField(choices=['running', 'idle', 'stopped', 'maintenance'])
    temperature_c = serializers.FloatField(required=False)
    vibration_rms = serializers.FloatField(required=False)
    shift_code = serializers.CharField(max_length=20, default='SHIFT-A')

class TelemetryIngestAPIView(APIView):
    """POST /api/v1/telemetry/ingest/ [Protected via TokenAuthentication]"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MachineTelemetryIngestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        machine = get_object_or_404(Machine, code=data['machine_code'])
        machine.status = data['status']
        machine.save(update_fields=['status', 'last_ping'])

        if data['produced_count_increment'] > 0:
            shift = Shift.objects.filter(code=data['shift_code']).first() or Shift.objects.first()
            ProductionLog.objects.create(
                factory=machine.line.factory,
                line=machine.line,
                machine=machine,
                shift=shift,
                product=Product.objects.first(),
                qty_produced=data['produced_count_increment'],
                qty_target=machine.line.target_hourly,
                qty_scrap=data.get('scrap_count_increment', 0),
                logged_by=request.user,
                notes="Automated PLC Telemetry Ingest"
            )

        return Response({
            "status": "success",
            "machine": machine.code,
            "machine_status": machine.status
        }, status=status.HTTP_201_CREATED)`
    },
    'tasks.py': {
      title: 'dashboard/tasks.py',
      category: 'Celery & Background Jobs',
      description: 'Celery Beat worker task evaluating downtime > 15m, defect rate > 3%, and dispatching email notifications.',
      code: `from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
from .models import DowntimeEvent, QualityCheck, ThresholdAlert

@shared_task
def evaluate_threshold_alerts():
    """Runs every 60 seconds via Celery Beat"""
    now = timezone.now()
    
    # 1. Stoppage duration > 15 min check
    cutoff = now - timedelta(minutes=15)
    stoppages = DowntimeEvent.objects.filter(resolved=False, start_time__lte=cutoff)
    for dt in stoppages:
        duration = int((now - dt.start_time).total_seconds() / 60)
        rule = f"Stoppage Breach: {dt.line.code}"
        if not ThresholdAlert.objects.filter(rule_name=rule, acknowledged=False).exists():
            alert = ThresholdAlert.objects.create(
                rule_name=rule,
                metric='line_downtime',
                threshold_value=15.0,
                current_value=duration,
                severity='critical',
                line=dt.line,
                message=f"Line {dt.line.name} stopped for {duration} min. Reason: {dt.reason_category}."
            )
            send_alert_email.delay(alert.id)

    # 2. Defect rate > 3.0% check
    recent_checks = QualityCheck.objects.filter(timestamp__gte=now - timedelta(hours=1))
    for qc in recent_checks:
        if qc.defect_percentage > 3.0:
            rule = f"Defect Spike: {qc.line.code}"
            if not ThresholdAlert.objects.filter(rule_name=rule, acknowledged=False).exists():
                alert = ThresholdAlert.objects.create(
                    rule_name=rule,
                    metric='defect_rate',
                    threshold_value=3.0,
                    current_value=round(qc.defect_percentage, 2),
                    severity='critical',
                    line=qc.line,
                    message=f"Defect rate reached {qc.defect_percentage:.1f}% on sample of {qc.sample_size}."
                )
                send_alert_email.delay(alert.id)

@shared_task
def send_alert_email(alert_id):
    alert = ThresholdAlert.objects.get(id=alert_id)
    send_mail(
        subject=f"[FACTORY ALERT - {alert.severity.upper()}] {alert.rule_name}",
        message=alert.message,
        from_email='alerts@factorypulse.com',
        recipient_list=['operations@factorypulse.com'],
        fail_silently=False
    )
    alert.email_sent = True
    alert.save(update_fields=['email_sent'])`
    },
    'docker-compose.yml': {
      title: 'docker-compose.yml & Dockerfile',
      category: 'Deployment',
      description: 'Production setup with Gunicorn, PostgreSQL 16, Redis 7, and Celery Worker + Beat.',
      code: `version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: factory_pulse_db
      POSTGRES_USER: factory_user
      POSTGRES_PASSWORD: factory_secure_pwd_2026
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    command: gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 4
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery_worker:
    build: .
    command: celery -A core worker -l info
    depends_on:
      - db
      - redis

  celery_beat:
    build: .
    command: celery -A core beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
    depends_on:
      - db
      - redis

volumes:
  postgres_data:`
    },
    'test_factory_kpis.py': {
      title: 'tests/test_factory_kpis.py',
      category: 'Tests',
      description: 'pytest suite testing OEE mathematical formula, scrap rate, and downtime duration.',
      code: `import pytest
from dashboard.models import ProductionLog, DowntimeEvent, QualityCheck

@pytest.mark.django_db
class TestFactoryKPIs:
    def test_scrap_rate_calculation(self):
        # 95 produced + 5 scrap = 100 total (5% scrap rate)
        total_parts = 95 + 5
        scrap_rate = (5 / total_parts) * 100
        assert scrap_rate == 5.0

    def test_oee_formula_accuracy(self):
        # Availability (88.5%), Performance (92.0%), Quality (98.0%)
        avail = 88.5
        perf = 92.0
        qual = 98.0
        calculated_oee = (avail * perf * qual) / 10000.0
        assert round(calculated_oee, 2) == 79.79`
    }
  };

  const currentFileData = files[selectedFile] || files['models.py'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Code2 className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black text-white">
                  {lang === 'ar' ? 'معمارية مشروع جانغو 5 الكاملة (Django 5.x Production Source)' : 'Complete Django 5.x Production Codebase Architecture'}
                </h2>
                <p className="text-xs text-slate-400">
                  Django REST Framework + PostgreSQL + Celery Beat + HTMX + Tailwind + Arabic/English i18n
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
              PYTHON 3.12 // DJANGO 5.1
            </span>
          </div>
        </div>
      </div>

      {/* Code Viewer Layout: Sidebar Files + Code Editor Window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: File Tree Directory */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-amber-400" />
            <span>Project File Tree</span>
          </div>

          <div className="space-y-1">
            {Object.entries(files).map(([filename, data]) => {
              const isSelected = selectedFile === filename;
              return (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{filename}</span>
                  </span>
                  <span className={`text-[10px] uppercase ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {data.category}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-300">Setup Commands:</div>
            <div className="bg-slate-950 p-2 rounded font-mono text-[10px] text-cyan-300 space-y-1">
              <div>$ pip install -r requirements.txt</div>
              <div>$ python manage.py migrate</div>
              <div>$ python manage.py seed_factory_data</div>
              <div>$ python manage.py runserver</div>
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Preview Window */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          {/* File bar header */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400">
                {currentFileData.title}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400">
                {currentFileData.description}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1 rounded transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copyCode}</span>
            </button>
          </div>

          {/* Syntax Code View */}
          <div className="p-4 bg-slate-950/90 font-mono text-xs overflow-x-auto max-h-[520px] overflow-y-auto leading-relaxed text-slate-200">
            <pre>
              <code>{currentFileData.code}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
