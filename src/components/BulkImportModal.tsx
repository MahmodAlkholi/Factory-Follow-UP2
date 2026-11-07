import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Copy 
} from 'lucide-react';
import { Language, ProductionLog } from '../types/factory';
import { translations } from '../i18n/translations';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onImportLogs: (logs: Omit<ProductionLog, 'id'>[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  lang,
  onImportLogs
}) => {
  const t = translations[lang];
  const [csvText, setCsvText] = useState(`line_code,product_sku,produced_qty,target_qty,scrap_qty,operator_name
L1-STAMP,SKU-BRK-400,182,180,2,Ahmed Gamal
L1-STAMP,SKU-BRK-400,175,180,3,Ahmed Gamal
L2-WELD,SKU-JBOX-HV,108,110,4,Mahmoud Sayed
L3-ASSY,SKU-PUMP-H7,94,95,1,Tarek Ibrahim
L4-PACK,SKU-FAN-IND8,205,200,2,Hassan Nabil`);

  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    try {
      setParseError(null);
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setParseError('CSV must contain a header line and at least one data row.');
        return;
      }

      const rows: Omit<ProductionLog, 'id'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 6) {
          throw new Error(`Row ${i + 1} has insufficient columns (expected 6, got ${parts.length})`);
        }

        const [lineCode, sku, produced, target, scrap, operator] = parts;
        rows.push({
          factoryId: 'fact-1',
          lineId: lineCode === 'L1-STAMP' ? 'line-1' : lineCode === 'L2-WELD' ? 'line-2' : lineCode === 'L3-ASSY' ? 'line-3' : 'line-4',
          machineId: 'm-101',
          shiftId: 'shift-1',
          productId: sku,
          qtyProduced: parseInt(produced, 10) || 0,
          qtyTarget: parseInt(target, 10) || 100,
          qtyScrap: parseInt(scrap, 10) || 0,
          timestamp: new Date().toISOString(),
          loggedBy: `${operator} (CSV Bulk Import)`,
          notes: 'Batch imported via MES Web Upload'
        });
      }

      setParsedRows(rows);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse CSV format.');
    }
  };

  const handleCommit = () => {
    if (parsedRows.length > 0) {
      onImportLogs(parsedRows);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'استيراد جماعي لبيانات الإنتاج (CSV Bulk Import)' : 'Bulk CSV / Excel Production Import'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'لصق أو رفع ملفات الجداول من خطوط الإنتاج والماسحات الضوئية' : 'Paste comma-separated shift batches directly into the system database.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CSV Input Area */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="text-slate-300 font-medium">CSV Payload (Format: line, sku, produced, target, scrap, operator)</label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(csvText);
                }}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3 h-3" /> Copy Sample
              </button>
            </div>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {parseError && (
            <div className="bg-rose-950/40 border border-rose-600/50 p-2.5 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {parsedRows.length > 0 && (
            <div className="bg-emerald-950/30 border border-emerald-600/40 p-3 rounded-lg text-xs">
              <div className="flex items-center justify-between text-emerald-300 font-bold mb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully validated {parsedRows.length} production rows!
                </span>
                <span className="font-mono">
                  Total Produced: {parsedRows.reduce((a, b) => a + b.qtyProduced, 0)} units
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Ready to commit to database. Logs will be linked with lines and update live OEE calculations.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleParse}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg text-xs border border-slate-700 transition"
            >
              Validate & Parse CSV
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0}
              onClick={handleCommit}
              className={`flex-1 font-bold py-2 rounded-lg text-xs transition ${
                parsedRows.length > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Commit ({parsedRows.length} Rows) to Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
