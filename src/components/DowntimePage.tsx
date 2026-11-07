import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Activity, 
  CheckCircle2, 
  AlertOctagon, 
  PlusCircle, 
  Filter,
  BarChart2
} from 'lucide-react';
import { 
  DowntimeEvent, 
  Machine, 
  ProductionLine, 
  Language, 
  DowntimeCategory 
} from '../types/factory';
import { translations } from '../i18n/translations';

interface DowntimePageProps {
  downtimeEvents: DowntimeEvent[];
  machines: Machine[];
  lines: ProductionLine[];
  lang: Language;
  onOpenReportDowntime: () => void;
  onResolveDowntime: (id: string) => void;
}

export const DowntimePage: React.FC<DowntimePageProps> = ({
  downtimeEvents,
  machines,
  lines,
  lang,
  onOpenReportDowntime,
  onResolveDowntime
}) => {
  const t = translations[lang];

  // 1. Calculate Pareto Data: Sum duration by category
  const categoryDurations: Record<DowntimeCategory, number> = {
    MECHANICAL: 0,
    CHANGEOVER: 0,
    MATERIAL_SHORTAGE: 0,
    ELECTRICAL: 0,
    OPERATOR_ERROR: 0,
    PLANNED_MAINTENANCE: 0
  };

  downtimeEvents.forEach(e => {
    categoryDurations[e.reasonCategory] = (categoryDurations[e.reasonCategory] || 0) + e.durationMinutes;
  });

  const categoryLabels: Record<DowntimeCategory, { en: string; ar: string }> = {
    MECHANICAL: { en: 'Mechanical Failure', ar: 'عطل ميكانيكي' },
    CHANGEOVER: { en: 'Setup & Changeover', ar: 'تغيير إعداد وضبط' },
    MATERIAL_SHORTAGE: { en: 'Material Shortage', ar: 'نقص المواد الخام' },
    ELECTRICAL: { en: 'Electrical & Sensors', ar: 'عطل كهربائي وحساسات' },
    OPERATOR_ERROR: { en: 'Operator Adjustments', ar: 'تعديلات المشغل' },
    PLANNED_MAINTENANCE: { en: 'Planned Maintenance', ar: 'صيانة وقائية دورية' },
  };

  // Sort descending for Pareto
  const sortedCategories = Object.entries(categoryDurations)
    .map(([cat, minutes]) => ({
      category: cat as DowntimeCategory,
      minutes,
      label: lang === 'ar' ? categoryLabels[cat as DowntimeCategory].ar : categoryLabels[cat as DowntimeCategory].en
    }))
    .sort((a, b) => b.minutes - a.minutes);

  const totalDowntime = sortedCategories.reduce((acc, curr) => acc + curr.minutes, 0) || 1;

  // Compute cumulative percentages
  let runningSum = 0;
  const paretoData = sortedCategories.map(item => {
    runningSum += item.minutes;
    const cumPct = Math.round((runningSum / totalDowntime) * 100);
    return {
      ...item,
      percentage: Math.round((item.minutes / totalDowntime) * 100),
      cumPct
    };
  });

  // MTBF and MTTR calculations
  const totalEvents = downtimeEvents.length || 1;
  const mttr = Math.round(totalDowntime / totalEvents); // Mean Time To Repair
  const plannedOperatingHours = 48; // for past 2 days
  const mtbf = Math.round((plannedOperatingHours * 60 - totalDowntime) / (totalEvents * 60)); // hours

  // Machine Timeline timeline slots (e.g. 06:00, 08:00, 10:00, 12:00, 14:00)
  const timelineHours = ['06:00', '07:30', '09:00', '10:30', '12:00', '13:30', '14:00'];

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-400" />
            <span>{t.downtimePareto}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar' ? 'تحليل أسباب التوقف الجذرية وقاعدة 80/20 والمخطط الزمني للآلات' : 'Root cause downtime Pareto distribution (80/20 rule) and live machine timeline.'}
          </p>
        </div>

        <button
          onClick={onOpenReportDowntime}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{t.logDowntime}</span>
        </button>
      </div>

      {/* Top Metrics Cards: Total Stoppage, MTBF, MTTR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs block mb-1">Total Downtime (Today)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-rose-400">{totalDowntime}</span>
            <span className="text-xs text-slate-400 font-mono">minutes ({(totalDowntime / 60).toFixed(1)} hrs)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Lost capacity equivalent to ~{Math.round(totalDowntime * 2.8)} units.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs block mb-1">MTBF (Mean Time Between Failures)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-cyan-400">{mtbf}</span>
            <span className="text-xs text-slate-400 font-mono">operating hours</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            World-class target for automotive cells: &gt; 35 hours.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs block mb-1">MTTR (Mean Time To Repair)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">{mttr}</span>
            <span className="text-xs text-slate-400 font-mono">minutes avg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Average recovery response from line stoppage to restart.
          </p>
        </div>
      </div>

      {/* Pareto Chart (80/20 Rule: Bars + Cumulative Line) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 bg-rose-500 rounded-sm inline-block" />
              <span>Downtime Duration (Minutes)</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 bg-amber-400 inline-block" />
              <span>Cumulative % (80% Cutoff Line)</span>
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            80% of lost time stems from top 2 causes
          </span>
        </div>

        <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-800 relative">
          {/* 80% Horizontal Reference Line */}
          <div 
            className="absolute w-full border-t-2 border-dashed border-amber-400/60 z-10 pointer-events-none left-0"
            style={{ bottom: '80%' }}
          >
            <span className="absolute right-2 -top-4 text-[10px] font-mono text-amber-400 font-bold bg-slate-900 px-1">
              80% Pareto Threshold
            </span>
          </div>

          {paretoData.map((item, idx) => {
            const maxVal = Math.max(...paretoData.map(p => p.minutes), 50);
            const barHeightPct = (item.minutes / maxVal) * 75; // scale to 75% max bar height

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-950 border border-slate-700 text-[10px] text-slate-200 px-2 py-1 rounded shadow-xl font-mono whitespace-nowrap z-30">
                  <div className="font-bold text-white">{item.label}</div>
                  <div>Duration: <span className="text-rose-400 font-bold">{item.minutes} min</span> ({item.percentage}%)</div>
                  <div>Cumulative: <span className="text-amber-400 font-bold">{item.cumPct}%</span></div>
                </div>

                {/* Cumulative % marker circle */}
                <div 
                  className="absolute w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-950 z-20 shadow transform -translate-x-1/2 left-1/2"
                  style={{ bottom: `${item.cumPct * 0.75 + 10}%` }}
                />

                {/* Bar */}
                <div 
                  className="w-full max-w-[54px] rounded-t bg-gradient-to-t from-rose-950 via-rose-800 to-rose-500 hover:brightness-125 transition-all duration-300 relative"
                  style={{ height: `${barHeightPct}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-white absolute -top-5 w-full text-center">
                    {item.minutes}m
                  </span>
                </div>

                {/* Label */}
                <span className="text-[10px] text-slate-300 font-medium mt-2 text-center line-clamp-1 truncate max-w-[80px]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Machine Timeline / Shop Floor Gantt View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>{t.downtimeTimeline}</span>
        </h3>

        <div className="space-y-3">
          {machines.map((machine) => {
            const isStopped = machine.status === 'stopped';
            const relatedEvents = downtimeEvents.filter(e => e.machineId === machine.id);

            return (
              <div key={machine.id} className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isStopped ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="font-mono font-bold text-white">{machine.code}</span>
                    <span className="text-slate-400">({lang === 'ar' ? machine.nameAr : machine.name})</span>
                  </div>
                  <span className={`font-mono text-[11px] font-semibold ${isStopped ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isStopped ? 'STOPPED' : 'RUNNING (98.2% Avail)'}
                  </span>
                </div>

                {/* Horizontal Gantt timeline bar */}
                <div className="w-full bg-slate-900 h-6 rounded-md flex overflow-hidden border border-slate-800 relative">
                  {/* Visual segments simulating the shift */}
                  {isStopped ? (
                    <>
                      <div className="bg-emerald-600/80 hover:bg-emerald-500 h-full flex-[4] border-r border-slate-950" title="06:00 - 08:42 Running" />
                      <div className="bg-rose-600 hover:bg-rose-500 h-full flex-[3] animate-pulse border-r border-slate-950" title="08:42 - Ongoing Breakdown (Torch Collision)" />
                    </>
                  ) : machine.code === 'HP-500' ? (
                    <>
                      <div className="bg-amber-600/80 h-full flex-[1] border-r border-slate-950" title="06:15 - 06:37 Tooling Swap Changeover" />
                      <div className="bg-emerald-600/80 h-full flex-[6]" title="06:37 - Running" />
                    </>
                  ) : (
                    <div className="bg-emerald-600/80 h-full w-full" title="Continuous running" />
                  )}
                </div>

                {/* Shift time markers */}
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1 px-1">
                  {timelineHours.map((th, i) => (
                    <span key={i}>{th}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Events Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-4">
          {lang === 'ar' ? 'سجل أحداث وأسباب التوقف التفصيلي' : 'Incident Breakdown Log & Corrective Actions'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Start Time</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Machine</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Root Cause & Action</th>
                <th className="py-2.5 px-3">Logged By</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {downtimeEvents.map((event) => {
                const machine = machines.find(m => m.id === event.machineId);
                return (
                  <tr key={event.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3">
                      {event.resolved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Ongoing
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-rose-400 whitespace-nowrap">
                      {event.durationMinutes} min
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                      {machine?.code || event.machineId}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 whitespace-nowrap">
                      {event.reasonCategory}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 max-w-xs">
                      {lang === 'ar' ? event.reasonDetailAr : event.reasonDetail}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {event.loggedBy}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {!event.resolved && (
                        <button
                          onClick={() => onResolveDowntime(event.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow transition"
                        >
                          Resolve
                        </button>
                      )}
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
