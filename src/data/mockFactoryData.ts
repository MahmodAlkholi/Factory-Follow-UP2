import { 
  Factory, 
  ProductionLine, 
  Machine, 
  Shift, 
  Product, 
  ProductionLog, 
  DowntimeEvent, 
  QualityCheck, 
  InventoryItem, 
  StockMovement, 
  ThresholdAlert 
} from '../types/factory';

export const initialFactories: Factory[] = [
  {
    id: 'fact-1',
    name: 'Cairo Industrial Complex (Plant 1)',
    nameAr: 'مجمع القاهرة الصناعي (مصنع 1)',
    location: '10th of Ramadan City, Egypt',
    locationAr: 'مدينة العاشر من رمضان، مصر',
    code: 'CAI-01'
  },
  {
    id: 'fact-2',
    name: 'Alexandria Heavy Fab Plant (Plant 2)',
    nameAr: 'مصنع الإسكندرية للتصنيع الثقيل (مصنع 2)',
    location: 'Borg El Arab Free Zone, Egypt',
    locationAr: 'المنطقة الحرة ببرج العرب، مصر',
    code: 'ALX-02'
  }
];

export const initialLines: ProductionLine[] = [
  {
    id: 'line-1',
    factoryId: 'fact-1',
    name: 'Line 01 - High-Speed Stamping & Pressing',
    nameAr: 'الخط 01 - الكبس والتشكيل عالي السرعة',
    code: 'L1-STAMP',
    status: 'running',
    targetHourly: 180
  },
  {
    id: 'line-2',
    factoryId: 'fact-1',
    name: 'Line 02 - Robotic Welding Cell',
    nameAr: 'الخط 02 - خلية اللحام الروبوتي',
    code: 'L2-WELD',
    status: 'stopped', // Has an active downtime event
    targetHourly: 110
  },
  {
    id: 'line-3',
    factoryId: 'fact-1',
    name: 'Line 03 - Electro-Mechanical Assembly',
    nameAr: 'الخط 03 - التجميع الكهروميكانيكي',
    code: 'L3-ASSY',
    status: 'running',
    targetHourly: 95
  },
  {
    id: 'line-4',
    factoryId: 'fact-1',
    name: 'Line 04 - Powder Coating & Final Pack',
    nameAr: 'الخط 04 - دهان البودرة والتعبئة الآلية',
    code: 'L4-PACK',
    status: 'running',
    targetHourly: 200
  },
  {
    id: 'line-5',
    factoryId: 'fact-2',
    name: 'Line 05 - Heavy Frame CNC Machining',
    nameAr: 'الخط 05 - التشغيل الآلي للهياكل الثقيلة CNC',
    code: 'L5-CNC',
    status: 'running',
    targetHourly: 60
  }
];

export const initialMachines: Machine[] = [
  {
    id: 'm-101',
    lineId: 'line-1',
    name: 'Hydraulic Press 500T (Schuler)',
    nameAr: 'مكبس هيدروليكي 500 طن (شولر)',
    code: 'HP-500',
    status: 'running',
    lastPing: 'Just now',
    temperature: 64.2,
    vibration: 2.1,
    rpm: 1200
  },
  {
    id: 'm-102',
    lineId: 'line-1',
    name: 'Automated Coil Feeder & Decoiler',
    nameAr: 'مغذي ولفافة الصاج الآلية',
    code: 'ACF-12',
    status: 'running',
    lastPing: '10s ago',
    temperature: 42.8,
    vibration: 1.4,
    rpm: 850
  },
  {
    id: 'm-201',
    lineId: 'line-2',
    name: 'KUKA Robot Arm Alpha (Welder)',
    nameAr: 'ذراع روبوت كوكا ألفا (لحام)',
    code: 'ROB-KUKA-1',
    status: 'stopped',
    lastPing: '18m ago',
    temperature: 78.5,
    vibration: 5.8,
    rpm: 0
  },
  {
    id: 'm-202',
    lineId: 'line-2',
    name: 'Fronius CMT Pulse Welding Power Source',
    nameAr: 'مولد لحام النبضات فرونيوس',
    code: 'WLD-CMT',
    status: 'stopped',
    lastPing: '18m ago',
    temperature: 55.0,
    vibration: 0.1,
    rpm: 0
  },
  {
    id: 'm-301',
    lineId: 'line-3',
    name: 'Automated Torque Screwdriving Gantry',
    nameAr: 'بوابة ربط البراغي بالعزم الآلي',
    code: 'TRQ-GTRY',
    status: 'running',
    lastPing: 'Just now',
    temperature: 38.5,
    vibration: 0.9,
    rpm: 1400
  },
  {
    id: 'm-401',
    lineId: 'line-4',
    name: 'Nordson Powder Spray Booth',
    nameAr: 'كابينة رش البودرة نوردسون',
    code: 'PWD-NRD',
    status: 'running',
    lastPing: 'Just now',
    temperature: 49.1,
    vibration: 1.2,
    rpm: 920
  }
];

export const initialShifts: Shift[] = [
  {
    id: 'shift-1',
    name: 'Shift A - Morning (06:00 - 14:00)',
    nameAr: 'الوردية الأولى - صباحية (06:00 - 14:00)',
    code: 'SHIFT-A',
    startTime: '06:00',
    endTime: '14:00'
  },
  {
    id: 'shift-2',
    name: 'Shift B - Evening (14:00 - 22:00)',
    nameAr: 'الوردية الثانية - مسائية (14:00 - 22:00)',
    code: 'SHIFT-B',
    startTime: '14:00',
    endTime: '22:00'
  },
  {
    id: 'shift-3',
    name: 'Shift C - Night (22:00 - 06:00)',
    nameAr: 'الوردية الثالثة - ليلية (22:00 - 06:00)',
    code: 'SHIFT-C',
    startTime: '22:00',
    endTime: '06:00'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'SKU-BRK-400',
    name: 'Automotive Sub-Frame Bracket',
    nameAr: 'كتيفة الشاسيه الأمامي للسيارات',
    category: 'Stamping',
    unit: 'pcs',
    targetCycleTimeSeconds: 15
  },
  {
    id: 'prod-2',
    sku: 'SKU-JBOX-HV',
    name: 'Heavy Electric Junction Enclosure',
    nameAr: 'صندوق التوزيع الكهربائي المعزول',
    category: 'Enclosure',
    unit: 'pcs',
    targetCycleTimeSeconds: 32
  },
  {
    id: 'prod-3',
    sku: 'SKU-PUMP-H7',
    name: 'Smart Water Pump Aluminum Housing',
    nameAr: 'جسم مضخة مياه ذكية من الألومنيوم',
    category: 'Castings',
    unit: 'pcs',
    targetCycleTimeSeconds: 45
  },
  {
    id: 'prod-4',
    sku: 'SKU-FAN-IND8',
    name: 'Industrial High-CFM Blower Assembly',
    nameAr: 'وحدة مروحة طرد مركزي صناعية',
    category: 'Assembly',
    unit: 'pcs',
    targetCycleTimeSeconds: 60
  }
];

export const initialProductionLogs: ProductionLog[] = [
  {
    id: 'pl-1',
    factoryId: 'fact-1',
    lineId: 'line-1',
    machineId: 'm-101',
    shiftId: 'shift-1',
    productId: 'prod-1',
    qtyProduced: 172,
    qtyTarget: 180,
    qtyScrap: 3,
    timestamp: '2026-11-07T07:00:00Z',
    loggedBy: 'Ahmed Gamal (Operator)'
  },
  {
    id: 'pl-2',
    factoryId: 'fact-1',
    lineId: 'line-1',
    machineId: 'm-101',
    shiftId: 'shift-1',
    productId: 'prod-1',
    qtyProduced: 178,
    qtyTarget: 180,
    qtyScrap: 2,
    timestamp: '2026-11-07T08:00:00Z',
    loggedBy: 'Ahmed Gamal (Operator)'
  },
  {
    id: 'pl-3',
    factoryId: 'fact-1',
    lineId: 'line-1',
    machineId: 'm-101',
    shiftId: 'shift-1',
    productId: 'prod-1',
    qtyProduced: 185,
    qtyTarget: 180,
    qtyScrap: 1,
    timestamp: '2026-11-07T09:00:00Z',
    loggedBy: 'Ahmed Gamal (Operator)'
  },
  {
    id: 'pl-4',
    factoryId: 'fact-1',
    lineId: 'line-1',
    machineId: 'm-101',
    shiftId: 'shift-1',
    productId: 'prod-1',
    qtyProduced: 168,
    qtyTarget: 180,
    qtyScrap: 4,
    timestamp: '2026-11-07T10:00:00Z',
    loggedBy: 'Ahmed Gamal (Operator)'
  },
  {
    id: 'pl-5',
    factoryId: 'fact-1',
    lineId: 'line-2',
    machineId: 'm-201',
    shiftId: 'shift-1',
    productId: 'prod-2',
    qtyProduced: 104,
    qtyTarget: 110,
    qtyScrap: 5,
    timestamp: '2026-11-07T07:00:00Z',
    loggedBy: 'Mahmoud Sayed (Supervisor)'
  },
  {
    id: 'pl-6',
    factoryId: 'fact-1',
    lineId: 'line-2',
    machineId: 'm-201',
    shiftId: 'shift-1',
    productId: 'prod-2',
    qtyProduced: 48,
    qtyTarget: 110,
    qtyScrap: 7,
    timestamp: '2026-11-07T08:00:00Z',
    loggedBy: 'Mahmoud Sayed (Supervisor)',
    notes: 'Welder nozzle jam and thermal cutoff occurred midway'
  },
  {
    id: 'pl-7',
    factoryId: 'fact-1',
    lineId: 'line-3',
    machineId: 'm-301',
    shiftId: 'shift-1',
    productId: 'prod-3',
    qtyProduced: 92,
    qtyTarget: 95,
    qtyScrap: 2,
    timestamp: '2026-11-07T08:00:00Z',
    loggedBy: 'Tarek Ibrahim (Operator)'
  },
  {
    id: 'pl-8',
    factoryId: 'fact-1',
    lineId: 'line-4',
    machineId: 'm-401',
    shiftId: 'shift-1',
    productId: 'prod-4',
    qtyProduced: 198,
    qtyTarget: 200,
    qtyScrap: 3,
    timestamp: '2026-11-07T09:00:00Z',
    loggedBy: 'Hassan Nabil (Operator)'
  }
];

export const initialDowntimeEvents: DowntimeEvent[] = [
  {
    id: 'dt-1',
    machineId: 'm-201',
    lineId: 'line-2',
    shiftId: 'shift-1',
    startTime: '2026-11-07T08:42:00Z',
    durationMinutes: 48,
    reasonCategory: 'MECHANICAL',
    reasonDetail: 'Robotic torch collision with fixture clamp #3; axis 4 torque trip',
    reasonDetailAr: 'اصطدام شعلة الروبوت بمثبت القالب رقم 3؛ توقف المحور 4 لزيادة العزم',
    resolved: false,
    loggedBy: 'Mahmoud Sayed (Supervisor)'
  },
  {
    id: 'dt-2',
    machineId: 'm-101',
    lineId: 'line-1',
    shiftId: 'shift-1',
    startTime: '2026-11-07T06:15:00Z',
    endTime: '2026-11-07T06:37:00Z',
    durationMinutes: 22,
    reasonCategory: 'CHANGEOVER',
    reasonDetail: 'Tooling die swap for Bracket batch #B-400A and pilot test strike',
    reasonDetailAr: 'تغيير قالب الكبس للتشغيلة الجديدة واختبار العينات الأولى',
    resolved: true,
    loggedBy: 'Ahmed Gamal (Operator)'
  },
  {
    id: 'dt-3',
    machineId: 'm-301',
    lineId: 'line-3',
    shiftId: 'shift-1',
    startTime: '2026-11-07T09:10:00Z',
    endTime: '2026-11-07T09:25:00Z',
    durationMinutes: 15,
    reasonCategory: 'MATERIAL_SHORTAGE',
    reasonDetail: 'Waiting for replenishment of M6 DIN912 high-tensile bolts from warehouse',
    reasonDetailAr: 'انتظار توريد براغي M6 عالية الشد من مستودع الأجزاء',
    resolved: true,
    loggedBy: 'Tarek Ibrahim (Operator)'
  },
  {
    id: 'dt-4',
    machineId: 'm-401',
    lineId: 'line-4',
    shiftId: 'shift-1',
    startTime: '2026-11-07T07:20:00Z',
    endTime: '2026-11-07T07:34:00Z',
    durationMinutes: 14,
    reasonCategory: 'ELECTRICAL',
    reasonDetail: 'Photoelectric safety curtain triggered by misaligned pallet tray',
    reasonDetailAr: 'توقف ستارة الأمان الضوئية بسبب انحراف قاعدة البالتة',
    resolved: true,
    loggedBy: 'Hassan Nabil (Operator)'
  },
  {
    id: 'dt-5',
    machineId: 'm-102',
    lineId: 'line-1',
    shiftId: 'shift-1',
    startTime: '2026-11-07T08:05:00Z',
    endTime: '2026-11-07T08:14:00Z',
    durationMinutes: 9,
    reasonCategory: 'OPERATOR_ERROR',
    reasonDetail: 'Strip alignment guide re-centering after sheet buckle',
    reasonDetailAr: 'إعادة ضبط مرشد تغذية الصاج بعد حدوث انبعاج طفيف',
    resolved: true,
    loggedBy: 'Ahmed Gamal (Operator)'
  }
];

export const initialQualityChecks: QualityCheck[] = [
  {
    id: 'qc-1',
    lineId: 'line-1',
    productId: 'prod-1',
    shiftId: 'shift-1',
    sampleSize: 100,
    defectsCount: 1,
    defectType: 'SURFACE_SCRATCH',
    defectTypeAr: 'خدوش سطحية خفيفة',
    inspectorName: 'Eng. Karim Fouad',
    timestamp: '2026-11-07T07:45:00Z',
    passed: true,
    notes: 'Acceptable under tolerance A-2'
  },
  {
    id: 'qc-2',
    lineId: 'line-2',
    productId: 'prod-2',
    shiftId: 'shift-1',
    sampleSize: 50,
    defectsCount: 4,
    defectType: 'WELD_POROSITY',
    defectTypeAr: 'مسامية وفراغات في خط اللحام',
    inspectorName: 'Eng. Karim Fouad',
    timestamp: '2026-11-07T08:30:00Z',
    passed: false,
    notes: 'Exceeded 3% limit (8.0% defect rate). Argon shielding gas flow was low.'
  },
  {
    id: 'qc-3',
    lineId: 'line-3',
    productId: 'prod-3',
    shiftId: 'shift-1',
    sampleSize: 80,
    defectsCount: 2,
    defectType: 'DIMENSIONAL',
    defectTypeAr: 'عدم تطابق في أقطار الثقوب',
    inspectorName: 'Mona Radwan (QA Tech)',
    timestamp: '2026-11-07T09:15:00Z',
    passed: true,
    notes: 'Reworkable on drill press'
  },
  {
    id: 'qc-4',
    lineId: 'line-4',
    productId: 'prod-4',
    shiftId: 'shift-1',
    sampleSize: 120,
    defectsCount: 2,
    defectType: 'PACKAGING_DEFECT',
    defectTypeAr: 'تلف في شريط التغليف والباركود',
    inspectorName: 'Mona Radwan (QA Tech)',
    timestamp: '2026-11-07T09:50:00Z',
    passed: true
  }
];

export const initialInventoryItems: InventoryItem[] = [
  {
    id: 'inv-1',
    factoryId: 'fact-1',
    sku: 'RAW-STL-COIL2',
    name: 'Hot Rolled Steel Sheet Coil 2.5mm',
    nameAr: 'لفائف صاج مدرفل على الساخن 2.5 مم',
    category: 'RAW_MATERIAL',
    currentStock: 48,
    minStock: 20,
    maxStock: 150,
    unit: 'Tons',
    unitAr: 'طن',
    locationBin: 'YARD-A-04'
  },
  {
    id: 'inv-2',
    factoryId: 'fact-1',
    sku: 'RAW-ALUM-ING',
    name: 'Aluminum Alloy Ingot A380',
    nameAr: 'سبائك ألومنيوم A380 للسباكة',
    category: 'RAW_MATERIAL',
    currentStock: 8.5,
    minStock: 15.0, // Low stock warning!
    maxStock: 80.0,
    unit: 'Tons',
    unitAr: 'طن',
    locationBin: 'WH-BIN-02'
  },
  {
    id: 'inv-3',
    factoryId: 'fact-1',
    sku: 'COMP-BOLT-M6',
    name: 'Socket Head Screws M6x25 DIN912 8.8',
    nameAr: 'مسامير آلن M6x25 صلب 8.8',
    category: 'WIP',
    currentStock: 4200,
    minStock: 5000, // Low stock warning!
    maxStock: 30000,
    unit: 'pcs',
    unitAr: 'قطعة',
    locationBin: 'RACK-C-12'
  },
  {
    id: 'inv-4',
    factoryId: 'fact-1',
    sku: 'FG-BRK-400A',
    name: 'Finished Chassis Bracket (Packaged)',
    nameAr: 'كتائف شاسيه تامة الصنع جاهزة للتسليم',
    category: 'FINISHED_GOODS',
    currentStock: 1420,
    minStock: 800,
    maxStock: 4000,
    unit: 'pcs',
    unitAr: 'قطعة',
    locationBin: 'DISPATCH-BAY-1'
  },
  {
    id: 'inv-5',
    factoryId: 'fact-1',
    sku: 'FG-JBOX-HV',
    name: 'Finished High-Voltage Enclosures',
    nameAr: 'صناديق توزيع كهربائي تامة الصنع',
    category: 'FINISHED_GOODS',
    currentStock: 310,
    minStock: 250,
    maxStock: 1200,
    unit: 'pcs',
    unitAr: 'قطعة',
    locationBin: 'DISPATCH-BAY-2'
  },
  {
    id: 'inv-6',
    factoryId: 'fact-1',
    sku: 'SPARE-KUKA-WRIST',
    name: 'Robotic Wrist Bearing & Seal Kit',
    nameAr: 'طقم رولمان بلي وموانع تسريب معصم الروبوت',
    category: 'SPARE_PART',
    currentStock: 2,
    minStock: 3, // Low stock!
    maxStock: 10,
    unit: 'Sets',
    unitAr: 'طقم',
    locationBin: 'TOOLROOM-S-01'
  }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: 'sm-1',
    inventoryItemId: 'inv-1',
    movementType: 'IN',
    quantity: 25,
    timestamp: '2026-11-07T05:30:00Z',
    referenceDoc: 'GRN-2026-8812 (Suez Steel)',
    performedBy: 'Hany Zaki (Storekeeper)'
  },
  {
    id: 'sm-2',
    inventoryItemId: 'inv-1',
    movementType: 'OUT',
    quantity: 6,
    timestamp: '2026-11-07T06:45:00Z',
    referenceDoc: 'PROD-REQ-L1-01',
    performedBy: 'Ahmed Gamal (Operator)'
  },
  {
    id: 'sm-3',
    inventoryItemId: 'inv-2',
    movementType: 'OUT',
    quantity: 3.2,
    timestamp: '2026-11-07T07:15:00Z',
    referenceDoc: 'MELT-BATCH-M3',
    performedBy: 'Tarek Ibrahim (Operator)'
  },
  {
    id: 'sm-4',
    inventoryItemId: 'inv-4',
    movementType: 'IN',
    quantity: 350,
    timestamp: '2026-11-07T08:50:00Z',
    referenceDoc: 'QA-RELEASE-882',
    performedBy: 'Eng. Karim Fouad'
  },
  {
    id: 'sm-5',
    inventoryItemId: 'inv-3',
    movementType: 'SCRAP',
    quantity: 45,
    timestamp: '2026-11-07T09:20:00Z',
    referenceDoc: 'SCRAP-LOG-991',
    performedBy: 'Mona Radwan (QA Tech)'
  }
];

export const initialAlerts: ThresholdAlert[] = [
  {
    id: 'alt-1',
    ruleName: 'Line Downtime Exceeded Threshold (>15 min)',
    ruleNameAr: 'تجاوز زمن توقف الخط للحد المسموح (> 15 دقيقة)',
    metric: 'line_downtime',
    thresholdValue: 15,
    currentValue: 48,
    severity: 'critical',
    factoryId: 'fact-1',
    lineId: 'line-2',
    message: 'Robotic Welding Cell (Line 02) has been stopped for 48 minutes due to Torch Collision.',
    messageAr: 'خلية اللحام الروبوتي (الخط 02) متوقفة منذ 48 دقيقة بسبب اصطدام شعلة اللحام.',
    timestamp: '2026-11-07T08:57:00Z',
    acknowledged: false,
    emailSent: true
  },
  {
    id: 'alt-2',
    ruleName: 'High Defect Rate Spike (> 3.0%)',
    ruleNameAr: 'ارتفاع معدل العيوب عن الحد الحرج (> 3.0%)',
    metric: 'defect_rate',
    thresholdValue: 3.0,
    currentValue: 8.0,
    severity: 'critical',
    factoryId: 'fact-1',
    lineId: 'line-2',
    message: 'Line 02 defect rate reached 8.0% during Quality Check #QC-2 (Weld Porosity).',
    messageAr: 'وصل معدل العيوب في الخط 02 إلى 8.0% في عينة فحص الجودة رقم 2 (مسامية اللحام).',
    timestamp: '2026-11-07T08:35:00Z',
    acknowledged: false,
    emailSent: true
  },
  {
    id: 'alt-3',
    ruleName: 'Raw Material Safety Stock Breach',
    ruleNameAr: 'هبوط مخزون المواد الخام دون حد الأمان',
    metric: 'low_stock',
    thresholdValue: 15.0,
    currentValue: 8.5,
    severity: 'warning',
    factoryId: 'fact-1',
    message: 'Aluminum Alloy Ingot A380 is at 8.5 Tons (Safety Minimum is 15.0 Tons). Risk of line starve within 18 hours.',
    messageAr: 'سبائك ألومنيوم A380 وصلت 8.5 طن (حد الأمان 15.0 طن). خطر توقف الإنتاج خلال 18 ساعة.',
    timestamp: '2026-11-07T07:20:00Z',
    acknowledged: true,
    emailSent: true
  }
];
