"""
Main URL Configuration for Factory Data Follow-up Dashboard
"""

from django.contrib import admin
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from rest_framework.authtoken.views import obtain_auth_token
from dashboard.views import (
    OverviewDashboardView, ProductionDashboardView, DowntimeDashboardView,
    QualityDashboardView, InventoryDashboardView, ReportsDashboardView,
    ExportProductionCSVView
)
from dashboard.api_views import TelemetryIngestAPIView

# Non-translatable API routes
urlpatterns = [
    # Machine/PLC IoT Ingestion Endpoint
    path('api/v1/telemetry/ingest/', TelemetryIngestAPIView.as_view(), name='api-telemetry-ingest'),
    path('api/v1/auth/token/', obtain_auth_token, name='api-token-auth'),
]

# Translatable Web Dashboard views (English / Arabic prefix support, e.g. /en/ or /ar/)
urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', OverviewDashboardView.as_view(), name='dashboard-overview'),
    path('production/', ProductionDashboardView.as_view(), name='dashboard-production'),
    path('downtime/', DowntimeDashboardView.as_view(), name='dashboard-downtime'),
    path('quality/', QualityDashboardView.as_view(), name='dashboard-quality'),
    path('inventory/', InventoryDashboardView.as_view(), name='dashboard-inventory'),
    path('reports/', ReportsDashboardView.as_view(), name='dashboard-reports'),
    path('reports/export/csv/', ExportProductionCSVView.as_view(), name='export-csv'),
    prefix_default_language=True
)
