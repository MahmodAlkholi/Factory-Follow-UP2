# FactoryPulse - Factory Data Follow-up Dashboard (Django 5.x BI)

A production-grade manufacturing intelligence and BI platform built with **Django 5.x**, **Django REST Framework**, **PostgreSQL**, **Celery + Redis**, and a modern shop-floor frontend with bilingual Arabic (RTL) & English support.

---

## 🏭 Core Features

1. **Near Real-Time Telemetry & OEE**:
   - Continuous tracking of Availability, Performance, and Quality:  
     $$\text{OEE} = \text{Availability} \times \text{Performance} \times \text{Quality}$$
   - Output vs Target pacing indicators and hourly standard run rates.

2. **Downtime Pareto & Machine Timeline**:
   - 80/20 Pareto analysis of root-cause stoppages (Mechanical, Electrical, Material Shortage, Changeover, Operator).
   - Shop-floor machine Gantt timeline across active shifts.
   - Live MTBF (Mean Time Between Failures) and MTTR (Mean Time To Repair) tracking.

3. **Quality & Statistical Process Control (SPC)**:
   - Defect rate vs 3.0% maximum threshold.
   - Defect root-cause distribution (Weld porosity, surface scratch, dimensional, seal integrity).
   - First Pass Yield (FPY) and sample audit logs.

4. **Inventory & Safety Stock Buffer**:
   - Raw materials, WIP, and finished goods stock levels.
   - Automated low-stock alerts before line starvation occurs.
   - Transaction ledger for IN, OUT, SCRAP, and ADJUSTMENTS.

5. **Role-Based Access Control (RBAC)**:
   - **Admin**: Full privileges over plants, lines, users, and Django settings.
   - **Manager**: Executive dashboards, KPI drilldowns, and reports export.
   - **Supervisor**: Line & shift control, supervisor sign-offs, and breakdown management.
   - **Operator**: Touch-friendly terminal for logging hourly counts, downtime, and scrap.

6. **Automated Escalation & Alerts**:
   - Celery Beat scheduled job evaluates thresholds every 60 seconds (defect rate > 3%, line stopped > 15 min).
   - Dispatches SMTP notification emails to plant managers and supervisors.

7. **Bilingual RTL / LTR Architecture**:
   - Full English and Arabic (`العربية`) shop-floor terminology support with instantaneous RTL layout flip.

---

## 📁 Project Structure

```
django_factory_project/
├── core/
│   ├── __init__.py
│   ├── settings.py         # Django 5 settings, PostgreSQL, Celery, i18n
│   ├── urls.py             # Bilingual i18n URL routing + API endpoints
│   ├── wsgi.py
│   └── celery.py           # Celery application & beat schedule
├── dashboard/
│   ├── __init__.py
│   ├── models.py           # Factory, ProductionLine, Machine, ProductionLog, DowntimeEvent, etc.
│   ├── views.py            # Overview, Production, Downtime, Quality, Inventory, Reports & CSV export
│   ├── serializers.py      # DRF ModelSerializers & Telemetry Ingest Serializer
│   ├── api_views.py        # Token-authenticated PLC / IoT ingestion API
│   ├── tasks.py            # Celery background alert tasks & email dispatcher
│   ├── templates/          # Django Templates + HTMX + Tailwind + Chart.js
│   │   └── dashboard/
│   │       ├── base.html
│   │       ├── overview.html
│   │       └── ...
│   └── management/
│       └── commands/
│           └── seed_factory_data.py # Realistic data generator (Faker)
├── tests/
│   └── test_factory_kpis.py# pytest suite for OEE, scrap rates, and downtime calculations
├── docker-compose.yml      # Multi-container setup (web, db, redis, celery_worker, celery_beat)
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### 2. Local Installation
```bash
# Clone the repository
git clone https://github.com/factorypulse/factorypulse-django.git
cd factorypulse-django

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed realistic factory test data
python manage.py seed_factory_data

# Start Celery worker in a separate terminal
celery -A core worker -l info

# Start Celery beat scheduler
celery -A core beat -l info

# Launch Django development server
python manage.py runserver 0.0.0.0:8000
```

### 3. Docker Compose Deployment (Recommended)
```bash
docker-compose up --build -d
```
The application will be live at `http://localhost:8000`.

---

## 📡 IoT / PLC Machine Telemetry Endpoint

Automated field gateways (Modbus TCP / OPC-UA / MQTT) push machine status updates and production piece increments:

```http
POST /api/v1/telemetry/ingest/
Host: api.factorypulse.com
Authorization: Token 9a8f4c718e2b90d34fa12...
Content-Type: application/json

{
  "machine_code": "HP-500",
  "status": "running",
  "produced_count_increment": 5,
  "scrap_count_increment": 0,
  "temperature_c": 64.2,
  "vibration_rms": 2.1,
  "rpm": 1200,
  "shift_code": "SHIFT-A"
}
```

Response:
```json
{
  "status": "success",
  "machine": "HP-500",
  "machine_status": "running",
  "produced_increment": 5,
  "timestamp": "2026-11-07T08:00:00Z"
}
```

---

## 🧪 Running Automated Tests

Run the pytest suite to verify OEE mathematical calculations, downtime event handling, and threshold alerts:

```bash
pytest tests/test_factory_kpis.py -v
```
