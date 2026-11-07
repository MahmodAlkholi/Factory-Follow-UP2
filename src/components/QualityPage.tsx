import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Percent, 
  ShieldAlert, 
  PlusCircle, 
  Search, 
  PieChart, 
  Layers 
} from 'lucide-react';
import { 
  QualityCheck, 
  ProductionLine, 
  Product, 
  Language, 
  DefectType 
} from '../types/factory';
import { translations } from '../i18n/translations';

interface QualityPageProps {
  qualityChecks: QualityCheck[];
  lines: ProductionLine[];
  products: Product[];
  lang: Language;
  onOpenLogQuality: () => void;
}

export const QualityPage: React.FC<QualityPageProps> = ({
  qualityChecks,
  lines,
  products,
  lang,
  onOpenLogQuality
}) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Overall stats
  const totalSamples = qualityChecks.reduce((acc, qc) => acc + qc.sampleSize, 0);
  const totalDefects = qualityChecks.reduce((acc, qc) => acc + qc.defectsCount, 0);
  const overallDefectRate = totalSamples > 0 ? (totalDefects / totalSamples) * 100 : 0;
  const firstPassYield = Math.max(0, 100 - overallDefectRate);

  // 2. Defect types distribution
  const defectCounts: Record<DefectType, number> = {
    WELD_POROSITY: 0,
    DIMENSIONAL: 0,
    SURFACE_SCRATCH: 0,
    SEAL_FAILURE: 0,
    MISSING_PART: 0,
    PACKAGING_DEFECT: 0
  };

  qualityChecks.forEach(qc => {
    defectCounts[qc.defectType] = (defectCounts[qc.defectType] || 0) + qc.defectsCount;
  });

  const defectTypeLabels: Record<DefectType, { en: string; ar: string; color: string }> = {
    WELD_POROSITY: { en: 'Weld Porosity / Seam', ar: 'مسامية وفراغات اللحام', color: 'bg-rose-500' },
    DIMENSIONAL: { en: 'Dimensional Out-of-Spec', ar: 'أبعاد غير مطابقة للرسم', color: 'bg-amber-500' },
    SURFACE_SCRATCH: { en: 'Surface Scratch / Dent', ar: 'خدوش وتشوهات سطحية', color: 'bg-cyan-500' },
    SEAL_FAILURE: { en: 'Seal / Pressure Leak', ar: 'تسريب أو عيب إحكام', color: 'bg-purple-500' },
    MISSING_PART: { en: 'Missing Fastener / Clip', ar: 'نقص مكون أو برغي', color: 'bg-blue-500' },
    PACKAGING_DEFECT: { en: 'Packaging & Labeling', ar: 'عيب بالتغليف والباركود', color: 'bg-emerald-500' },
  };

  const defectList = Object.entries(defectCounts)
    .map(([type, count]) => ({
      type: type as DefectType,
      count,
      meta: defectTypeLabels[type as DefectType]
    }))
    .sort((a, b) => b.count - a.count);

  // 3. Defect rate by line
  const lineQuality = lines.map(line => {
    const checks = qualityChecks.filter(qc => qc.lineId === line.id);
    const samples = checks.reduce((acc, c) => acc + c.sampleSize, 0);
    const defects = checks.reduce((acc, c) => acc + c.defectsCount, 0);
    const rate = samples > 0 ? (defects / samples) * 100 : 0.8;
    return {
      line,
      samples,
      defects,
      rate
    };
  });

  const filteredChecks = qualityChecks.filter(qc => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      qc.inspectorName.toLowerCase().includes(term) ||
      qc.defectType.toLowerCase().includes(term) ||
      qc.productId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{t.navQuality}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar' ? 'متابعة نسب العيوب مقارنة بالحد الحرج 3.0% وتصنيف الأسباب الجذرية للهدر' : 'Monitor defect rates against the 3.0% critical threshold and analyze scrap root causes.'}
          </p>
        </div>

        <button
          onClick={onOpenLogQuality}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t.logQuality}</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Defect Rate */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs block mb-1">{t.defectRate}</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black font-mono tracking-tight ${overallDefectRate > 3.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {overallDefectRate.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / Limit &le; 3.00%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {overallDefectRate > 3.0 
              ? 'Warning: Process capability limits exceeded on welding cell!' 
              : 'Within acceptable statistical process control limits.'}
          </p>
        </div>

        {/* First Pass Yield (FPY) */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs block mb-1">First Pass Yield (FPY)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-cyan-400">
              {firstPassYield.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">Six Sigma target: &gt;97%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Percentage of parts passing quality standards on the first attempt without rework.
          </p>
        </div>

        {/* Inspected Sample Volume */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-400 text-xs block mb-1">Inspected Sample Count</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">
              {totalSamples.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              parts ({totalDefects} rejected)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Automated CMM & manual QA inspector sample audit records.
          </p>
        </div>
      </div>

      {/* Grid: Defect Types Breakdown & Per-Line Defect Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Defect Root Causes Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <span>{t.defectsBreakdown}</span>
          </h3>

          <div className="space-y-3">
            {defectList.map(({ type, count, meta }) => {
              const pct = totalDefects > 0 ? (count / totalDefects) * 100 : 0;
              return (
                <div key={type} className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-sm ${meta.color}`} />
                      <span className="font-semibold text-slate-200">
                        {lang === 'ar' ? meta.ar : meta.en}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {count} pcs ({pct.toFixed(0)}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${meta.color}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Defect Rate by Production Line */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Defect Rate by Production Line</span>
          </h3>

          <div className="space-y-4">
            {lineQuality.map(({ line, samples, defects, rate }) => {
              const isOverThreshold = rate > 3.0;
              return (
                <div key={line.id} className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white">
                      {lang === 'ar' ? line.nameAr : line.name}
                    </span>
                    <span className={`font-mono font-bold ${isOverThreshold ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {rate.toFixed(1)}% {isOverThreshold && '(EXCEEDED)'}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden relative">
                    {/* 3% Threshold vertical tick */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10" 
                      style={{ left: '30%' }} // assuming 10% max scale
                      title="3.0% threshold"
                    />
                    <div 
                      className={`h-2 rounded-full ${isOverThreshold ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, rate * 10)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Defects: <strong className={isOverThreshold ? 'text-rose-400' : 'text-slate-200'}>{defects}</strong> / {samples} sampled</span>
                    <span>Standard Target: &le; 3.0%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quality Check Inspection Audit Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-white">
            {lang === 'ar' ? 'سجل تقارير فحص الجودة والعينات' : 'Quality Inspection Sample Audit Log'}
          </h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by inspector or defect..."
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
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Line</th>
                <th className="py-2.5 px-3">Product SKU</th>
                <th className="py-2.5 px-3 text-right">Sample</th>
                <th className="py-2.5 px-3 text-right">Defects</th>
                <th className="py-2.5 px-3">Defect %</th>
                <th className="py-2.5 px-3">Root Defect Type</th>
                <th className="py-2.5 px-3">Inspector</th>
                <th className="py-2.5 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredChecks.map((qc) => {
                const rate = qc.sampleSize > 0 ? (qc.defectsCount / qc.sampleSize) * 100 : 0;
                return (
                  <tr key={qc.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3">
                      {qc.passed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> FAIL
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(qc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                      {lines.find(l => l.id === qc.lineId)?.code || qc.lineId}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400 whitespace-nowrap">
                      {qc.productId}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-200">
                      {qc.sampleSize}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${qc.defectsCount > 2 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {qc.defectsCount}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        rate > 3.0 ? 'bg-rose-500/20 text-rose-300' : 'text-emerald-400'
                      }`}>
                        {rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 whitespace-nowrap">
                      {lang === 'ar' ? qc.defectTypeAr : qc.defectType}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                      {qc.inspectorName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] italic truncate max-w-[180px]">
                      {qc.notes || '--'}
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
