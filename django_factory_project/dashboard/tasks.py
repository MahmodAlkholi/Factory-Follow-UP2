"""
Celery Background Tasks
Periodic KPI monitoring, threshold alerts evaluation, and automated email dispatch
"""

from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta
from .models import ProductionLine, Machine, DowntimeEvent, QualityCheck, InventoryItem, ThresholdAlert


@shared_task
def evaluate_threshold_alerts():
    """
    Runs every 60 seconds via Celery Beat:
    1. Checks if any machine has unacknowledged downtime > 15 minutes
    2. Checks if latest 1-hour defect rate on any line exceeds 3.0%
    3. Checks if any inventory item dropped below minimum safety stock
    """
    now = timezone.now()
    alerts_created = []

    # 1. Continuous Downtime > 15 minutes check
    cutoff_time = now - timedelta(minutes=15)
    unresolved_downtimes = DowntimeEvent.objects.filter(
        resolved=False,
        start_time__lte=cutoff_time
    ).select_related('machine', 'line')

    for dt in unresolved_downtimes:
        duration = int((now - dt.start_time).total_seconds() / 60)
        rule_name = f"Line Stoppage Breach (>15 min): {dt.line.code}"
        
        # Avoid duplicate alert if already active
        existing = ThresholdAlert.objects.filter(
            rule_name=rule_name,
            acknowledged=False
        ).exists()

        if not existing:
            alert = ThresholdAlert.objects.create(
                rule_name=rule_name,
                metric='line_downtime',
                threshold_value=15.0,
                current_value=duration,
                severity='critical',
                factory=dt.line.factory,
                line=dt.line,
                message=f"Machine {dt.machine.name} on Line {dt.line.name} has been halted for {duration} min. Reason: {dt.reason_category} ({dt.reason_detail[:60]})"
            )
            alerts_created.append(alert.id)
            send_alert_email.delay(alert.id)

    # 2. Defect Rate Check (> 3.0%)
    recent_checks = QualityCheck.objects.filter(
        timestamp__gte=now - timedelta(hours=1)
    ).select_related('line')

    for qc in recent_checks:
        rate = qc.defect_percentage
        if rate > 3.0:
            rule_name = f"Excessive Quality Defect Spike (>3.0%): {qc.line.code}"
            if not ThresholdAlert.objects.filter(rule_name=rule_name, acknowledged=False).exists():
                alert = ThresholdAlert.objects.create(
                    rule_name=rule_name,
                    metric='defect_rate',
                    threshold_value=3.0,
                    current_value=round(rate, 2),
                    severity='critical',
                    line=qc.line,
                    message=f"Line {qc.line.name} registered {rate:.1f}% scrap defect in sample of {qc.sample_size} units ({qc.defects_count} defects, {qc.get_defect_type_display()})."
                )
                alerts_created.append(alert.id)
                send_alert_email.delay(alert.id)

    # 3. Inventory Stockout Risk Check
    low_stock_items = InventoryItem.objects.filter(current_stock__lt=models.F('min_stock'))
    for item in low_stock_items:
        rule_name = f"Low Stock Safety Warning: {item.sku}"
        if not ThresholdAlert.objects.filter(rule_name=rule_name, acknowledged=False).exists():
            alert = ThresholdAlert.objects.create(
                rule_name=rule_name,
                metric='low_stock',
                threshold_value=float(item.min_stock),
                current_value=float(item.current_stock),
                severity='warning',
                factory=item.factory,
                message=f"Material '{item.name}' ({item.sku}) level is {item.current_stock} {item.unit}, below minimum threshold {item.min_stock} {item.unit}."
            )
            alerts_created.append(alert.id)
            send_alert_email.delay(alert.id)

    return f"Evaluated rules. New alerts generated: {len(alerts_created)}"


@shared_task
def send_alert_email(alert_id):
    """Dispatches high-priority email notification to plant managers and supervisors"""
    try:
        alert = ThresholdAlert.objects.get(id=alert_id)
        subject = f"[FACTORY ALERT - {alert.severity.upper()}] {alert.rule_name}"
        body = f"""
Factory Alert System Notification
----------------------------------
Severity: {alert.severity.upper()}
Rule: {alert.rule_name}
Triggered At: {alert.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}
Current Breached Value: {alert.current_value} (Limit was {alert.threshold_value})

Details:
{alert.message}

Please log in to the Factory Data Follow-up Dashboard to acknowledge and take corrective measures.
Dashboard URL: {getattr(settings, 'APP_URL', 'http://localhost:8000')}
        """
        
        recipient_list = [admin[1] for admin in getattr(settings, 'ADMINS', [('Manager', 'operations@factorypulse.com')])]
        
        send_mail(
            subject=subject,
            message=body,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'alerts@factorypulse.com'),
            recipient_list=recipient_list,
            fail_silently=False
        )
        
        alert.email_sent = True
        alert.save(update_fields=['email_sent'])
        return f"Alert email sent for alert #{alert_id}"
    except ThresholdAlert.DoesNotExist:
        return f"Alert #{alert_id} not found."
