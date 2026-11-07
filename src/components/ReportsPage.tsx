import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  Building, 
  Layers, 
  Clock,
  X
} from 'lucide-react';
import { 
  ProductionLog, 
  DowntimeEvent, 
  QualityCheck, 
  ProductionLine, 
  Factory, 
  Shift, 
  Language, 
  FilterState 
} from '../types/factory';
import { translations } from '../i18n/translations';

interface ReportsPageProps {
  logs: ProductionLog[];
  downtimeEvents: DowntimeEvent[];
  qualityChecks: QualityCheck[];
  lines: ProductionLine[];
  factories: Factory[];
  shifts: Shift[];
  filters: FilterState;
  lang: Language;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  logs,
  downtimeEvents,
  qualityChecks,
  lines,
  factories,
  shifts,
  filters,
  lang
}) => {
  const t = translations[lang];
  const [reportType, setReportType] = useState<'production' | 'downtime' | 'quality'>('production');
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Totals for summary
  const totalProduced = logs.reduce((acc, l) => acc + l.qtyProduced, 0);
  const totalTarget = logs.reduce((acc, l) => acc + l.qtyTarget, 0) || 1;
  const totalScrap = logs.reduce((acc, l) => acc + l.qtyScrap, 0);
  const totalDowntimeMinutes = downtimeEvents.reduce((acc, d) => acc + d.durationMinutes, 0);
  const totalInspected = qualityChecks.reduce((acc, q) => acc + q.sampleSize, 0);
  const totalDefects = qualityChecks.reduce((acc, q) => acc + q.defectsCount, 0);

  // 1. Export Excel / CSV generator
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'production') {
      headers = ['Timestamp', 'Line Code', 'Product SKU', 'Produced Units', 'Target Units', 'Scrap Units', 'Pacing %', 'Operator', 'Notes'];
      rows = logs.map(l => [
        l.timestamp,
        lines.find(line => line.id === l.lineId)?.code || l.lineId,
        l.productId,
        String(l.qtyProduced),
        String(l.qtyTarget),
        String(l.qtyScrap),
        `${((l.qtyProduced / l.qtyTarget) * 100).toFixed(1)}%`,
        l.loggedBy,
        l.notes || ''
      ]);
    } else if (reportType === 'downtime') {
      headers = ['Start Time', 'Duration (Min)', 'Line', 'Reason Category', 'Root Cause', 'Resolved', 'Supervisor'];
      rows = downtimeEvents.map(d => [
        d.startTime,
        String(d.durationMinutes),
        lines.find(line => line.id === d.lineId)?.code || d.lineId,
        d.reasonCategory,
        d.reasonDetail,
        d.resolved ? 'YES' : 'NO',
        d.loggedBy
      ]);
    } else {
      headers = ['Timestamp', 'Line', 'Product', 'Sample Size', 'Defect Count', 'Defect %', 'Primary Defect', 'Passed', 'Inspector'];
      rows = qualityChecks.map(q => [
        q.timestamp,
        lines.find(line => line.id === q.lineId)?.code || q.lineId,
        q.productId,
        String(q.sampleSize),
        String(q.defectsCount),
        `${((q.defectsCount / q.sampleSize) * 100).toFixed(1)}%`,
        q.defectType,
        q.passed ? 'PASS' : 'FAIL',
        q.inspectorName
      ]);
    }

    // Build CSV with UTF-8 BOM (\uFEFF) so Excel opens Arabic and symbols correctly
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `factory_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <span>{t.navReports}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar' ? 'توليد وتصدير التقارير الصناعية إلى ملفات Excel (CSV) ونماذج PDF رسمية' : 'Generate and export multi-dimensional reports to Excel (CSV) and printable PDF executive briefs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportExcel}</span>
          </button>

          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Report Module Selector Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
        <button
          onClick={() => setReportType('production')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${reportType === 'production' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
        >
          {lang === 'ar' ? 'تقرير الإنتاج والمخرجات' : 'Production Output Report'}
        </button>
        <button
          onClick={() => setReportType('downtime')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${reportType === 'downtime' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
        >
          {lang === 'ar' ? 'تقرير التوقفات والأعطال' : 'Downtime & Stoppage Report'}
        </button>
        <button
          onClick={() => setReportType('quality')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${reportType === 'quality' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
        >
          {lang === 'ar' ? 'تقرير الجودة والهدر' : 'Quality & Scrap Report'}
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400 block text-[10px] uppercase">Total Produced</span>
          <span className="text-lg font-bold text-white">{totalProduced.toLocaleString()} pcs</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400 block text-[10px] uppercase">Total Downtime</span>
          <span className="text-lg font-bold text-rose-400">{(totalDowntimeMinutes / 60).toFixed(1)} hrs</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400 block text-[10px] uppercase">Overall Scrap</span>
          <span className="text-lg font-bold text-amber-400">{totalScrap} pcs</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400 block text-[10px] uppercase">Quality Inspections</span>
          <span className="text-lg font-bold text-emerald-400">{qualityChecks.length} audits</span>
        </div>
      </div>

      {/* Data Table Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span>
            {reportType === 'production' && `Showing ${logs.length} production run records`}
            {reportType === 'downtime' && `Showing ${downtimeEvents.length} breakdown records`}
            {reportType === 'quality' && `Showing ${qualityChecks.length} quality audit records`}
          </span>
          <span className="font-mono text-cyan-400">Live Grid Ready for Export</span>
        </div>

        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/80 sticky top-0 border-b border-slate-800 font-mono">
              {reportType === 'production' && (
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Line</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-right">Produced</th>
                  <th className="py-2.5 px-3 text-right">Target</th>
                  <th className="py-2.5 px-3 text-right">Scrap</th>
                  <th className="py-2.5 px-3">Operator</th>
                </tr>
              )}
              {reportType === 'downtime' && (
                <tr>
                  <th className="py-2.5 px-3">Start Time</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Line</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Root Cause</th>
                  <th className="py-2.5 px-3">Resolved</th>
                </tr>
              )}
              {reportType === 'quality' && (
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Line</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-right">Sample</th>
                  <th className="py-2.5 px-3 text-right">Defects</th>
                  <th className="py-2.5 px-3">Defect Type</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {reportType === 'production' && logs.map(l => (
                <tr key={l.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 text-slate-400">{new Date(l.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2 px-3 font-bold text-white">{lines.find(line => line.id === l.lineId)?.code || l.lineId}</td>
                  <td className="py-2 px-3 text-cyan-400">{l.productId}</td>
                  <td className="py-2 px-3 text-right font-bold text-white">{l.qtyProduced}</td>
                  <td className="py-2 px-3 text-right text-slate-400">{l.qtyTarget}</td>
                  <td className="py-2 px-3 text-right text-rose-400">{l.qtyScrap}</td>
                  <td className="py-2 px-3 text-slate-400">{l.loggedBy}</td>
                </tr>
              ))}
              {reportType === 'downtime' && downtimeEvents.map(d => (
                <tr key={d.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 text-slate-400">{new Date(d.startTime).toLocaleTimeString()}</td>
                  <td className="py-2 px-3 font-bold text-rose-400">{d.durationMinutes} min</td>
                  <td className="py-2 px-3 font-bold text-white">{lines.find(line => line.id === d.lineId)?.code || d.lineId}</td>
                  <td className="py-2 px-3 text-amber-300">{d.reasonCategory}</td>
                  <td className="py-2 px-3 text-slate-300 max-w-xs truncate">{d.reasonDetail}</td>
                  <td className="py-2 px-3">{d.resolved ? 'RESOLVED' : 'ONGOING'}</td>
                </tr>
              ))}
              {reportType === 'quality' && qualityChecks.map(q => (
                <tr key={q.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 text-slate-400">{new Date(q.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2 px-3 font-bold text-white">{lines.find(line => line.id === q.lineId)?.code || q.lineId}</td>
                  <td className="py-2 px-3 text-cyan-400">{q.productId}</td>
                  <td className="py-2 px-3 text-right">{q.sampleSize}</td>
                  <td className="py-2 px-3 text-right font-bold text-rose-400">{q.defectsCount}</td>
                  <td className="py-2 px-3 text-amber-300">{q.defectType}</td>
                  <td className="py-2 px-3 font-bold text-emerald-400">{q.passed ? 'PASS' : 'FAIL'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Printable Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl max-w-3xl w-full p-8 shadow-2xl relative my-8 print:p-0 print:m-0">
            {/* Modal Controls */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Executive Manufacturing PDF Report
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Report Document Body */}
            <div>
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                    FactoryPulse Manufacturing Report
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Cairo Industrial Complex - Production & OEE Follow-up Division
                  </p>
                </div>
                <div className="text-right text-xs font-mono text-slate-600">
                  <div>Report Ref: <strong className="text-slate-900">FP-2026-1107</strong></div>
                  <div>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
                  <div>Audited by: Quality & BI Systems</div>
                </div>
              </div>

              {/* KPI Summary Block */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100 rounded-lg mb-6 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Gross Produced</div>
                  <div className="text-lg font-black text-slate-950">{totalProduced.toLocaleString()} pcs</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total Downtime</div>
                  <div className="text-lg font-black text-rose-700">{(totalDowntimeMinutes / 60).toFixed(1)} hrs</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">OEE Estimated</div>
                  <div className="text-lg font-black text-emerald-700">79.4%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Scrap Rate</div>
                  <div className="text-lg font-black text-amber-700">{((totalScrap / (totalProduced + totalScrap)) * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Mini Table Summary */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase text-slate-700 mb-2">Production Runs Breakdown</h3>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-200 font-mono text-[10px] uppercase text-slate-700">
                    <tr>
                      <th className="p-2 border">Timestamp</th>
                      <th className="p-2 border">Line</th>
                      <th className="p-2 border">Product SKU</th>
                      <th className="p-2 border text-right">Qty Produced</th>
                      <th className="p-2 border text-right">Target</th>
                      <th className="p-2 border text-right">Scrap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                    {logs.slice(0, 6).map(l => (
                      <tr key={l.id}>
                        <td className="p-2 border">{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="p-2 border font-bold">{lines.find(line => line.id === l.lineId)?.code}</td>
                        <td className="p-2 border">{l.productId}</td>
                        <td className="p-2 border text-right font-bold">{l.qtyProduced}</td>
                        <td className="p-2 border text-right">{l.qtyTarget}</td>
                        <td className="p-2 border text-right text-rose-700">{l.qtyScrap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures & Certification */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-slate-300 text-xs">
                <div>
                  <span className="text-slate-500 block mb-4">Operations & Plant Manager Approval:</span>
                  <div className="border-b border-slate-400 w-48 mb-1" />
                  <span className="font-semibold text-slate-900">Eng. Tamer El-Sayed</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block mb-4">Shift QA Supervisor Verification:</span>
                  <div className="border-b border-slate-400 w-48 mb-1 ml-auto" />
                  <span className="font-semibold text-slate-900">Eng. Karim Fouad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
