import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertOctagon, 
  Percent, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Zap, 
  Flame, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ProductionLog, 
  DowntimeEvent, 
  QualityCheck, 
  ThresholdAlert, 
  ProductionLine, 
  Machine, 
  Language 
} from '../types/factory';
import { translations } from '../i18n/translations';

interface OverviewPageProps {
  logs: ProductionLog[];
  downtimeEvents: DowntimeEvent[];
  qualityChecks: QualityCheck[];
  alerts: ThresholdAlert[];
  lines: ProductionLine[];
  machines: Machine[];
  lang: Language;
  onOpenAlerts: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  logs,
  downtimeEvents,
  qualityChecks,
  alerts,
  lines,
  machines,
  lang,
  onOpenAlerts,
  onNavigateTab
}) => {
  const t = translations[lang];

  // 1. Production totals
  const totalProduced = logs.reduce((acc, log) => acc + log.qtyProduced, 0);
  const totalTarget = logs.reduce((acc, log) => acc + log.qtyTarget, 0) || 1;
  const totalScrap = logs.reduce((acc, log) => acc + log.qtyScrap, 0);
  const completionRate = Math.min(100, (totalProduced / totalTarget) * 100);

  // 2. Downtime totals
  const totalDowntimeMinutes = downtimeEvents.reduce((acc, dt) => acc + dt.durationMinutes, 0);
  const downtimeHours = (totalDowntimeMinutes / 60).toFixed(1);
  const ongoingStoppages = downtimeEvents.filter(dt => !dt.resolved);

  // 3. Quality & Scrap
  const totalInspected = qualityChecks.reduce((acc, qc) => acc + qc.sampleSize, 0);
  const totalDefects = qualityChecks.reduce((acc, qc) => acc + qc.defectsCount, 0);
  const defectRate = totalInspected > 0 ? ((totalDefects / totalInspected) * 100) : 1.4;

  // 4. OEE Pillars Calculation
  // Availability: (Operating time / Planned time)
  const plannedMinutes = Math.max(1, 8 * 60 * (lines.length || 1));
  const operatingMinutes = Math.max(0, plannedMinutes - totalDowntimeMinutes);
  const availability = Math.min(100, Math.max(0, (operatingMinutes / plannedMinutes) * 100));

  // Performance: (Actual output / Target output)
  const performance = Math.min(100, Math.max(0, (totalProduced / totalTarget) * 100));

  // Quality: (Good units / Total units)
  const quality = totalProduced + totalScrap > 0
    ? Math.min(100, (totalProduced / (totalProduced + totalScrap)) * 100)
    : 98.5;

  const oee = (availability * performance * quality) / 10000;

  // OEE Rating color
  const getOeeColor = (val: number) => {
    if (val >= 85) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    if (val >= 75) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (val >= 65) return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const unackAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Active Critical Alerts Notice (if any) */}
      {unackAlerts.length > 0 && (
        <div 
          onClick={onOpenAlerts}
          className="bg-rose-950/40 border border-rose-600/50 rounded-xl p-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-950/60 transition shadow-lg shadow-rose-950/30"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertOctagon className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-rose-200">
                  {lang === 'ar' ? 'تنبيه صناعي حرج نشط:' : 'Active Critical Shop-floor Alert:'}
                </span>
                <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono border border-rose-500/40">
                  {unackAlerts[0].metric.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-rose-300/90 mt-0.5 line-clamp-1">
                {lang === 'ar' ? unackAlerts[0].messageAr : unackAlerts[0].message}
              </p>
            </div>
          </div>
          <button className="text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg whitespace-nowrap transition shadow">
            {t.viewAlerts} ({unackAlerts.length})
          </button>
        </div>
      )}

      {/* Primary KPI Grid (6 Top Level Industrial Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Output vs Target */}
        <div 
          onClick={() => onNavigateTab('production')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl shadow-sm cursor-pointer transition relative group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">{t.outputVsTarget}</span>
            <span className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {totalProduced.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {totalTarget.toLocaleString()} {t.units}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">{t.completionRate}</span>
              <span className="font-mono font-bold text-blue-400">{completionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, completionRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Overall Equipment Effectiveness (OEE) */}
        <div 
          onClick={() => onNavigateTab('downtime')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl shadow-sm cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">{t.oeeLabel}</span>
            <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Gauge className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${oee >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {oee.toFixed(1)}%
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded font-mono font-semibold bg-slate-800 text-slate-300">
              {oee >= 85 ? 'World-Class' : oee >= 75 ? 'Typical' : 'Below Target'}
            </span>
          </div>

          {/* 3 Pillars breakdown mini chips */}
          <div className="grid grid-cols-3 gap-1 mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-center font-mono">
            <div className="bg-slate-950/60 rounded p-1">
              <span className="text-slate-400 block text-[9px]">A (Avail)</span>
              <span className="font-bold text-slate-200">{availability.toFixed(0)}%</span>
            </div>
            <div className="bg-slate-950/60 rounded p-1">
              <span className="text-slate-400 block text-[9px]">P (Perf)</span>
              <span className="font-bold text-slate-200">{performance.toFixed(0)}%</span>
            </div>
            <div className="bg-slate-950/60 rounded p-1">
              <span className="text-slate-400 block text-[9px]">Q (Qual)</span>
              <span className="font-bold text-slate-200">{quality.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Downtime Hours */}
        <div 
          onClick={() => onNavigateTab('downtime')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl shadow-sm cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">{t.downtimeHours}</span>
            <span className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {downtimeHours}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {t.hours} ({totalDowntimeMinutes} {t.minutes})
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Current stoppages:</span>
            <span className={`font-mono font-bold ${ongoingStoppages.length > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {ongoingStoppages.length} {ongoingStoppages.length === 1 ? 'line stopped' : 'lines stopped'}
            </span>
          </div>
        </div>

        {/* KPI 4: Quality & Defect Rate */}
        <div 
          onClick={() => onNavigateTab('quality')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl shadow-sm cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">{t.defectRate}</span>
            <span className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${defectRate > 3.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {defectRate.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Limit: &le; 3.0%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Scrapped units:</span>
            <span className="font-mono font-bold text-amber-400">
              {totalScrap} {t.units}
            </span>
          </div>
        </div>

      </div>

      {/* Middle Section: Live Machine Telemetry & Shop Floor Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'حالة الآلات والمعدات المباشرة (IoT Field Telemetry)' : 'Live Machine & Asset Status (IoT Field Telemetry)'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'متابعة حية للحرارة والاهتزاز وحالة التشغيل اللحظية' : 'Real-time telemetry showing thermal levels, vibration, and operation status'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {t.running} ({machines.filter(m => m.status === 'running').length})
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              {t.stopped} ({machines.filter(m => m.status === 'stopped').length})
            </span>
          </div>
        </div>

        {/* Machine cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {machines.map((machine) => {
            const isStopped = machine.status === 'stopped';
            return (
              <div 
                key={machine.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isStopped 
                    ? 'bg-rose-950/20 border-rose-800/50 hover:border-rose-600' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isStopped ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                      <span className="font-mono text-xs font-bold text-white">{machine.code}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                        isStopped ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {isStopped ? t.stopped : t.running}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                      {lang === 'ar' ? machine.nameAr : machine.name}
                    </h3>
                  </div>
                </div>

                {/* Telemetry badges */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
                  <div className="bg-slate-900/80 rounded px-1.5 py-1">
                    <span className="text-[9px] text-slate-400 block">TEMP</span>
                    <span className={`font-bold ${machine.temperature && machine.temperature > 70 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {machine.temperature ? `${machine.temperature.toFixed(1)}°C` : '--'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 rounded px-1.5 py-1">
                    <span className="text-[9px] text-slate-400 block">VIB</span>
                    <span className={`font-bold ${machine.vibration && machine.vibration > 4 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {machine.vibration ? `${machine.vibration.toFixed(1)} mm/s` : '--'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 rounded px-1.5 py-1">
                    <span className="text-[9px] text-slate-400 block">SPEED</span>
                    <span className="font-bold text-slate-200">
                      {machine.rpm !== undefined ? `${machine.rpm} RPM` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Production Stream & Shift Overview Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? 'أحدث سجلات الإنتاج للوردية الحالية' : 'Recent Shift Production Records'}</span>
          </h2>
          <button
            onClick={() => onNavigateTab('production')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
          >
            <span>{lang === 'ar' ? 'عرض كافة السجلات' : 'View All Logs'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Line</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3 text-right">Produced</th>
                <th className="py-2.5 px-3 text-right">Target</th>
                <th className="py-2.5 px-3 text-right">Scrap</th>
                <th className="py-2.5 px-3">Pacing</th>
                <th className="py-2.5 px-3">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {logs.slice(0, 6).map((log) => {
                const line = lines.find(l => l.id === log.lineId);
                const pace = (log.qtyProduced / log.qtyTarget) * 100;
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                      {line?.code || log.lineId}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 whitespace-nowrap">
                      {log.productId}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">
                      {log.qtyProduced}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {log.qtyTarget}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${log.qtyScrap > 3 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {log.qtyScrap}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        pace >= 100 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : pace >= 85 
                          ? 'bg-blue-500/10 text-blue-400' 
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {pace.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[120px]">
                      {log.loggedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
