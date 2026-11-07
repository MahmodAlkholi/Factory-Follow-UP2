import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Layers, 
  Search, 
  Filter, 
  PlusCircle, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  ProductionLog, 
  ProductionLine, 
  Shift, 
  Product, 
  Language 
} from '../types/factory';
import { translations } from '../i18n/translations';

interface ProductionPageProps {
  logs: ProductionLog[];
  lines: ProductionLine[];
  shifts: Shift[];
  products: Product[];
  lang: Language;
  onOpenDataEntry: () => void;
}

export const ProductionPage: React.FC<ProductionPageProps> = ({
  logs,
  lines,
  shifts,
  products,
  lang,
  onOpenDataEntry
}) => {
  const t = translations[lang];
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [searchTerm, setSearchTerm] = useState('');

  // Hourly simulated bins (06:00 to 14:00 shift)
  const hourlyData = [
    { hour: '06:00 - 07:00', target: 585, actual: 554, scrap: 8 },
    { hour: '07:00 - 08:00', target: 585, actual: 566, scrap: 14 },
    { hour: '08:00 - 09:00', target: 585, actual: 512, scrap: 11 }, // Welder collision occurred
    { hour: '09:00 - 10:00', target: 585, actual: 578, scrap: 6 },
    { hour: '10:00 - 11:00', target: 585, actual: 590, scrap: 7 },
    { hour: '11:00 - 12:00', target: 585, actual: 540, scrap: 9 },
    { hour: '12:00 - 13:00', target: 585, actual: 580, scrap: 5 },
    { hour: '13:00 - 14:00', target: 585, actual: 588, scrap: 6 },
  ];

  // Per-line aggregation from logs
  const lineStats = lines.map(line => {
    const lineLogs = logs.filter(l => l.lineId === line.id);
    const produced = lineLogs.reduce((acc, l) => acc + l.qtyProduced, 0);
    const target = lineLogs.reduce((acc, l) => acc + l.qtyTarget, 0) || (line.targetHourly * 4);
    const scrap = lineLogs.reduce((acc, l) => acc + l.qtyScrap, 0);
    const efficiency = target > 0 ? (produced / target) * 100 : 0;
    return {
      line,
      produced,
      target,
      scrap,
      efficiency
    };
  });

  // Per-shift simulated comparison
  const shiftComparison = [
    { name: 'Shift A (Morning)', nameAr: 'الوردية الأولى (صباحية)', output: 4508, target: 4680, efficiency: 96.3, scrapRate: 1.4 },
    { name: 'Shift B (Evening)', nameAr: 'الوردية الثانية (مسائية)', output: 4210, target: 4680, efficiency: 89.9, scrapRate: 2.1 },
    { name: 'Shift C (Night)', nameAr: 'الوردية الثالثة (ليلية)', output: 3950, target: 4680, efficiency: 84.4, scrapRate: 2.8 },
  ];

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const line = lines.find(l => l.id === log.lineId);
    return (
      log.productId.toLowerCase().includes(term) ||
      log.loggedBy.toLowerCase().includes(term) ||
      (line && line.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>{t.productionHourlyTrend}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar' ? 'متابعة وتيرة الإنتاج الفعلي مقابل المستهدف المعياري وتحليل الخطوط والورديات' : 'Monitor actual production pacing vs standard rates, with per-line and shift comparisons.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe toggle */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setTimeframe('hourly')}
              className={`px-3 py-1 rounded font-medium transition ${timeframe === 'hourly' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              {lang === 'ar' ? 'بالساعة' : 'Hourly'}
            </button>
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1 rounded font-medium transition ${timeframe === 'daily' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              {lang === 'ar' ? 'يومي' : 'Daily'}
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 rounded font-medium transition ${timeframe === 'weekly' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              {lang === 'ar' ? 'أسبوعي' : 'Weekly'}
            </button>
          </div>

          <button
            onClick={onOpenDataEntry}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.logProduction}</span>
          </button>
        </div>
      </div>

      {/* Main Chart 1: Hourly Production Pace (SVG Responsive Bar & Target Line Chart) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-3 h-3 bg-cyan-500 rounded-sm inline-block" />
              <span>{lang === 'ar' ? 'الإنتاج الفعلي (قطع)' : 'Actual Output (Units)'}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-3 h-0.5 bg-amber-400 border border-dashed inline-block" />
              <span>{lang === 'ar' ? 'المستهدف المعياري (585)' : 'Standard Target (585)'}</span>
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {lang === 'ar' ? 'الوردية الصباحية (06:00 - 14:00)' : 'Current Shift Window (06:00 - 14:00)'}
          </span>
        </div>

        {/* Custom SVG Bar & Trend visualization */}
        <div className="h-64 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-800">
          {hourlyData.map((d, idx) => {
            const maxVal = 650;
            const heightPct = (d.actual / maxVal) * 100;
            const targetHeightPct = (d.target / maxVal) * 100;
            const isBehind = d.actual < d.target;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-950 border border-slate-700 text-[10px] text-slate-200 px-2 py-1 rounded shadow-xl font-mono whitespace-nowrap z-20">
                  <div className="font-bold text-white">{d.hour}</div>
                  <div>Actual: <span className="text-cyan-400 font-bold">{d.actual}</span> / Target: {d.target}</div>
                  <div>Scrap: <span className="text-rose-400">{d.scrap}</span></div>
                </div>

                {/* Target line tick */}
                <div 
                  className="absolute w-full border-t-2 border-dashed border-amber-400/70 z-10 pointer-events-none"
                  style={{ bottom: `${targetHeightPct}%` }}
                />

                {/* Actual Bar */}
                <div 
                  className={`w-full max-w-[48px] rounded-t transition-all duration-300 relative ${
                    isBehind ? 'bg-gradient-to-t from-cyan-900 to-cyan-500' : 'bg-gradient-to-t from-emerald-800 to-emerald-400'
                  } group-hover:brightness-125`}
                  style={{ height: `${heightPct}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-white absolute -top-5 w-full text-center hidden sm:block">
                    {d.actual}
                  </span>
                </div>

                {/* Hour label */}
                <span className="text-[9px] text-slate-400 font-mono mt-2 truncate max-w-[50px] text-center">
                  {d.hour.split(' - ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Line Comparison & Shift Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line-by-Line Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{t.lineComparison}</span>
          </h3>

          <div className="space-y-4">
            {lineStats.map(({ line, produced, target, efficiency, scrap }) => (
              <div key={line.id} className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white">
                    {lang === 'ar' ? line.nameAr : line.name}
                  </span>
                  <span className={`font-mono font-bold ${efficiency >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {efficiency.toFixed(1)}% Eff
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${efficiency >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, efficiency)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Output: {produced} / {target} {t.units}</span>
                  <span>Scrap: <strong className="text-rose-400">{scrap}</strong></span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                    line.status === 'stopped' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {line.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-Shift Comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{t.shiftComparison}</span>
          </h3>

          <div className="space-y-4">
            {shiftComparison.map((s, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white">{lang === 'ar' ? s.nameAr : s.name}</span>
                  <span className="font-mono text-cyan-400 font-semibold">{s.output.toLocaleString()} {t.units}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-900 rounded p-1.5">
                    <span className="text-[10px] text-slate-400 block">Efficiency</span>
                    <span className="font-bold text-white">{s.efficiency}%</span>
                  </div>
                  <div className="bg-slate-900 rounded p-1.5">
                    <span className="text-[10px] text-slate-400 block">Scrap Rate</span>
                    <span className={`font-bold ${s.scrapRate > 2.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {s.scrapRate}%
                    </span>
                  </div>
                  <div className="bg-slate-900 rounded p-1.5">
                    <span className="text-[10px] text-slate-400 block">Variance</span>
                    <span className="font-bold text-slate-200">
                      {s.output - s.target}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Production Log History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-white">
            {lang === 'ar' ? 'سجل تشغيلات الإنتاج المفصل' : 'Detailed Production Run Logs'}
          </h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by SKU, line, or operator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Line</th>
                <th className="py-2.5 px-3">Product SKU</th>
                <th className="py-2.5 px-3 text-right">Good Qty</th>
                <th className="py-2.5 px-3 text-right">Target</th>
                <th className="py-2.5 px-3 text-right">Scrap</th>
                <th className="py-2.5 px-3">Scrap %</th>
                <th className="py-2.5 px-3">Logged By</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredLogs.map((log) => {
                const scrapRate = ((log.qtyScrap / (log.qtyProduced + log.qtyScrap)) * 100) || 0;
                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                      {lines.find(l => l.id === log.lineId)?.code || log.lineId}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400 whitespace-nowrap">
                      {log.productId}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">
                      {log.qtyProduced}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {log.qtyTarget}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-400 font-bold">
                      {log.qtyScrap}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        scrapRate > 3.0 ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
                      }`}>
                        {scrapRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {log.loggedBy}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] italic truncate max-w-[160px]">
                      {log.notes || '--'}
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
