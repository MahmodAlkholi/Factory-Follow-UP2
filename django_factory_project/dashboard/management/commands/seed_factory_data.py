"""
Django Management Command: python manage.py seed_factory_data
Generates realistic manufacturing test data across factories, lines, shifts, production logs, downtime, quality checks, inventory, and threshold alerts.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group, Permission
from django.utils import timezone
from datetime import timedelta
import random

from dashboard.models import (
    Factory, ProductionLine, Machine, Shift, Product,
    ProductionLog, DowntimeEvent, QualityCheck, InventoryItem,
    StockMovement, ThresholdAlert
)


class Command(BaseCommand):
    help = "Seeds realistic factory master data and historical telemetry logs."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Initializing FactoryPulse database seeding..."))

        # 1. Setup RBAC Groups & Demo Users
        roles = ['Admin', 'Manager', 'Supervisor', 'Operator']
        for r in roles:
            Group.objects.get_or_create(name=r)

        admin_user, _ = User.objects.get_or_create(username='admin', defaults={'is_staff': True, 'is_superuser': True})
        admin_user.set_password('admin123')
        admin_user.save()
        admin_user.groups.add(Group.objects.get(name='Admin'))

        manager_user, _ = User.objects.get_or_create(username='manager', defaults={'email': 'manager@factorypulse.com'})
        manager_user.set_password('manager123')
        manager_user.save()
        manager_user.groups.add(Group.objects.get(name='Manager'))

        supervisor_user, _ = User.objects.get_or_create(username='supervisor', defaults={'email': 'supervisor@factorypulse.com'})
        supervisor_user.set_password('supervisor123')
        supervisor_user.save()
        supervisor_user.groups.add(Group.objects.get(name='Supervisor'))

        operator_user, _ = User.objects.get_or_create(username='operator')
        operator_user.set_password('operator123')
        operator_user.save()
        operator_user.groups.add(Group.objects.get(name='Operator'))

        # 2. Factories
        cairo_factory, _ = Factory.objects.get_or_create(
            code='CAI-01',
            defaults={'name': 'Cairo Industrial Complex (Plant 1)', 'location': '10th of Ramadan City, Egypt'}
        )
        alex_factory, _ = Factory.objects.get_or_create(
            code='ALX-02',
            defaults={'name': 'Alexandria Heavy Fab Plant (Plant 2)', 'location': 'Borg El Arab Free Zone, Egypt'}
        )

        # 3. Shifts
        shifts_data = [
            ('SHIFT-A', 'Morning Shift (06:00 - 14:00)', '06:00', '14:00'),
            ('SHIFT-B', 'Evening Shift (14:00 - 22:00)', '14:00', '22:00'),
            ('SHIFT-C', 'Night Shift (22:00 - 06:00)', '22:00', '06:00'),
        ]
        created_shifts = []
        for code, name, start, end in shifts_data:
            s, _ = Shift.objects.get_or_create(code=code, defaults={'name': name, 'start_time': start, 'end_time': end})
            created_shifts.append(s)

        # 4. Products
        products_data = [
            ('SKU-BRK-400', 'Automotive Sub-Frame Bracket', 'Stamping', 15.0),
            ('SKU-JBOX-HV', 'Heavy Electric Junction Enclosure', 'Welding', 32.0),
            ('SKU-PUMP-H7', 'Smart Water Pump Aluminum Housing', 'Machining', 45.0),
            ('SKU-FAN-IND8', 'Industrial High-CFM Blower Assembly', 'Assembly', 60.0),
        ]
        created_products = []
        for sku, name, cat, cycle in products_data:
            p, _ = Product.objects.get_or_create(
                sku=sku,
                defaults={'name': name, 'category': cat, 'target_cycle_time_seconds': cycle}
            )
            created_products.append(p)

        # 5. Production Lines & Machines
        lines_data = [
            ('L1-STAMP', 'Line 01 - High-Speed Stamping & Pressing', cairo_factory, 180, [
                ('HP-500', 'Hydraulic Press 500T (Schuler)'),
                ('ACF-12', 'Automated Coil Feeder & Decoiler')
            ]),
            ('L2-WELD', 'Line 02 - Robotic Welding Cell', cairo_factory, 110, [
                ('ROB-KUKA-1', 'KUKA Robot Arm Alpha (Welder)'),
                ('WLD-CMT', 'Fronius CMT Pulse Welding Power Source')
            ]),
            ('L3-ASSY', 'Line 03 - Electro-Mechanical Assembly', cairo_factory, 95, [
                ('TRQ-GTRY', 'Automated Torque Screwdriving Gantry')
            ]),
            ('L4-PACK', 'Line 04 - Powder Coating & Final Pack', cairo_factory, 200, [
                ('PWD-NRD', 'Nordson Powder Spray Booth')
            ]),
        ]

        now = timezone.now()
        created_lines = []
        created_machines = []

        for l_code, l_name, factory, target, machines in lines_data:
            line, _ = ProductionLine.objects.get_or_create(
                code=l_code,
                defaults={'name': l_name, 'factory': factory, 'target_hourly': target, 'supervisor': supervisor_user}
            )
            created_lines.append(line)

            for m_code, m_name in machines:
                m, _ = Machine.objects.get_or_create(
                    code=m_code,
                    defaults={'line': line, 'name': m_name, 'status': 'running'}
                )
                created_machines.append(m)

        # 6. Historical Production Logs (Past 48 Hours)
        self.stdout.write("Generating hourly production logs...")
        for hour_offset in range(48, 0, -1):
            ts = now - timedelta(hours=hour_offset)
            shift = created_shifts[(ts.hour // 8) % len(created_shifts)]

            for line in created_lines:
                target = line.target_hourly
                # Simulate realistic variation
                produced = max(10, int(target * random.uniform(0.78, 1.05)))
                scrap = int(produced * random.uniform(0.005, 0.04))
                prod = random.choice(created_products)

                ProductionLog.objects.create(
                    factory=line.factory,
                    line=line,
                    shift=shift,
                    product=prod,
                    qty_produced=produced,
                    qty_target=target,
                    qty_scrap=scrap,
                    timestamp=ts,
                    logged_by=operator_user
                )

        # 7. Downtime Events
        downtime_reasons = [
            ('MECHANICAL', 'Robotic torch collision with fixture clamp #3; axis 4 torque trip'),
            ('CHANGEOVER', 'Tooling die swap for Bracket batch #B-400A and pilot test strike'),
            ('MATERIAL_SHORTAGE', 'Waiting for replenishment of M6 DIN912 high-tensile bolts'),
            ('ELECTRICAL', 'Photoelectric safety curtain triggered by misaligned pallet tray'),
            ('OPERATOR_ERROR', 'Strip alignment guide re-centering after sheet buckle')
        ]

        for i, (cat, detail) in enumerate(downtime_reasons):
            dt_start = now - timedelta(hours=(i * 7) + 2)
            duration = random.randint(12, 55)
            DowntimeEvent.objects.create(
                machine=created_machines[i % len(created_machines)],
                line=created_lines[i % len(created_lines)],
                shift=created_shifts[0],
                start_time=dt_start,
                end_time=dt_start + timedelta(minutes=duration),
                duration_minutes=duration,
                reason_category=cat,
                reason_detail=detail,
                resolved=True,
                logged_by=supervisor_user
            )

        # 8. Active Stoppage & Threshold Alert
        active_dt = DowntimeEvent.objects.create(
            machine=created_machines[2], # KUKA Welder
            line=created_lines[1],
            shift=created_shifts[0],
            start_time=now - timedelta(minutes=48),
            duration_minutes=48,
            reason_category='MECHANICAL',
            reason_detail='Robotic torch collision with fixture clamp #3; axis 4 torque trip',
            resolved=False,
            logged_by=supervisor_user
        )

        ThresholdAlert.objects.create(
            rule_name="Line Stoppage Breach (>15 min): L2-WELD",
            metric='line_downtime',
            threshold_value=15.0,
            current_value=48.0,
            severity='critical',
            factory=cairo_factory,
            line=created_lines[1],
            message="Robotic Welding Cell (Line 02) has been halted for 48 minutes due to Torch Collision.",
            timestamp=now - timedelta(minutes=30),
            acknowledged=False,
            email_sent=True
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with realistic factory records!"))
