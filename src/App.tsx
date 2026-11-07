import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { OverviewPage } from './components/OverviewPage';
import { ProductionPage } from './components/ProductionPage';
import { DowntimePage } from './components/DowntimePage';
import { QualityPage } from './components/QualityPage';
import { InventoryPage } from './components/InventoryPage';
import { ReportsPage } from './components/ReportsPage';
import { DjangoCodeViewer } from './components/DjangoCodeViewer';
import { DataEntryModal } from './components/DataEntryModal';
import { BulkImportModal } from './components/BulkImportModal';
import { IoTTelemetryPanel } from './components/IoTTelemetryPanel';
import { AlertsModal } from './components/AlertsModal';

import { 
  UserRole, 
  Language, 
  FilterState, 
  ProductionLog, 
  DowntimeEvent, 
  QualityCheck, 
  StockMovement, 
  ThresholdAlert 
} from './types/factory';

import { 
  initialFactories, 
  initialLines, 
  initialMachines, 
  initialShifts, 
  initialProducts, 
  initialProductionLogs, 
  initialDowntimeEvents, 
  initialQualityChecks, 
  initialInventoryItems, 
  initialStockMovements, 
  initialAlerts 
} from './data/mockFactoryData';

import { translations } from './i18n/translations';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<UserRole>('manager');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  
  // Real-time interval
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(30); // 30s default
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    factoryId: 'all',
    lineId: 'all',
    shiftId: 'all',
  });

  // Master Data & Telemetry States
  const [factories] = useState(initialFactories);
  const [lines, setLines] = useState(initialLines);
  const [machines, setMachines] = useState(initialMachines);
  const [shifts] = useState(initialShifts);
  const [products] = useState(initialProducts);
  const [logs, setLogs] = useState<ProductionLog[]>(initialProductionLogs);
  const [downtimeEvents, setDowntimeEvents] = useState<DowntimeEvent[]>(initialDowntimeEvents);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(initialQualityChecks);
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [alerts, setAlerts] = useState<ThresholdAlert[]>(initialAlerts);

  // Dynamic Threshold Limits
  const [thresholds, setThresholds] = useState({
    defectRate: 3.0,
    downtimeMinutes: 15
  });

  // Modals
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isIoTPanelOpen, setIsIoTPanelOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const t = translations[lang];

  // Update HTML document direction and font when language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Apply global filters to data
  const filteredLogs = logs.filter(log => {
    if (filters.factoryId !== 'all' && log.factoryId !== filters.factoryId) return false;
    if (filters.lineId !== 'all' && log.lineId !== filters.lineId) return false;
    if (filters.shiftId !== 'all' && log.shiftId !== filters.shiftId) return false;
    return true;
  });

  const filteredDowntime = downtimeEvents.filter(dt => {
    if (filters.lineId !== 'all' && dt.lineId !== filters.lineId) return false;
    if (filters.shiftId !== 'all' && dt.shiftId !== filters.shiftId) return false;
    return true;
  });

  const filteredQuality = qualityChecks.filter(qc => {
    if (filters.lineId !== 'all' && qc.lineId !== filters.lineId) return false;
    if (filters.shiftId !== 'all' && qc.shiftId !== filters.shiftId) return false;
    return true;
  });

  const filteredInventory = inventoryItems.filter(item => {
    if (filters.factoryId !== 'all' && item.factoryId !== filters.factoryId) return false;
    return true;
  });

  // Data Entry Actions
  const handleAddProductionLog = (newLog: Omit<ProductionLog, 'id'>) => {
    const log: ProductionLog = {
      ...newLog,
      id: `pl-${Date.now()}`
    };
    setLogs(prev => [log, ...prev]);

    // Check if scrap rate > threshold
    const scrapPct = (log.qtyScrap / (log.qtyProduced + log.qtyScrap)) * 100;
    if (scrapPct > thresholds.defectRate) {
      const alert: ThresholdAlert = {
        id: `alt-${Date.now()}`,
        ruleName: `High Scrap Surge (> ${thresholds.defectRate}%): ${log.lineId}`,
        ruleNameAr: `ارتفاع نسبة الهدر عن ${thresholds.defectRate}% في الخط`,
        metric: 'defect_rate',
        thresholdValue: thresholds.defectRate,
        currentValue: Math.round(scrapPct * 10) / 10,
        severity: 'critical',
        lineId: log.lineId,
        factoryId: log.factoryId,
        message: `Line production log recorded ${log.qtyScrap} scrap units (${scrapPct.toFixed(1)}%). Supervisor attention requested.`,
        messageAr: `تم تسجيل ${log.qtyScrap} قطعة معيبة بنسبة ${scrapPct.toFixed(1)}%. مطلوب تدخل المشغل.`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        emailSent: true
      };
      setAlerts(prev => [alert, ...prev]);
    }
  };

  const handleAddDowntimeEvent = (newDt: Omit<DowntimeEvent, 'id'>) => {
    const dt: DowntimeEvent = {
      ...newDt,
      id: `dt-${Date.now()}`
    };
    setDowntimeEvents(prev => [dt, ...prev]);

    // Update machine status
    setMachines(prev => prev.map(m => m.id === dt.machineId ? { ...m, status: 'stopped' } : m));
    setLines(prev => prev.map(l => l.id === dt.lineId ? { ...l, status: 'stopped' } : l));

    // If duration > threshold, trigger alert
    if (dt.durationMinutes >= thresholds.downtimeMinutes) {
      const alert: ThresholdAlert = {
        id: `alt-${Date.now()}`,
        ruleName: `Continuous Stoppage Breach (>= ${thresholds.downtimeMinutes} min)`,
        ruleNameAr: `تجاوز زمن توقف الماكينة للحد المسموح`,
        metric: 'line_downtime',
        thresholdValue: thresholds.downtimeMinutes,
        currentValue: dt.durationMinutes,
        severity: 'critical',
        lineId: dt.lineId,
        message: `Machine stoppage reported (${dt.reasonCategory}). Duration: ${dt.durationMinutes} min. ${dt.reasonDetail}`,
        messageAr: `عطل مسجل على الماكينة (${dt.reasonCategory}). المدة: ${dt.durationMinutes} دقيقة.`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        emailSent: true
      };
      setAlerts(prev => [alert, ...prev]);
    }
  };

  const handleResolveDowntime = (id: string) => {
    const dt = downtimeEvents.find(d => d.id === id);
    if (!dt) return;

    setDowntimeEvents(prev => prev.map(d => d.id === id ? { ...d, resolved: true, endTime: new Date().toISOString() } : d));
    
    // Set machine & line back to running
    setMachines(prev => prev.map(m => m.id === dt.machineId ? { ...m, status: 'running' } : m));
    setLines(prev => prev.map(l => l.id === dt.lineId ? { ...l, status: 'running' } : l));
  };

  const handleAddQualityCheck = (newQc: Omit<QualityCheck, 'id'>) => {
    const qc: QualityCheck = {
      ...newQc,
      id: `qc-${Date.now()}`
    };
    setQualityChecks(prev => [qc, ...prev]);

    const defectRate = (qc.defectsCount / qc.sampleSize) * 100;
    if (defectRate > thresholds.defectRate) {
      const alert: ThresholdAlert = {
        id: `alt-${Date.now()}`,
        ruleName: `Quality Defect Rate Exceeded (${defectRate.toFixed(1)}% > ${thresholds.defectRate}%)`,
        ruleNameAr: `تجاوز نسبة العيوب المسموحة في فحص الجودة`,
        metric: 'defect_rate',
        thresholdValue: thresholds.defectRate,
        currentValue: defectRate,
        severity: 'critical',
        lineId: qc.lineId,
        message: `Inspection by ${qc.inspectorName} on ${qc.productId} found ${qc.defectsCount} defects in ${qc.sampleSize} sample.`,
        messageAr: `فحص الجودة للمنتج ${qc.productId} بواسطة ${qc.inspectorName} أظهر ${qc.defectsCount} قطعة معيبة.`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        emailSent: true
      };
      setAlerts(prev => [alert, ...prev]);
    }
  };

  const handleAddStockMovement = (newSm: Omit<StockMovement, 'id'>) => {
    const sm: StockMovement = {
      ...newSm,
      id: `sm-${Date.now()}`
    };
    setStockMovements(prev => [sm, ...prev]);

    // Recalculate inventory
    setInventoryItems(prev => prev.map(item => {
      if (item.id === sm.inventoryItemId) {
        let updatedStock = item.currentStock;
        if (sm.movementType === 'IN') updatedStock += sm.quantity;
        else if (sm.movementType === 'OUT' || sm.movementType === 'SCRAP') updatedStock -= sm.quantity;
        
        // Check if below min safety
        if (updatedStock < item.minStock) {
          const alert: ThresholdAlert = {
            id: `alt-${Date.now()}`,
            ruleName: `Low Safety Stock Warning: ${item.sku}`,
            ruleNameAr: `تحذير هبوط المخزون دون حد الأمان`,
            metric: 'low_stock',
            thresholdValue: item.minStock,
            currentValue: updatedStock,
            severity: 'warning',
            message: `Material '${item.name}' level is ${updatedStock} ${item.unit}, below minimum safety ${item.minStock} ${item.unit}.`,
            messageAr: `المادة '${item.nameAr}' رصيدها الحالي ${updatedStock} ${item.unitAr}، وهو دون الحد الأدنى الآمن.`,
            timestamp: new Date().toISOString(),
            acknowledged: false,
            emailSent: true
          };
          setAlerts(a => [alert, ...a]);
        }

        return { ...item, currentStock: Math.max(0, updatedStock) };
      }
      return item;
    }));
  };

  const handleImportLogs = (importedRows: Omit<ProductionLog, 'id'>[]) => {
    const newLogs = importedRows.map((row, i) => ({
      ...row,
      id: `bulk-${Date.now()}-${i}`
    }));
    setLogs(prev => [...newLogs, ...prev]);
  };

  const handleSimulateTelemetry = (payload: {
    machineCode: string;
    producedIncrement: number;
    scrapIncrement: number;
    status: 'running' | 'stopped' | 'idle';
    temperature: number;
    vibration: number;
  }) => {
    setMachines(prev => prev.map(m => {
      if (m.code === payload.machineCode) {
        return {
          ...m,
          status: payload.status,
          temperature: payload.temperature,
          vibration: payload.vibration,
          lastPing: 'Just now'
        };
      }
      return m;
    }));

    // If units produced > 0, append a log
    if (payload.producedIncrement > 0) {
      const machine = machines.find(m => m.code === payload.machineCode);
      const line = lines.find(l => l.id === machine?.lineId) || lines[0];
      const log: ProductionLog = {
        id: `iot-${Date.now()}`,
        factoryId: line.factoryId,
        lineId: line.id,
        machineId: machine?.id || 'm-101',
        shiftId: shifts[0]?.id || 'shift-1',
        productId: products[0]?.sku || 'SKU-BRK-400',
        qtyProduced: payload.producedIncrement,
        qtyTarget: 20,
        qtyScrap: payload.scrapIncrement,
        timestamp: new Date().toISOString(),
        loggedBy: 'PLC / Modbus Gateway (Automated)',
        notes: `Telemetry tick: Temp ${payload.temperature}°C, Vib ${payload.vibration}mm/s`
      };
      setLogs(prev => [log, ...prev]);
    }
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate slight telemetry fluctuation
      setMachines(prev => prev.map(m => ({
        ...m,
        temperature: m.temperature ? +(m.temperature + (Math.random() * 0.8 - 0.4)).toFixed(1) : 55,
        vibration: m.vibration ? +(m.vibration + (Math.random() * 0.2 - 0.1)).toFixed(1) : 1.5,
        lastPing: 'Just now'
      })));
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Industrial Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        role={role}
        setRole={setRole}
        lang={lang}
        setLang={setLang}
        autoRefreshInterval={autoRefreshInterval}
        setAutoRefreshInterval={setAutoRefreshInterval}
        activeAlerts={alerts}
        onOpenDataEntry={() => setIsDataEntryOpen(true)}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
        onOpenIoTPanel={() => setIsIoTPanelOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Role Banner Indicator */}
        <div className="mb-4 bg-slate-900/80 border border-slate-800 rounded-lg px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider font-mono">
              ROLE::{role.toUpperCase()}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">
              {t.roleNotice[role]}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>PLANT: CAI-01</span>
            <span>•</span>
            <span>ACTIVE LINES: {lines.filter(l => l.status === 'running').length}/{lines.length}</span>
          </div>
        </div>

        {/* Global Filter Bar (shown on all pages except django explorer) */}
        {currentTab !== 'django' && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            factories={factories}
            lines={lines}
            shifts={shifts}
            lang={lang}
          />
        )}

        {/* View Switching */}
        {currentTab === 'overview' && (
          <OverviewPage
            logs={filteredLogs}
            downtimeEvents={filteredDowntime}
            qualityChecks={filteredQuality}
            alerts={alerts}
            lines={lines}
            machines={machines}
            lang={lang}
            onOpenAlerts={() => setIsAlertsOpen(true)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'production' && (
          <ProductionPage
            logs={filteredLogs}
            lines={lines}
            shifts={shifts}
            products={products}
            lang={lang}
            onOpenDataEntry={() => setIsDataEntryOpen(true)}
          />
        )}

        {currentTab === 'downtime' && (
          <DowntimePage
            downtimeEvents={filteredDowntime}
            machines={machines}
            lines={lines}
            lang={lang}
            onOpenReportDowntime={() => setIsDataEntryOpen(true)}
            onResolveDowntime={handleResolveDowntime}
          />
        )}

        {currentTab === 'quality' && (
          <QualityPage
            qualityChecks={filteredQuality}
            lines={lines}
            products={products}
            lang={lang}
            onOpenLogQuality={() => setIsDataEntryOpen(true)}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryPage
            inventoryItems={filteredInventory}
            stockMovements={stockMovements}
            lang={lang}
            onOpenLogMovement={() => setIsDataEntryOpen(true)}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsPage
            logs={filteredLogs}
            downtimeEvents={filteredDowntime}
            qualityChecks={filteredQuality}
            lines={lines}
            factories={factories}
            shifts={shifts}
            filters={filters}
            lang={lang}
          />
        )}

        {currentTab === 'django' && (
          <DjangoCodeViewer lang={lang} />
        )}

      </main>

      {/* Interactive Modals */}
      <DataEntryModal
        isOpen={isDataEntryOpen}
        onClose={() => setIsDataEntryOpen(false)}
        lines={lines}
        machines={machines}
        shifts={shifts}
        products={products}
        inventoryItems={inventoryItems}
        lang={lang}
        onAddProductionLog={handleAddProductionLog}
        onAddDowntimeEvent={handleAddDowntimeEvent}
        onAddQualityCheck={handleAddQualityCheck}
        onAddStockMovement={handleAddStockMovement}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        lang={lang}
        onImportLogs={handleImportLogs}
      />

      <IoTTelemetryPanel
        isOpen={isIoTPanelOpen}
        onClose={() => setIsIoTPanelOpen(false)}
        machines={machines}
        lang={lang}
        onSimulateTelemetry={handleSimulateTelemetry}
      />

      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        lang={lang}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onUpdateThresholds={setThresholds}
        currentThresholds={thresholds}
      />

      {/* Industrial Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-400">FactoryPulse MES / BI</span>
          <span>•</span>
          <span>Engineered for Django 5.x & Real-time Shop Floor Industrial Intelligence</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>POSTGRESQL 16</span>
          <span>REDIS / CELERY BEAT</span>
          <span>OPC-UA / REST INGEST</span>
        </div>
      </footer>
    </div>
  );
}
