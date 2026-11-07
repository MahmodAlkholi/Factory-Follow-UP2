# 🏭 FactoryPulse — Industrial Follow-Up Dashboard & Manufacturing BI

[![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Celery](https://img.shields.io/badge/Celery-5.3-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9%20(RTL)-amber?style=for-the-badge)](#-bilingual-arabic-rtl--english-support)

> **A real-time manufacturing operations and BI nerve center** empowering factory managers, shift supervisors, and shop-floor operators to track production, OEE, downtime root causes, scrap rates, and safety buffers in near real time.

---

## 📚 Executive Presentation & Storytelling Catalog

This repository includes a structured, 6-act executive storytelling presentation detailing the transformation from shop-floor blindness to world-class manufacturing intelligence:

* 📖 **[Read the Full Storytelling Catalog (Markdown)](./PRESENTATION_CATALOG.md)** — Features the 4 Silent Killers of Plant Margins, OEE mathematical breakdowns, operational impact scorecards, and system architecture.
* 🖥️ **[Open the Standalone Presentation Deck (HTML5)](./catalog_presentation.html)** — An interactive browser slide deck with keyboard navigation (`←` / `→`), dark industrial styling, and bilingual English/Arabic toggles.
* 📱 **Interactive In-App Story Mode** — Built directly into the application under the **`Story Catalog`** navigation tab.

---

## 🌟 Key Capabilities

### 1. Overall Equipment Effectiveness (OEE) Engine
Tracks continuous Overall Equipment Effectiveness against world-class ($>85\%$) benchmarks with 3-pillar breakdown:
$$\text{OEE} = \text{Availability} \times \text{Performance} \times \text{Quality}$$
- **Availability**: Planned production time vs. actual operating uptime.
- **Performance**: Actual output vs. standard target pacing rate (585 units/hr).
- **Quality**: Good finished parts vs. total scrap units.

### 2. Downtime 80/20 Pareto & Machine Gantt Timeline
- **Pareto Analysis**: Automatically isolates the 20% of root causes responsible for 80% of lost machine hours (Mechanical, Electrical, Material Shortage, Changeover, Operator Adjustments).
- **Shop Floor Gantt Timeline**: Live per-machine status bars (Running, Idle, Stopped, Maintenance) across active shift hours.
- **MTBF & MTTR**: Automated computation of Mean Time Between Failures and Mean Time To Repair.

### 3. Quality & Statistical Process Control (SPC)
- **3.0% Defect Ceiling Gate**: Flags production runs immediately when scrap rates cross the critical 3.0% limit.
- **Defect Taxonomy**: Pinpoints scrap etiology (weld porosity, dimensional variance, surface scratches, seal leak failure).
- **First Pass Yield (FPY)**: Tracks first-attempt pass rates without rework.

### 4. Inventory & Safety Buffer Guards
- **Buffer Gauges**: Visual minimum and maximum capacity bars for steel sheet coils, aluminum ingots, fasteners, and finished goods.
- **Line Starvation Prevention**: Proactive warnings when buffer levels fall below minimum operating thresholds.
- **Stock Movement Ledger**: Complete audit trail of `IN` (receipts), `OUT` (line issues), `SCRAP`, and `ADJUSTMENT`.

### 5. Multi-Criteria Reporting & Certified Export
- **1-Click Excel Export**: Generates clean CSV files encoded with UTF-8 BOM (`\ufeff`) for seamless Microsoft Excel rendering of Arabic and English text.
- **Certified PDF Executive Brief**: Formatted printable executive report with plant manager and QA sign-off certification blocks.

---

## 🌐 Bilingual Arabic (RTL) & English Support

FactoryPulse features native internationalization with instantaneous right-to-left (RTL) layout directional flipping and native typography (Cairo font for Arabic, Inter & JetBrains Mono for English/telemetry):

| Metric / Term | English | Arabic (`العربية`) |
|---|---|---|
| **OEE** | Overall Equipment Effectiveness | الكفاءة التشغيلية الإجمالية للمعدات |
| **Downtime** | Machine Downtime | أوقات التوقف والأعطال |
| **Defect Rate** | Scrap / Defect Rate | معدل العيوب والهدر |
| **Safety Stock** | Safety Buffer Stock | مخزون الأمان والطلب |
| **Availability** | Line Availability | التواجدية التشغيلية |
| **Root Cause** | Root Cause Category | السبب الجذري للعطل |

---

## 👥 Role-Based Access Control (RBAC)

- **Plant Administrator**: Manages multi-plant master data (Cairo Complex & Alexandria Plant), production lines, machine assets, user groups, and Django settings.
- **Operations Manager**: Executive cross-plant dashboards, historical trend analysis, financial scrap impact, and CSV/PDF report exports.
- **Shift Supervisor**: Floor control over active lines and shifts, downtime resolution sign-offs, and pacing alerts.
- **Line Operator**: High-contrast, large-button touch interface designed for tablets on the shop floor (2 taps to log hourly counts or report a machine fault).

---

## 📡 Edge IoT & PLC Ingestion API

Automated field gateways (Modbus TCP, OPC-UA, MQTT) push telemetry and unit counter increments directly into the Django backend:

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

**Response (HTTP 201 Created):**
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

## 🏗️ System Architecture

```
  +-------------------------------------------------------------------------+
  |                   Edge Hardware & Field Gateways                        |
  |             [Press HP-500]   [KUKA Welder Alpha]   [Nordson Spray]      |
  +-------------------------------------------------------------------------+
                                       |
                                       | POST /api/v1/telemetry/ingest/
                                       v [TokenAuthentication]
  +-------------------------------------------------------------------------+
  |                         Django 5.x Backend Core                         |
  |                                                                         |
  |   +---------------------+   +---------------------+   +-------------+   |
  |   |  DRF Serializers    |   | PostgreSQL 16       |   | Celery Beat |   |
  |   |  & API Views        |-->| (Relational Master  |<--| (60s Periodic|   |
  |   +---------------------+   |  & Timeseries Logs) |   |  Rule Audit)|   |
  |                             +---------------------+   +-------------+   |
  |                                                              |          |
  |                                                              v          |
  |                                                       +-------------+   |
  |                                                       | SMTP Alert  |   |
  |                                                       | Dispatcher  |   |
  |                                                       +-------------+   |
  +-------------------------------------------------------------------------+
                                       |
                                       v
  +-------------------------------------------------------------------------+
  |              React 19 / Vite / Tailwind v4 BI Dashboard                 |
  |   [Overview & OEE]   [Production]   [Downtime Pareto]   [Quality SPC]   |
  |   [Inventory Buffer] [CSV/PDF Reps] [Story Catalog]     [Django Viewer] |
  +-------------------------------------------------------------------------+
```

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (Full Stack Backend)

```bash
# Clone the repository
git clone https://github.com/MahmodAlkholi/Factory-Follow-UP2.git
cd Factory-Follow-UP2

# Launch Django 5, PostgreSQL 16, Redis 7, Celery Worker & Celery Beat
cd django_factory_project
docker-compose up --build -d

# Run migrations and seed realistic manufacturing data
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py seed_factory_data

# Run automated pytest suite
docker-compose exec web pytest tests/test_factory_kpis.py -v
```

The Django backend and REST endpoints will be available at `http://localhost:8000`.

### Option 2: React 19 Frontend Web Dashboard

```bash
# From the repository root
npm install

# Start the Vite development server
npm run dev
```

Open `http://localhost:3000` to access the full interactive BI dashboard, including:
- Shop-floor quick data entry modal.
- Bulk CSV / Excel upload parser.
- Real-time Modbus/PLC telemetry simulator.
- Dynamic threshold alert manager.
- 6-act Storytelling Presentation Catalog.

---

## 📁 Repository Directory Layout

```
Factory-Follow-UP2/
├── README.md                                   # Master repository documentation (this file)
├── PRESENTATION_CATALOG.md                     # Full 6-act storytelling catalog
├── catalog_presentation.html                   # Standalone browser presentation deck
├── .env.example                                # Environment variables template
├── package.json                                # Node runtime configuration
├── public/                                     # Public static assets & presentations
│   ├── PRESENTATION_CATALOG.md
│   └── catalog_presentation.html
├── django_factory_project/                     # Production Django 5.x Backend
│   ├── manage.py
│   ├── requirements.txt                        # Python dependencies
│   ├── docker-compose.yml                      # Multi-container production stack
│   ├── Dockerfile
│   ├── core/
│   │   ├── settings.py                         # PostgreSQL, Celery, i18n settings
│   │   ├── urls.py                             # API & dashboard URL routing
│   │   ├── wsgi.py
│   │   └── celery.py                           # Celery Beat schedule
│   ├── dashboard/
│   │   ├── models.py                           # 11 Relational Django Models
│   │   ├── views.py                            # Class-based views & CSV exports
│   │   ├── serializers.py                      # DRF Serializers
│   │   ├── api_views.py                        # Token IoT Ingestion Endpoint
│   │   ├── tasks.py                            # Celery 60s background alert tasks
│   │   └── management/commands/
│   │       └── seed_factory_data.py            # Realistic factory data generator
│   └── tests/
│       └── test_factory_kpis.py                # Pytest validation test suite
└── src/                                        # React 19 Frontend
    ├── App.tsx                                 # Application coordinator
    ├── components/
    │   ├── Navbar.tsx                          # Industrial status header
    │   ├── FilterBar.tsx                       # Global multi-criteria filter
    │   ├── OverviewPage.tsx                    # OEE & live machine telemetry
    │   ├── ProductionPage.tsx                  # Hourly pace & shift comparisons
    │   ├── DowntimePage.tsx                    # 80/20 Pareto & Gantt timeline
    │   ├── QualityPage.tsx                     # SPC & defect classification
    │   ├── InventoryPage.tsx                   # Min/max stock buffer gauges
    │   ├── ReportsPage.tsx                     # CSV/Excel & printable PDF reports
    │   ├── StoryCatalogPage.tsx                # Interactive Presentation Catalog
    │   ├── DjangoCodeViewer.tsx                # Django architecture file explorer
    │   ├── DataEntryModal.tsx                  # Shop floor quick logging modal
    │   ├── BulkImportModal.tsx                 # CSV/Excel bulk upload parser
    │   ├── IoTTelemetryPanel.tsx               # PLC tag simulator with token auth
    │   └── AlertsModal.tsx                     # Alert manager & threshold rules
    ├── data/mockFactoryData.ts                 # Master industrial dataset
    ├── i18n/translations.ts                    # English and Arabic dictionaries
    └── types/factory.ts                        # TypeScript interfaces and enums
```

---

## 🧪 Automated Testing

Verify OEE mathematical calculations, scrap rate computations, downtime durations, and threshold triggers:

```bash
pytest django_factory_project/tests/test_factory_kpis.py -v
```

---

## 👨‍💻 Author

**Mahmod Alkholi**  
* GitHub: [@MahmodAlkholi](https://github.com/MahmodAlkholi)  
* Email: [mahmodelkholi@gmail.com](mailto:mahmodelkholi@gmail.com)  
* Repository: [https://github.com/MahmodAlkholi/Factory-Follow-UP2](https://github.com/MahmodAlkholi/Factory-Follow-UP2)

---

## 📄 License

This project is licensed under the Apache-2.0 License.
