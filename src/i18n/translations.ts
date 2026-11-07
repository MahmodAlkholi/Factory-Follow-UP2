export const translations = {
  en: {
    appTitle: "FactoryPulse BI",
    appSubtitle: "Industrial Operations & Follow-up Platform",
    tagline: "Real-time production, OEE, downtime, quality & inventory intelligence",
    
    // Roles
    roleAdmin: "Plant Administrator",
    roleManager: "Operations Manager",
    roleSupervisor: "Shift Supervisor",
    roleOperator: "Line Operator",
    currentRole: "Current Role",
    roleNotice: {
      admin: "Full privileges: All plants, lines, users, alerts & Django models",
      manager: "Executive view: All dashboards, KPI drilldowns & report export",
      supervisor: "Floor control: Line 1 / Shift A view & data entry",
      operator: "Operator mode: Fast touch-friendly data logging terminal"
    },

    // Navigation
    navOverview: "Overview",
    navProduction: "Production",
    navDowntime: "Downtime & OEE",
    navQuality: "Quality & Scrap",
    navInventory: "Inventory & Stock",
    navReports: "Reports & Export",
    navDataEntry: "Shop Floor Entry",
    navDjangoExplorer: "Django 5 Architecture",

    // Global Filters
    filters: "Filters",
    factory: "Factory",
    allFactories: "All Factories",
    productionLine: "Production Line",
    allLines: "All Lines",
    shift: "Shift",
    allShifts: "All Shifts",
    dateRange: "Date Range",
    today: "Today",
    yesterday: "Yesterday",
    last7Days: "Last 7 Days",
    monthToDate: "Month to Date",
    custom: "Custom",
    resetFilters: "Reset",
    activeFilters: "Active Filters",

    // Statuses
    running: "Running",
    idle: "Idle",
    stopped: "Stopped",
    maintenance: "Maintenance",

    // KPI Cards
    outputVsTarget: "Output vs Target",
    todayOutput: "Today's Output",
    target: "Target",
    completionRate: "Completion Rate",
    oeeLabel: "Overall Equipment Effectiveness (OEE)",
    availability: "Availability",
    performance: "Performance",
    qualityRate: "Quality",
    downtimeHours: "Downtime",
    defectRate: "Defect Rate",
    activeAlerts: "Active Alerts",
    criticalIssues: "Critical Issues",
    targetPace: "Target Pace",
    units: "Units",
    hours: "Hours",
    minutes: "min",
    percentage: "%",

    // Downtime Categories
    catMechanical: "Mechanical Failure",
    catElectrical: "Electrical / Sensor",
    catMaterial: "Material Shortage",
    catChangeover: "Setup & Changeover",
    catOperator: "Operator Adjustment",
    catPlanned: "Planned Maintenance",

    // Defect Types
    defDimensional: "Dimensional Out-of-Spec",
    defSurface: "Surface Scratch / Dent",
    defWeld: "Weld Porosity / Seam",
    defSeal: "Seal / Leak Failure",
    defMissing: "Missing Component",
    defPackaging: "Packaging Defect",

    // Sections
    productionHourlyTrend: "Hourly Production Output vs Standard",
    lineComparison: "Line-by-Line Output Comparison",
    shiftComparison: "Shift Output & Efficiency Breakdown",
    downtimePareto: "Downtime Pareto Analysis (80/20 Rule)",
    downtimeTimeline: "Live Machine Status Timeline (Shop Floor Gantt)",
    qualityTrend: "Defect Rate Trend vs 3.0% Max Threshold",
    defectsBreakdown: "Defect Root-Cause Distribution",
    stockLevels: "Material Stock Levels vs Safety Min/Max",
    stockMovements: "Recent Stock Ledger Movements",
    
    // Actions & Buttons
    autoRefresh: "Auto-refresh",
    refreshNow: "Refresh Now",
    logProduction: "Log Production",
    logDowntime: "Report Downtime",
    logQuality: "Log Quality Check",
    bulkImport: "Bulk CSV Import",
    exportExcel: "Export Excel (CSV)",
    exportPdf: "Export PDF Report",
    simulateIot: "Simulate PLC / IoT Telemetry",
    viewAlerts: "View Alerts",
    acknowledge: "Acknowledge",
    resolved: "Resolved",
    close: "Close",
    save: "Save Record",
    cancel: "Cancel",

    // Telemetry & IoT
    iotFeed: "Live PLC Tag Feed",
    iotDesc: "Simulated industrial field bus ingest (Modbus TCP / OPC-UA / MQTT) via REST API",
    apiTokenAuth: "Token Authenticated",
    
    // Shop Floor
    inspector: "Inspector",
    operatorName: "Operator",
    machine: "Machine",
    product: "Product",
    reasonCategory: "Reason Category",
    notes: "Notes / Action Taken",
    sampleSize: "Sample Size",
    defectsFound: "Defects Found",
    pass: "PASS",
    fail: "FAIL",

    // Django Reference
    djangoArchitecture: "Django 5.x Architecture & Production Implementation",
    djangoDesc: "Production-ready code architecture: Models, Celery tasks, DRF serializers, HTMX templates, and tests.",
    copyCode: "Copy Code",
    copied: "Copied!",
  },
  ar: {
    appTitle: "فاكتوري بلس BI",
    appSubtitle: "منظومة متابعة وتحليل البيانات الصناعية",
    tagline: "متابعة الإنتاج، الكفاءة الإجمالية OEE، التوقفات، الجودة والمخزون في الوقت الفعلي",
    
    // Roles
    roleAdmin: "مدير المصنع والنظام",
    roleManager: "مدير العمليات والتشغيل",
    roleSupervisor: "مشرف الوردية والخط",
    roleOperator: "فني ومشغل الخط",
    currentRole: "الدور الحالي",
    roleNotice: {
      admin: "صلاحيات كاملة: جميع المصانع والخطوط والمستخدمين وإعدادات جانغو",
      manager: "رؤية إدارية: كافة لوحات القيادة، التقارير المتقدمة وتصدير البيانات",
      supervisor: "تحكم الوردية: استعراض وإدخال بيانات الخط الأول والوردية الحالية",
      operator: "وضع المشغل: شاشة مبسطة ومناسبة لأجهزة التابلت لتسجيل الإنتاج والأعطال"
    },

    // Navigation
    navOverview: "نظرة عامة",
    navProduction: "الإنتاج والمخرجات",
    navDowntime: "التوقفات و OEE",
    navQuality: "الجودة والهدر",
    navInventory: "المخزون والحركات",
    navReports: "التقارير والتصدير",
    navDataEntry: "تسجيل بيانات الوردية",
    navDjangoExplorer: "معمارية جانغو 5",

    // Global Filters
    filters: "تصفية البيانات",
    factory: "المصنع",
    allFactories: "كافة المصانع",
    productionLine: "خط الإنتاج",
    allLines: "كافة الخطوط",
    shift: "الوردية",
    allShifts: "كافة الورديات",
    dateRange: "الفترة الزمنية",
    today: "اليوم",
    yesterday: "أمس",
    last7Days: "آخر 7 أيام",
    monthToDate: "منذ بداية الشهر",
    custom: "مخصص",
    resetFilters: "إعادة ضبط",
    activeFilters: "الفلاتر النشطة",

    // Statuses
    running: "يعمل",
    idle: "في وضع الاستعداد",
    stopped: "متوقف (عطل)",
    maintenance: "صيانة مجدولة",

    // KPI Cards
    outputVsTarget: "الإنتاج الفعلي مقابل المستهدف",
    todayOutput: "إنتاج اليوم",
    target: "المستهدف",
    completionRate: "نسبة الإنجاز",
    oeeLabel: "الكفاءة التشغيلية الإجمالية للمعدات (OEE)",
    availability: "التواجدية (Availability)",
    performance: "الأداء (Performance)",
    qualityRate: "الجودة (Quality)",
    downtimeHours: "ساعات التوقف",
    defectRate: "نسبة العيوب",
    activeAlerts: "تنبيهات نشطة",
    criticalIssues: "مشاكل حرجة",
    targetPace: "معدل الإيقاع",
    units: "قطعة",
    hours: "ساعات",
    minutes: "دقيقة",
    percentage: "%",

    // Downtime Categories
    catMechanical: "عطل ميكانيكي",
    catElectrical: "عطل كهربائي / حساسات",
    catMaterial: "نقص المواد الخام",
    catChangeover: "تغيير إعداد وضبط القالب",
    catOperator: "تعديل المشغل / وقفة عمل",
    catPlanned: "صيانة وقائية دورية",

    // Defect Types
    defDimensional: "أبعاد غير مطابقة للرسم",
    defSurface: "خدوش أو تشوهات سطحية",
    defWeld: "مسامية أو عيب لحام",
    defSeal: "تسريب أو عدم إحكام الغلق",
    defMissing: "نقص مكون أو برغي",
    defPackaging: "عيب في التغليف والطباعة",

    // Sections
    productionHourlyTrend: "منحنى الإنتاج بالساعة مقارنة بالمعدل المعياري",
    lineComparison: "مقارنة المخرجات بين خطوط الإنتاج",
    shiftComparison: "مقارنة أداء وإنتاجية الورديات",
    downtimePareto: "مخطط باريتو لأسباب التوقف (قاعدة 80/20)",
    downtimeTimeline: "مخطط زمني حي لحالة الآلات (Shop Floor Gantt)",
    qualityTrend: "تطور نسبة العيوب مقارنة بالحد الأقصى 3.0%",
    defectsBreakdown: "توزيع الأسباب الجذرية للعيوب المكتشفة",
    stockLevels: "أرصدة المخزون مقابل حدود الأمان والطلب",
    stockMovements: "سجل حركات المخزون الأخيرة",

    // Actions & Buttons
    autoRefresh: "تحديث تلقائي",
    refreshNow: "تحديث الآن",
    logProduction: "تسجيل إنتاج",
    logDowntime: "تسجيل عطل",
    logQuality: "فحص جودة",
    bulkImport: "استيراد ملف CSV",
    exportExcel: "تصدير Excel (CSV)",
    exportPdf: "تصدير تقرير PDF",
    simulateIot: "محاكاة إشارات PLC / IoT",
    viewAlerts: "سجل التنبيهات",
    acknowledge: "إقرار ومتابعة",
    resolved: "تم الحل",
    close: "إغلاق",
    save: "حفظ السجل",
    cancel: "إلغاء",

    // Telemetry & IoT
    iotFeed: "بث قراءات أجهزة PLC في المصنع",
    iotDesc: "محاكاة وصول قراءات الحساسات عبر بروتوكولات Modbus TCP / OPC-UA بواسطة REST API موثق برمز",
    apiTokenAuth: "موثق بواسطة رمز DRF Token",

    // Shop Floor
    inspector: "مفتش الجودة",
    operatorName: "اسم المشغل",
    machine: "الآلة / الماكينة",
    product: "المنتج",
    reasonCategory: "تصنيف العطل",
    notes: "ملاحظات / الإجراء المتخذ",
    sampleSize: "حجم العينة المفحوصة",
    defectsFound: "القطع المعيبة",
    pass: "مطابق (نجاح)",
    fail: "غير مطابق (رفض)",

    // Django Reference
    djangoArchitecture: "معمارية جانغو 5 وملفات الكود الكاملة",
    djangoDesc: "مشروع جانغو كامل: الموديلات، مهام Celery الخلفية، واجهات DRF، وقوالب HTMX واختبارات pytest.",
    copyCode: "نسخ الكود",
    copied: "تم النسخ!",
  }
};
