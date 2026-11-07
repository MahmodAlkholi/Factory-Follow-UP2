"""
Django Views - Factory Data Follow-up Dashboard
Supports Full Page & HTMX Partial Updates, Multi-criteria Filters, and CSV/PDF Export
"""

import csv
from io import BytesIO
from django.shortcuts import render, get_object_or_404
from django.views.generic import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.http import HttpResponse, JsonResponse
from django.db.models import Sum, Avg, Count, F, Q
from django.utils import timezone
from datetime import timedelta

from .models import (
    Factory, ProductionLine, Machine, Shift, Product,
    ProductionLog, DowntimeEvent, QualityCheck, InventoryItem,
    StockMovement, ThresholdAlert
)


def get_filtered_queryset(request):
    """Utility to filter across models by factory, line, shift, and date range"""
    factory_id = request.GET.get('factory')
    line_id = request.GET.get('line')
    shift_id = request.GET.get('shift')
    date_filter = request.GET.get('date_range', 'today')

    now = timezone.now()
    if date_filter == 'yesterday':
        start_date = now - timedelta(days=1)
        end_date = now
    elif date_filter == 'last_7_days':
        start_date = now - timedelta(days=7)
        end_date = now
    elif date_filter == 'month_to_date':
        start_date = now.replace(day=1, hour=0, minute=0, second=0)
        end_date = now
    else:  # today
        start_date = now.replace(hour=0, minute=0, second=0)
        end_date = now

    filters = {'timestamp__range': (start_date, end_date)}
    if factory_id and factory_id != 'all':
        filters['factory_id'] = factory_id
    if line_id and line_id != 'all':
        filters['line_id'] = line_id
    if shift_id and shift_id != 'all':
        filters['shift_id'] = shift_id

    return filters, start_date, end_date


class BaseDashboardView(LoginRequiredMixin, TemplateView):
    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['factories'] = Factory.objects.all()
        ctx['lines'] = ProductionLine.objects.all()
        ctx['shifts'] = Shift.objects.all()
        ctx['user_role'] = getattr(self.request.user, 'role', 'manager')
        ctx['active_alerts_count'] = ThresholdAlert.objects.filter(acknowledged=False).count()
        return ctx


class OverviewDashboardView(BaseDashboardView):
    template_name = 'dashboard/overview.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        filters, start_date, end_date = get_filtered_queryset(self.request)

        # 1. Output vs Target
        logs = ProductionLog.objects.filter(**filters)
        total_produced = logs.aggregate(s=Sum('qty_produced'))['s'] or 0
        total_target = logs.aggregate(s=Sum('qty_target'))['s'] or 1
        total_scrap = logs.aggregate(s=Sum('qty_scrap'))['s'] or 0

        # 2. Downtime
        dt_filters = {
            'start_time__range': (start_date, end_date)
        }
        if filters.get('line_id'):
            dt_filters['line_id'] = filters['line_id']
        total_downtime_minutes = DowntimeEvent.objects.filter(**dt_filters).aggregate(s=Sum('duration_minutes'))['s'] or 0

        # 3. OEE Calculation Formula
        # Planned operating time (e.g., 8 hrs * 60 min * lines)
        active_lines_count = ProductionLine.objects.count()
        planned_production_minutes = max(1, 8 * 60 * active_lines_count)
        operating_time = max(0, planned_production_minutes - total_downtime_minutes)
        
        availability = min(100.0, (operating_time / planned_production_minutes) * 100)
        performance = min(100.0, (total_produced / total_target) * 100) if total_target > 0 else 0.0
        quality = min(100.0, (total_produced / (total_produced + total_scrap)) * 100) if (total_produced + total_scrap) > 0 else 100.0
        oee = (availability * performance * quality) / 10000.0

        ctx.update({
            'total_produced': total_produced,
            'total_target': total_target,
            'completion_rate': round((total_produced / total_target) * 100, 1) if total_target > 0 else 0,
            'downtime_hours': round(total_downtime_minutes / 60.0, 1),
            'downtime_minutes': total_downtime_minutes,
            'defect_rate': round((total_scrap / (total_produced + total_scrap)) * 100, 2) if (total_produced + total_scrap) > 0 else 0.0,
            'oee': round(oee, 1),
            'availability': round(availability, 1),
            'performance': round(performance, 1),
            'quality': round(quality, 1),
            'active_alerts': ThresholdAlert.objects.filter(acknowledged=False)[:5],
            'recent_logs': logs.select_related('line', 'shift', 'product').order_by('-timestamp')[:8]
        })
        return ctx


class ProductionDashboardView(BaseDashboardView):
    template_name = 'dashboard/production.html'


class DowntimeDashboardView(BaseDashboardView):
    template_name = 'dashboard/downtime.html'


class QualityDashboardView(BaseDashboardView):
    template_name = 'dashboard/quality.html'


class InventoryDashboardView(BaseDashboardView):
    template_name = 'dashboard/inventory.html'


class ReportsDashboardView(BaseDashboardView):
    template_name = 'dashboard/reports.html'


class ExportProductionCSVView(LoginRequiredMixin, View):
    """Generates real Excel-compatible CSV export of production logs"""
    def get(self, request, *args, **kwargs):
        filters, _, _ = get_filtered_queryset(request)
        logs = ProductionLog.objects.filter(**filters).select_related('factory', 'line', 'shift', 'product')

        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="factory_production_report.csv"'
        response.write('\ufeff') # UTF-8 BOM for Excel Arabic / English support

        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'Factory', 'Line', 'Shift', 'Product SKU', 'Produced Units', 'Target Units', 'Scrap Units', 'Scrap Rate %', 'Operator'])

        for log in logs:
            writer.writerow([
                log.timestamp.strftime('%Y-%m-%d %H:%M'),
                log.factory.name,
                log.line.name,
                log.shift.name,
                log.product.sku,
                log.qty_produced,
                log.qty_target,
                log.qty_scrap,
                f"{log.scrap_rate:.2f}%",
                log.logged_by.username if log.logged_by else 'PLC IoT'
            ])

        return response
