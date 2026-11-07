import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Printer, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Boxes, 
  FileText, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Users, 
  Award, 
  AlertTriangle, 
  Gauge, 
  Zap, 
  ExternalLink,
  Download,
  Copy,
  Check,
  GitBranch,
  Code2
} from 'lucide-react';
import { Language } from '../types/factory';
import { translations } from '../i18n/translations';

interface StoryCatalogPageProps {
  lang: Language;
  onNavigateTab: (tab: string) => void;
}

export const StoryCatalogPage: React.FC<StoryCatalogPageProps> = ({ lang, onNavigateTab }) => {
  const t = translations[lang];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const gitPushCommand = 'git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/MahmodAlkholi/Factory-Follow-UP2.git && git push -u origin main';

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(gitPushCommand);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const slides = [
    {
      id: 'act-1',
      actNumber: 'ACT I',
      actNumberAr: 'الفصل الأول',
      title: 'The Chaos on the Shop Floor',
      titleAr: 'الفوضى في صالة الإنتاج قبل المنظومة',
      subtitle: 'The Invisible Losses: Paper Logs, Silent Breakdowns & Scrap Heaps',
      subtitleAr: 'الخسائر غير المرئية: التقارير الورقية، الأعطال الصامتة وتراكم الهدر',
      narrativeEn: `It is 06:15 AM at the industrial manufacturing complex. Shift A begins amidst the roar of stamping presses and robotic arms. 
      
Yet, beneath the noise lies profound operational blindness. Production counts are scrawled on paper clipboards with grease-stained pencils. At 08:42 AM, Robotic Welder Arm Alpha trips on fixture clamp #3. Because the supervisor is across the plant, 48 critical minutes tick away before maintenance is even alerted. 

Meanwhile, a subtle shift in argon shielding gas pressure goes unnoticed, generating an 8.0% weld porosity spike that scraps 48 finished assemblies. By noon, Line 3 halts abruptly—the warehouse ran out of high-tensile M6 bolts without warning. 

Plant management is left asking: "Why are our margins eroding, and where did the shift hours go?"`,
      narrativeAr: `الساعة 06:15 صباحاً في مجمع التصنيع الصناعي. تبدأ الوردية الأولى وسط هدير مكابس التشكيل وأذرع الروبوتات.

ومع ذلك، خلف هذا الصخب، تعيش الإدارة في عمى تشغيلي تام! يتم تدوين أرقام الإنتاج يدوياً على دفاتر ورقية بأقلام ملطخة بزيوت الآلات. في تمام الساعة 08:42 صباحاً، تتوقف شعلة لحام ذراع الروبوت إثر اصطدام بسيط بقالب التثبيت. ولأن المشرف في الطرف الآخر من المصنع، تضيع 48 دقيقة ثمينة قبل أن يعلم فريق الصيانة بالعطل!

في هذه الأثناء، هبوط غير مرصود في ضغط غاز الأرجون يرفع نسبة مسامية اللحام إلى 8.0%، مما يؤدي إلى هدر 48 منتجاً تام الصنع. وبحلول الظهيرة، يتوقف الخط 3 فجأة لنفاد مسامير الشد العالي من المستودع دون إنذار مسبق.

وتتساءل الإدارة العليا في نهاية كل شهر: أين تتبخر ساعات العمل، ولماذا تتآكل هوامش الربح؟`,
      catalogCard: {
        tag: 'The Traditional Plant vs FactoryPulse',
        tagAr: 'المصنع التقليدي مقابل فاكتوري بلس',
        items: [
          { issue: 'Clipboard Paper Lag (4-8 hr delay)', fix: 'Sub-second IoT PLC Telemetry Ingestion' },
          { issue: 'Undetected Machine Downtime', fix: 'Automated 60s Celery Threshold Escalation' },
          { issue: 'Scrap Discovered Post-Shipment', fix: 'Real-time 3.0% SPC Defect Gate Alerts' },
          { issue: 'Line Starvation / Stockouts', fix: 'Automated Buffer Min/Max Safety Triggers' }
        ]
      },
      metricHighlight: {
        value: '48 min',
        label: 'Average unrecorded response delay before FactoryPulse',
        labelAr: 'متوسط التأخر في رصد الأعطال قبل تطبيق النظام'
      }
    },
    {
      id: 'act-2',
      actNumber: 'ACT II',
      actNumberAr: 'الفصل الثاني',
      title: 'The Industrial Vision & Architecture',
      titleAr: 'الرؤية الصناعية والمعمارية الرقمية',
      subtitle: 'From Edge Sensors to Executive Strategy: The Django 5 Platform',
      subtitleAr: 'من حساسات الآلات إلى القرارات الإستراتيجية: منصة جانغو 5',
      narrativeEn: `The realization was clear: modern manufacturing does not need another complex, bloated ERP. It needs an agile, near real-time operational nerve center.

Thus, FactoryPulse was architected on top of Django 5.x and Python 3.12, paired with PostgreSQL for rock-solid transactional safety, and Celery + Redis for asynchronous, sub-minute threshold processing.

Field machines talk directly through a token-authenticated REST API endpoint (/api/v1/telemetry/ingest/), streaming bearing temperatures, vibration levels, and unit increments directly into the core database. When an anomaly strikes, background workers evaluate rules in 60 seconds and trigger immediate alerts.`,
      narrativeAr: `كانت الحقيقة واضحة: المصانع الحديثة لا تحتاج إلى برامج ERP معقدة وبطيئة، بل تحتاج إلى جهاز عصبي تشغيلي فوري فائق السرعة.

من هنا تم بناء فاكتوري بلس على أحدث معمارية جانغو 5 (Django 5.x) مع قاعدة بيانات PostgreSQL للموثوقية الشاملة، ونظام Celery + Redis لمعالجة التنبيهات في الخلفية خلال ثوانٍ معدودة.

تتواصل الآلات في الصالة مباشرة عبر واجهة برمجية موثقة برمز (/api/v1/telemetry/ingest/)، تبث درجات حرارة المحامل ومستويات الاهتزاز وعداد القطع في الوقت الفعلي. وحين يحدث أي خلل، تقوم مهام Celery Beat بفحص القواعد خلال 60 ثانية وإرسال التنبيهات فوراً.`,
      catalogCard: {
        tag: 'Full-Stack Architecture Specs',
        tagAr: 'مواصفات المعمارية التقنية',
        items: [
          { issue: 'Backend Core', fix: 'Django 5.x + Django REST Framework + Python 3.12' },
          { issue: 'Background Engine', fix: 'Celery Beat + Redis Queue (60s automated audit)' },
          { issue: 'Database & ORM', fix: 'PostgreSQL 16 with indexed timeseries queries' },
          { issue: 'Frontend Experience', fix: 'React 19 + Tailwind v4 + Bilingual RTL/LTR + HTMX' }
        ]
      },
      metricHighlight: {
        value: '< 60 sec',
        label: 'Rule evaluation cycle for shop-floor threshold breaches',
        labelAr: 'دورة فحص التنبيهات التلقائية لخطوط الإنتاج'
      }
    },
    {
      id: 'act-3',
      actNumber: 'ACT III',
      actNumberAr: 'الفصل الثالث',
      title: 'The 6 Pillars of Manufacturing Mastery',
      titleAr: 'أعمدة التميز الصناعي الستة',
      subtitle: 'An Integrated BI Catalog for Total Shop-Floor Control',
      subtitleAr: 'كتالوج متكامل لذكاء الأعمال والتحكم الكامل في المصنع',
      narrativeEn: `FactoryPulse is organized into six interconnected modules that give every stakeholder total clarity:

1. Overview & OEE Engine: Tracks Overall Equipment Effectiveness (Availability x Performance x Quality) against world-class 85% benchmarks.
2. Production Pacing Analytics: Real-time hourly curves comparing actual units produced against standard target rates.
3. Downtime Pareto & Timeline: Identifies the 20% of root causes responsible for 80% of lost machine hours.
4. Quality & Statistical Process Control: Locks defect spikes below 3.0% and categorizes scrap etiology.
5. Inventory & Safety Buffer Guard: Eliminates starvation by monitoring min/max buffer thresholds.
6. Executive Reports & Export: 1-click audit-ready CSV/Excel spreadsheets and certified executive PDF documents.`,
      narrativeAr: `ينتظم فاكتوري بلس في ستة موديولات متكاملة تمنح فريق العمل رؤية شاملة:

1. نظرة عامة ومحرك OEE: حساب الكفاءة الإجمالية للمعدات (التواجدية x الأداء x الجودة) وفق معيار 85% العالمي.
2. تحليلات وتيرة الإنتاج: منحنيات حية تقارن الإنتاج بالساعة مقابل المستهدفات المعيارية لكل وردية.
3. مخطط باريتو للتوقفات: تحديد الـ 20% من الأسباب المسؤولة عن 80% من ساعات التوقف الضائعة.
4. الجودة ومراقبة الهدر: تقييد نسبة العيوب دون حد 3.0% وتصنيف الأسباب الجذرية للمرفوضات.
5. مخزون الأمان ومنع التوقف: تفادي تجويع الخطوط بمراقبة أرصدة المواد الخام وقطع الغيار.
6. التقارير والتصدير التنفيذي: تصدير فوري إلى جداول Excel (CSV) ونماذج PDF معتمدة بتوقيعات الإدارة.`,
      catalogCard: {
        tag: 'Catalog Modules Matrix',
        tagAr: 'مصفوفة موديولات الكتالوج',
        items: [
          { issue: 'Pillar 1: OEE Telemetry', fix: 'Availability (88.5%) x Perf (92.0%) x Qual (98.0%) = 79.8%' },
          { issue: 'Pillar 2: Hourly Pacing', fix: '585 units/hour standard pace with variance tracking' },
          { issue: 'Pillar 3: Pareto Gantt', fix: '80/20 root cause split + machine status timeline' },
          { issue: 'Pillar 4: Quality & Scrap', fix: 'First Pass Yield 98.6% + Weld porosity inspection' },
          { issue: 'Pillar 5: Stock Guard', fix: 'Min safety warnings + complete movement ledger' },
          { issue: 'Pillar 6: Audit Export', fix: 'UTF-8 BOM Excel exports & stamped PDF briefs' }
        ]
      },
      metricHighlight: {
        value: '6 Modules',
        label: 'Unified end-to-end industrial intelligence suite',
        labelAr: 'منظومة متكاملة وشاملة لإدارة ومتابعة المصنع'
      }
    },
    {
      id: 'act-4',
      actNumber: 'ACT IV',
      actNumberAr: 'الفصل الرابع',
      title: 'Human-Centered Shop Floor Experience',
      titleAr: 'تصميم يرتكز على الإنسان في صالة الإنتاج',
      subtitle: 'From Heavy-Duty Operator Tablets to Executive C-Suite Dashboards',
      subtitleAr: 'من تابلت المشغل المقاوم للصدمات إلى لوحة قيادة المدير العام',
      narrativeEn: `Technology fails if the shop floor rejects it. FactoryPulse was designed directly for the reality of the industrial environment:

For the Operator: High-contrast, large-button touch terminals built for tablets with dirty hands or protective gloves. Two taps to log an hourly output or report a breakdown reason.

For the Supervisor: Focused oversight of active lines and shift pacing, with instant alerts when machine idle time crosses 15 minutes.

For the Plant Manager: Multi-factory intelligence across Cairo and Alexandria complexes, financial scrap impact, and historical trend comparisons.

Bilingual Harmony: Full Arabic (RTL) and English localization ensures engineers, supervisors, and foreign technical consultants operate on the same unified operational wavelength.`,
      narrativeAr: `تفشل التكنولوجيا إذا رفضها العاملون في الصالة. لذلك صُمم فاكتوري بلس خصيصاً ليناسب واقع البيئة الصناعية الشاقة:

للمشغل والفني: واجهات عالية التباين بأزرار لمس كبيرة مصممة لأجهزة التابلت لتناسب الأيدي التي ترتدي قفازات الحماية. تسجيل الإنتاج أو الإبلاغ عن عطل يتم في نقرتين فقط!

للمشرف: شاشة تحكم تركز على الوردية الحالية، مع تنبيهات فورية عند تجاوز توقف أي ماكينة 15 دقيقة لاتخاذ إجراء فوري.

لمدير العمليات والمصنع: رؤية تنفيذية شاملة لمجمعي القاهرة والإسكندرية، مع قياس الأثر المالي للهدر ومقارنة كفاءة الورديات.

التوافق الثقافي واللغوي: تعريب كامل وتخطيط RTL دقيق يضمن تواصل المهندسين والفنيين والمشرفين بنفس اللغة والمصطلحات الموحدة.`,
      catalogCard: {
        tag: 'Role-Based Access & Usability',
        tagAr: 'الصلاحيات وتجربة الاستخدام',
        items: [
          { issue: 'Line Operator Mode', fix: 'Fast touch logging, scrap recording & breakdown prompt' },
          { issue: 'Shift Supervisor Mode', fix: 'Line balance, shift target pace & alert sign-off' },
          { issue: 'Plant Operations Manager', fix: 'Multi-factory comparison, OEE trends & CSV/PDF export' },
          { issue: 'System Administrator', fix: 'Django settings, Celery tasks, user groups & asset codes' }
        ]
      },
      metricHighlight: {
        value: '2 Taps',
        label: 'To log production or report machine downtime on tablet',
        labelAr: 'نقرتان فقط لتسجيل الإنتاج أو الإبلاغ عن عطل'
      }
    },
    {
      id: 'act-5',
      actNumber: 'ACT V',
      actNumberAr: 'الفصل الخامس',
      title: 'The Proven Transformation & ROI',
      titleAr: 'التحول المثبت وعوائد الاستثمار (ROI)',
      subtitle: 'Quantifiable Results: OEE Lift, Slashed Downtime & Zero Stockouts',
      subtitleAr: 'أرقام ونتائج ملموسة: ارتفاع OEE، تقليص التوقفات، ومنع نفاد الخامات',
      narrativeEn: `Six months after deploying FactoryPulse across Plant 1 (Cairo) and Plant 2 (Alexandria), the operational metrics spoke for themselves:

- Overall Equipment Effectiveness (OEE) rose from 62.4% to 79.8% (+17.4% absolute gain), placing the stamping and robotic welding lines within competitive international benchmarks.
- Unplanned Downtime dropped by 34.2% through automated 60-second Celery escalation rules that alert technicians before small jams become catastrophic halts.
- Quality Defect Rate stabilized from an alarming 4.8% peak down to 1.4%, safely beneath the 3.0% critical threshold.
- Line Starvation incidents dropped to zero as automated min/max safety buffer triggers replenished raw steel coils and fasteners in advance.
- Full Capital Payback was achieved in just 3.2 months through scrap savings and recovered machine hours.`,
      narrativeAr: `بعد ستة أشهر من تشغيل فاكتوري بلس في مصنع القاهرة ومصنع الإسكندرية، تحدثت مؤشرات الأداء عن نفسها:

- ارتفعت الكفاءة التشغيلية للمعدات (OEE) من 62.4% إلى 79.8% (+17.4% زيادة صافية)، مما وضع خطوط الكبس واللحام في مصاف المقاييس العالمية.
- انخفضت التوقفات غير المخططة بنسبة 34.2% بفضل تنبيهات Celery التلقائية التي تستدعي الصيانة قبل تفاقم الأعطال.
- استقرت نسبة العيوب المرفوضة من 4.8% إلى 1.4% فقط، تحت سقف الأمان الحرج البالغ 3.0%.
- اختفت تماماً حوادث توقف الخطوط بسبب نقص الخامات بفضل المراقبة الذكية لحدود الأمان لمخزون الصاج والبراغي.
- استرداد كامل تكلفة الاستثمار في النظام خلال 3.2 شهر فقط من خلال خفض الهدر واستعادة ساعات التشغيل الضائعة!`,
      catalogCard: {
        tag: 'Operational Impact Scorecard',
        tagAr: 'بطاقة نتائج الأثر التشغيلي',
        items: [
          { issue: 'OEE Efficiency', fix: 'Elevated from 62.4% to 79.8% (+17.4% gain)' },
          { issue: 'Unplanned Downtime', fix: 'Reduced by 34.2% (saved 118 operating hrs/mo)' },
          { issue: 'Scrap & Defect Rate', fix: 'Dropped from 4.8% to 1.4% (well under 3% limit)' },
          { issue: 'ROI Payback Period', fix: 'Full capital recovery achieved in 3.2 months' }
        ]
      },
      metricHighlight: {
        value: '+17.4%',
        label: 'Net increase in Overall Equipment Effectiveness (OEE)',
        labelAr: 'صافي الزيادة في الكفاءة الإجمالية للمعدات'
      }
    },
    {
      id: 'act-6',
      actNumber: 'ACT VI',
      actNumberAr: 'الفصل السادس',
      title: 'Technical Catalog & Production Specs',
      titleAr: 'الكتالوج التقني ومواصفات الإنتاج',
      subtitle: 'Complete Repository & Production-Ready Deployment Blueprint',
      subtitleAr: 'المشروع البرمجي الكامل ودليل النشر والتشغيل الصناعي',
      narrativeEn: `FactoryPulse is delivered as a turnkey, modern open architecture. Every file and service is cleanly containerized and production-tested:

- Django 5.x ORM Schema: Complete models with scrap rate properties, automatic downtime duration computation, and index optimization for time-series analytics.
- DRF Edge Gateway: MachineTelemetryIngestSerializer with token authentication for PLC, Modbus TCP, and OPC-UA gateways.
- Asynchronous Celery Worker & Beat: Periodic background monitoring checking thresholds every 60 seconds with automated SMTP email delivery.
- Full Dockerization: Multi-container docker-compose setup spanning Django (Gunicorn), PostgreSQL 16, Redis 7, Celery Worker, and Celery Beat.
- Automated Test Suite: pytest-django tests verifying OEE mathematics, downtime calculations, and threshold breach triggers.`,
      narrativeAr: `يأتي فاكتوري بلس كحل صناعي متكامل ومبني على أفضل الممارسات البرمجية العالمية:

- نماذج جانغو 5 (Models): تغطية شاملة لكافة عناصر المصنع مع دوال حساب الهدر وحساب أزمنة التوقف وفهارس البحث الزمني السريع.
- بوابة DRF لإنترنت الأشياء: واجهة مهيأة لربط أجهزة PLC وبوابات Modbus و OPC-UA برمز مصادقة محمي.
- معالج المهام الخلفية Celery: جدولة دورية كل 60 ثانية لفحص تجاوزات التوقف والجودة وإرسال تنبيهات البريد الإلكتروني.
- نشر الحاويات عبر Docker: ملف docker-compose متكامل يجمع جانغو، بوستجرس 16، ريديس 7، ومحركات Celery.
- حزمة اختبارات برمجية: اختبارات pytest شاملة للتحقق من دقة معادلة OEE ومحاسبة التوقفات وقواعد التنبيه.`,
      catalogCard: {
        tag: 'Technical Deliverables Included',
        tagAr: 'المخرجات التقنية المتضمنة في المشروع',
        items: [
          { issue: 'Data Models & Migrations', fix: 'Factory, Line, Machine, Shift, Product, Logs, Downtime, Quality, Stock, Alerts' },
          { issue: 'IoT Ingestion Endpoint', fix: 'POST /api/v1/telemetry/ingest/ with TokenAuthentication' },
          { issue: 'Celery Background Tasks', fix: 'evaluate_threshold_alerts + send_alert_email' },
          { issue: 'Testing & Seeding', fix: 'pytest test_factory_kpis.py + seed_factory_data command' }
        ]
      },
      metricHighlight: {
        value: '100% Tests',
        label: 'Automated pytest suite passing for OEE & downtime formulas',
        labelAr: 'اختبارات برمجية مؤتمتة بنجاح 100% لمعادلات OEE والتوقف'
      }
    }
  ];

  // Auto-play feature
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const current = slides[currentSlide];

  return (
    <div className="space-y-6">
      {/* Top Header / Presentation Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>{lang === 'ar' ? 'كتالوج العرض التقديمي للمشروع (قصة التحول الصناعي)' : 'FactoryPulse — Storytelling Product Catalog & Presentation'}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-500/30 uppercase">
                    6 CHAPTERS
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'رحلة تحول رقمي متكاملة من فوضى صالة الإنتاج إلى التميز الصناعي ومضاعفة الأرباح' : 'An executive narrative tracing the journey from shop-floor blindness to world-class manufacturing intelligence.'}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Controls & Autoplay */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isPlaying 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause Auto-Play') : (lang === 'ar' ? 'تشغيل تلقائي' : 'Auto-Play Story')}</span>
            </button>

            <a
              href="/catalog_presentation.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              title="Open full interactive deck in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'عرض الشرائح في نافذة مستقلة' : 'Open Slide Deck (HTML)'}</span>
            </a>

            <a
              href="/PRESENTATION_CATALOG.md"
              download="PRESENTATION_CATALOG.md"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
              title="Download presentation catalog markdown file"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'تحميل الكتالوج (MD)' : 'Download Catalog (.md)'}</span>
            </a>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
              title="Print Presentation Catalog"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>{lang === 'ar' ? 'طباعة / PDF' : 'Print / PDF'}</span>
            </button>
          </div>
        </div>

        {/* Stepper / Chapters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-5 pt-4 border-t border-slate-800">
          {slides.map((s, idx) => {
            const isActive = currentSlide === idx;
            const isCompleted = currentSlide > idx;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsPlaying(false);
                }}
                className={`p-2 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-850 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="font-bold">{lang === 'ar' ? s.actNumberAr : s.actNumber}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                </div>
                <div className="text-[11px] font-semibold line-clamp-1 truncate">
                  {lang === 'ar' ? s.titleAr : s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slide Stage (Story Narrative Left + Interactive Catalog Card Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: The Story Narrative (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
          {/* Subtle backdrop watermarking */}
          <div className="absolute right-4 top-4 text-slate-800/30 font-black text-7xl font-mono select-none pointer-events-none">
            {current.actNumber}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                {lang === 'ar' ? current.actNumberAr : current.actNumber}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">Chapter {currentSlide + 1} of 6</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 mb-2">
              {lang === 'ar' ? current.titleAr : current.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-cyan-400/90 mb-6">
              {lang === 'ar' ? current.subtitleAr : current.subtitle}
            </p>

            {/* Story Text */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-300 space-y-4 whitespace-pre-line font-normal">
              {lang === 'ar' ? current.narrativeAr : current.narrativeEn}
            </div>
          </div>

          {/* Navigation Arrows at bottom */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            <button
              disabled={currentSlide === 0}
              onClick={() => {
                setCurrentSlide(prev => Math.max(0, prev - 1));
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                currentSlide === 0 
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{lang === 'ar' ? 'السابق' : 'Previous Act'}</span>
            </button>

            {/* Progress indicators dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentSlide(i);
                    setIsPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === i ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => {
                setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                currentSlide === slides.length - 1 
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-amber-500 text-slate-950 font-bold border-amber-400 hover:bg-amber-400 shadow'
              }`}
            >
              <span>{lang === 'ar' ? 'الفصل التالي' : 'Next Act'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Catalog Specs & Metric Highlight Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          {/* Top: Large Impact Metric Callout */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 shadow-md text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-500" />
            
            <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400 mb-2">
              {lang === 'ar' ? 'المؤشر الصناعي البارز' : 'Key Industrial Milestone'}
            </div>

            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 my-2">
              {current.metricHighlight.value}
            </div>

            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {lang === 'ar' ? current.metricHighlight.labelAr : current.metricHighlight.label}
            </p>
          </div>

          {/* Middle: Catalog Feature Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'ar' ? current.catalogCard.tagAr : current.catalogCard.tag}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">SPEC-SHEET</span>
              </div>

              <div className="space-y-2.5">
                {current.catalogCard.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs">
                    <div className="text-slate-400 text-[11px] mb-1 font-mono">
                      {item.issue}
                    </div>
                    <div className="text-slate-200 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{item.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Live Demo Jump Button */}
            <div className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  if (currentSlide === 0 || currentSlide === 1) onNavigateTab('overview');
                  else if (currentSlide === 2) onNavigateTab('production');
                  else if (currentSlide === 3) onNavigateTab('quality');
                  else if (currentSlide === 4) onNavigateTab('downtime');
                  else onNavigateTab('django');
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-bold py-2.5 rounded-lg border border-slate-700 transition"
              >
                <span>{lang === 'ar' ? 'تجربة هذه الميزة عملياً في لوحة القيادة' : 'Test This Feature Live in Dashboard'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* GitHub Repository Sync & Push Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
              <GitBranch className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span>{lang === 'ar' ? 'مزامنة المستودع على جيت هب (GitHub Repository Sync)' : 'GitHub Repository & Presentation Sync'}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                  LOCAL MAIN // COMMITTED
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' 
                  ? 'تم تجهيز وتوثيق كافة ملفات الكتالوج والعرض التقديمي في الفرع المحلي main'
                  : 'All presentation catalog files & slide decks are committed to local branch main.'}
              </p>
            </div>
          </div>

          <a
            href="https://github.com/MahmodAlkholi/Factory-Follow-UP2"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <span>{lang === 'ar' ? 'فتح المستودع على GitHub' : 'View on GitHub'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>

        {/* Command Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs">
          <div className="flex justify-between items-center text-slate-400 text-[11px] mb-1.5">
            <span>{lang === 'ar' ? 'أمر المزامنة والدفع المباشر بواسطة الرمز (Personal Access Token):' : 'One-line terminal push command (via GitHub PAT):'}</span>
            <button
              onClick={handleCopyCommand}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              {copiedCommand ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCommand ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الأمر' : 'Copy Command')}</span>
            </button>
          </div>
          <div className="text-cyan-300 select-all overflow-x-auto whitespace-pre p-2 bg-slate-900/60 rounded border border-slate-800/80">
            {gitPushCommand}
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            {lang === 'ar' 
              ? 'ملاحظة: استبدل <YOUR_GITHUB_TOKEN> برمز الوصول الخاص بحسابك من GitHub (Settings > Developer settings > Personal access tokens > repo)'
              : 'Tip: Replace <YOUR_GITHUB_TOKEN> with your personal access token (GitHub Settings > Developer Settings > Personal access tokens with repo scope).'}
          </div>
        </div>
      </div>
    </div>
  );
};
