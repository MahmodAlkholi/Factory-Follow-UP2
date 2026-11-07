"""
Factory Data Follow-up Dashboard - Core Models
Django 5.x Production Schema
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from datetime import timedelta


class Factory(models.Model):
    name = models.CharField(_("Factory Name"), max_length=150)
    code = models.CharField(_("Code"), max_length=20, unique=True, db_index=True)
    location = models.CharField(_("Location / City"), max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Factory")
        verbose_name_plural = _("Factories")
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"


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
    status = models.CharField(_("Current Status"), max_length=20, choices=STATUS_CHOICES, default='running')
    target_hourly = models.PositiveIntegerField(_("Standard Hourly Target (units)"), default=100)
    supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_lines')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Production Line")
        verbose_name_plural = _("Production Lines")
        ordering = ['factory', 'code']

    def __str__(self):
        return f"{self.factory.code} | {self.name}"


class Machine(models.Model):
    STATUS_CHOICES = [
        ('running', _('Running')),
        ('idle', _('Idle')),
        ('stopped', _('Stopped')),
        ('maintenance', _('Maintenance')),
    ]

    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, related_name='machines')
    name = models.CharField(_("Machine Name"), max_length=150)
    code = models.CharField(_("Machine Code / Asset ID"), max_length=50, unique=True, db_index=True)
    plc_ip_address = models.GenericIPAddressField(_("PLC IP Address"), null=True, blank=True)
    plc_node_id = models.CharField(_("OPC-UA / Modbus Node ID"), max_length=100, blank=True)
    status = models.CharField(_("Status"), max_length=20, choices=STATUS_CHOICES, default='running')
    last_ping = models.DateTimeField(_("Last Telemetry Ping"), auto_now=True)

    class Meta:
        verbose_name = _("Machine")
        verbose_name_plural = _("Machines")

    def __str__(self):
        return f"{self.code} - {self.name}"


class Shift(models.Model):
    name = models.CharField(_("Shift Name"), max_length=50)
    code = models.CharField(_("Code"), max_length=20, unique=True)
    start_time = models.TimeField(_("Start Time"))
    end_time = models.TimeField(_("End Time"))

    class Meta:
        verbose_name = _("Shift")
        verbose_name_plural = _("Shifts")
        ordering = ['start_time']

    def __str__(self):
        return f"{self.name} ({self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')})"


class Product(models.Model):
    sku = models.CharField(_("SKU / Part Number"), max_length=60, unique=True, db_index=True)
    name = models.CharField(_("Product Description"), max_length=200)
    category = models.CharField(_("Category"), max_length=100, blank=True)
    unit = models.CharField(_("Unit of Measure"), max_length=20, default='pcs')
    target_cycle_time_seconds = models.FloatField(_("Ideal Cycle Time (sec/pc)"), default=10.0)

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    def __str__(self):
        return f"{self.sku} - {self.name}"


class ProductionLog(models.Model):
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='production_logs')
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, related_name='production_logs')
    machine = models.ForeignKey(Machine, on_delete=models.SET_NULL, null=True, blank=True, related_name='production_logs')
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='production_logs')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='production_logs')
    
    qty_produced = models.PositiveIntegerField(_("Quantity Produced (Good Units)"))
    qty_target = models.PositiveIntegerField(_("Target Quantity"))
    qty_scrap = models.PositiveIntegerField(_("Scrap / Rejected Units"), default=0)
    
    timestamp = models.DateTimeField(_("Log Timestamp"), default=timezone.now, db_index=True)
    logged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='production_logs')
    notes = models.TextField(_("Shift Notes"), blank=True)

    class Meta:
        verbose_name = _("Production Log")
        verbose_name_plural = _("Production Logs")
        indexes = [
            models.Index(fields=['timestamp', 'line', 'shift']),
        ]

    def __str__(self):
        return f"Log {self.timestamp.strftime('%Y-%m-%d %H:%M')} | {self.line.code} | {self.qty_produced}/{self.qty_target}"

    @property
    def total_parts(self):
        return self.qty_produced + self.qty_scrap

    @property
    def scrap_rate(self):
        total = self.total_parts
        return (self.qty_scrap / total * 100) if total > 0 else 0.0


class DowntimeEvent(models.Model):
    CATEGORY_CHOICES = [
        ('MECHANICAL', _('Mechanical Failure')),
        ('ELECTRICAL', _('Electrical / Sensor Issue')),
        ('MATERIAL_SHORTAGE', _('Material / Part Starvation')),
        ('CHANGEOVER', _('Tooling & Die Changeover')),
        ('OPERATOR_ERROR', _('Operator Adjustment / Rest')),
        ('PLANNED_MAINTENANCE', _('Planned Preventative Maintenance')),
    ]

    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='downtime_events')
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, related_name='downtime_events')
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='downtime_events')
    
    start_time = models.DateTimeField(_("Breakdown Start Time"), default=timezone.now, db_index=True)
    end_time = models.DateTimeField(_("Resolution End Time"), null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(_("Duration (Minutes)"), default=0)
    
    reason_category = models.CharField(_("Reason Category"), max_length=40, choices=CATEGORY_CHOICES, db_index=True)
    reason_detail = models.TextField(_("Root Cause & Corrective Action"))
    resolved = models.BooleanField(_("Resolved"), default=False)
    logged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='downtime_logs')

    class Meta:
        verbose_name = _("Downtime Event")
        verbose_name_plural = _("Downtime Events")
        ordering = ['-start_time']

    def save(self, *args, **kwargs):
        if self.end_time and self.start_time:
            delta = self.end_time - self.start_time
            self.duration_minutes = int(delta.total_seconds() / 60)
            self.resolved = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.machine.code} - {self.reason_category} ({self.duration_minutes}m)"


class QualityCheck(models.Model):
    DEFECT_CHOICES = [
        ('DIMENSIONAL', _('Dimensional Out-of-Spec')),
        ('SURFACE_SCRATCH', _('Surface Scratch / Dent')),
        ('WELD_POROSITY', _('Weld Porosity / Incomplete Penetration')),
        ('SEAL_FAILURE', _('Seal / Air Leak Test Failure')),
        ('MISSING_PART', _('Missing Fastener or Clip')),
        ('PACKAGING_DEFECT', _('Packaging & Labeling Defect')),
    ]

    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, related_name='quality_checks')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='quality_checks')
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='quality_checks')
    
    sample_size = models.PositiveIntegerField(_("Inspection Sample Size"), default=50)
    defects_count = models.PositiveIntegerField(_("Defective Count"), default=0)
    defect_type = models.CharField(_("Primary Defect Type"), max_length=40, choices=DEFECT_CHOICES)
    
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='inspections')
    timestamp = models.DateTimeField(_("Inspection Timestamp"), default=timezone.now, db_index=True)
    passed = models.BooleanField(_("Pass / Within Spec"), default=True)
    notes = models.TextField(_("Quality Inspector Remarks"), blank=True)

    class Meta:
        verbose_name = _("Quality Inspection")
        verbose_name_plural = _("Quality Inspections")
        ordering = ['-timestamp']

    @property
    def defect_percentage(self):
        return (self.defects_count / self.sample_size * 100) if self.sample_size > 0 else 0.0

    def save(self, *args, **kwargs):
        # Defect rate > 3% fails the inspection automatically
        if self.defect_percentage > 3.0:
            self.passed = False
        super().save(*args, **kwargs)


class InventoryItem(models.Model):
    CATEGORY_CHOICES = [
        ('RAW_MATERIAL', _('Raw Material')),
        ('WIP', _('Work-In-Progress (WIP)')),
        ('FINISHED_GOODS', _('Finished Goods')),
        ('SPARE_PART', _('Machine Spare Part / Tooling')),
    ]

    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, related_name='inventory_items')
    sku = models.CharField(_("Part / Material SKU"), max_length=60, unique=True, db_index=True)
    name = models.CharField(_("Item Name"), max_length=200)
    category = models.CharField(_("Category"), max_length=30, choices=CATEGORY_CHOICES)
    
    current_stock = models.DecimalField(_("Current Stock"), max_digits=12, decimal_places=2, default=0.0)
    min_stock = models.DecimalField(_("Minimum Safety Stock"), max_digits=12, decimal_places=2)
    max_stock = models.DecimalField(_("Maximum Capacity"), max_digits=12, decimal_places=2)
    unit = models.CharField(_("Unit"), max_length=20, default='pcs')
    location_bin = models.CharField(_("Bin / Warehouse Rack Location"), max_length=50, blank=True)

    class Meta:
        verbose_name = _("Inventory Item")
        verbose_name_plural = _("Inventory Items")

    @property
    def is_low_stock(self):
        return self.current_stock < self.min_stock

    def __str__(self):
        return f"{self.sku} - {self.name} ({self.current_stock} {self.unit})"


class StockMovement(models.Model):
    MOVEMENT_CHOICES = [
        ('IN', _('Stock In / Purchase Receipt')),
        ('OUT', _('Stock Out / Line Issue')),
        ('SCRAP', _('Scrapped Material')),
        ('ADJUSTMENT', _('Cycle Count Adjustment')),
    ]

    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(_("Type"), max_length=20, choices=MOVEMENT_CHOICES)
    quantity = models.DecimalField(_("Quantity"), max_digits=12, decimal_places=2)
    timestamp = models.DateTimeField(_("Timestamp"), default=timezone.now)
    reference_doc = models.CharField(_("Reference / Work Order / PO"), max_length=100)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = _("Stock Movement")
        verbose_name_plural = _("Stock Movements")
        ordering = ['-timestamp']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Recalculate inventory level
        if self.movement_type in ['IN']:
            self.item.current_stock += self.quantity
        elif self.movement_type in ['OUT', 'SCRAP']:
            self.item.current_stock -= self.quantity
        self.item.save()


class ThresholdAlert(models.Model):
    METRIC_CHOICES = [
        ('defect_rate', _('Defect Rate Exceeded (%)')),
        ('line_downtime', _('Continuous Downtime Exceeded (min)')),
        ('oee_drop', _('OEE Dropped Below Threshold (%)')),
        ('low_stock', _('Inventory Below Safety Level')),
    ]
    SEVERITY_CHOICES = [
        ('critical', _('Critical')),
        ('warning', _('Warning')),
        ('info', _('Informational')),
    ]

    rule_name = models.CharField(_("Alert Rule Name"), max_length=150)
    metric = models.CharField(_("Monitored KPI Metric"), max_length=40, choices=METRIC_CHOICES)
    threshold_value = models.FloatField(_("Trigger Threshold"))
    current_value = models.FloatField(_("Breached Value"))
    severity = models.CharField(_("Severity"), max_length=20, choices=SEVERITY_CHOICES, default='warning')
    
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE, null=True, blank=True)
    line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField(_("Alert Message"))
    timestamp = models.DateTimeField(_("Triggered At"), default=timezone.now)
    acknowledged = models.BooleanField(_("Acknowledged by Supervisor"), default=False)
    email_sent = models.BooleanField(_("Email Dispatched"), default=False)

    class Meta:
        verbose_name = _("Threshold Alert")
        verbose_name_plural = _("Threshold Alerts")
        ordering = ['-timestamp']
