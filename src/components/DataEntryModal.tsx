import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Boxes, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { 
  ProductionLine, 
  Machine, 
  Shift, 
  Product, 
  InventoryItem, 
  DowntimeCategory, 
  DefectType, 
  StockMovementType, 
  Language, 
  ProductionLog, 
  DowntimeEvent, 
  QualityCheck, 
  StockMovement 
} from '../types/factory';
import { translations } from '../i18n/translations';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lines: ProductionLine[];
  machines: Machine[];
  shifts: Shift[];
  products: Product[];
  inventoryItems: InventoryItem[];
  lang: Language;
  onAddProductionLog: (log: Omit<ProductionLog, 'id'>) => void;
  onAddDowntimeEvent: (dt: Omit<DowntimeEvent, 'id'>) => void;
  onAddQualityCheck: (qc: Omit<QualityCheck, 'id'>) => void;
  onAddStockMovement: (sm: Omit<StockMovement, 'id'>) => void;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({
  isOpen,
  onClose,
  lines,
  machines,
  shifts,
  products,
  inventoryItems,
  lang,
  onAddProductionLog,
  onAddDowntimeEvent,
  onAddQualityCheck,
  onAddStockMovement
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'production' | 'downtime' | 'quality' | 'stock'>('production');

  // Form states
  const [prodLineId, setProdLineId] = useState(lines[0]?.id || '');
  const [prodMachineId, setProdMachineId] = useState(machines[0]?.id || '');
  const [prodShiftId, setProdShiftId] = useState(shifts[0]?.id || '');
  const [prodProductId, setProdProductId] = useState(products[0]?.sku || '');
  const [qtyProduced, setQtyProduced] = useState(120);
  const [qtyTarget, setQtyTarget] = useState(150);
  const [qtyScrap, setQtyScrap] = useState(2);
  const [operatorName, setOperatorName] = useState('Ahmed Gamal (Operator)');
  const [prodNotes, setProdNotes] = useState('');

  // Downtime form states
  const [dtMachineId, setDtMachineId] = useState(machines[0]?.id || '');
  const [dtCategory, setDtCategory] = useState<DowntimeCategory>('MECHANICAL');
  const [dtDuration, setDtDuration] = useState(25);
  const [dtDetail, setDtDetail] = useState('');

  // Quality check states
  const [qcLineId, setQcLineId] = useState(lines[0]?.id || '');
  const [qcProduct, setQcProduct] = useState(products[0]?.sku || '');
  const [qcSampleSize, setQcSampleSize] = useState(50);
  const [qcDefects, setQcDefects] = useState(1);
  const [qcDefectType, setQcDefectType] = useState<DefectType>('SURFACE_SCRATCH');
  const [inspectorName, setInspectorName] = useState('Eng. Karim Fouad');

  // Stock movement states
  const [smItemId, setSmItemId] = useState(inventoryItems[0]?.id || '');
  const [smType, setSmType] = useState<StockMovementType>('IN');
  const [smQty, setSmQty] = useState(10);
  const [smRefDoc, setSmRefDoc] = useState('GRN-2026-9001');

  if (!isOpen) return null;

  const handleSubmitProduction = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProductionLog({
      factoryId: lines.find(l => l.id === prodLineId)?.factoryId || 'fact-1',
      lineId: prodLineId,
      machineId: prodMachineId,
      shiftId: prodShiftId,
      productId: prodProductId,
      qtyProduced: Number(qtyProduced),
      qtyTarget: Number(qtyTarget),
      qtyScrap: Number(qtyScrap),
      timestamp: new Date().toISOString(),
      loggedBy: operatorName,
      notes: prodNotes
    });
    onClose();
  };

  const handleSubmitDowntime = (e: React.FormEvent) => {
    e.preventDefault();
    const machine = machines.find(m => m.id === dtMachineId);
    onAddDowntimeEvent({
      machineId: dtMachineId,
      lineId: machine?.lineId || lines[0]?.id || 'line-1',
      shiftId: shifts[0]?.id || 'shift-1',
      startTime: new Date().toISOString(),
      durationMinutes: Number(dtDuration),
      reasonCategory: dtCategory,
      reasonDetail: dtDetail || 'Reported breakdown on shop floor',
      reasonDetailAr: dtDetail || 'عطل مسجل على خط الإنتاج',
      resolved: false,
      loggedBy: operatorName
    });
    onClose();
  };

  const handleSubmitQuality = (e: React.FormEvent) => {
    e.preventDefault();
    const defectRate = (Number(qcDefects) / Number(qcSampleSize)) * 100;
    onAddQualityCheck({
      lineId: qcLineId,
      productId: qcProduct,
      shiftId: shifts[0]?.id || 'shift-1',
      sampleSize: Number(qcSampleSize),
      defectsCount: Number(qcDefects),
      defectType: qcDefectType,
      defectTypeAr: qcDefectType,
      inspectorName: inspectorName,
      timestamp: new Date().toISOString(),
      passed: defectRate <= 3.0,
      notes: defectRate > 3.0 ? 'Triggered quality alert (>3% defect rate)' : 'Within tolerances'
    });
    onClose();
  };

  const handleSubmitStock = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStockMovement({
      inventoryItemId: smItemId,
      movementType: smType,
      quantity: Number(smQty),
      timestamp: new Date().toISOString(),
      referenceDoc: smRefDoc,
      performedBy: operatorName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'تسجيل بيانات الوردية (Shop Floor Data Entry)' : 'Shop Floor Quick Data Entry'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'واجهة مخصصة لمشغلي ومفتشي الخطوط على أجهزة التابلت' : 'Optimized touch interface for operators, technicians & inspectors.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-5 gap-1">
          <button
            onClick={() => setActiveTab('production')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'production' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Production
          </button>
          <button
            onClick={() => setActiveTab('downtime')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'downtime' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Downtime
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'quality' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Quality
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'stock' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Inventory
          </button>
        </div>

        {/* Tab 1: Production Form */}
        {activeTab === 'production' && (
          <form onSubmit={handleSubmitProduction} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">{t.productionLine}</label>
                <select
                  value={prodLineId}
                  onChange={(e) => setProdLineId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {lines.map(l => (
                    <option key={l.id} value={l.id}>{lang === 'ar' ? l.nameAr : l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{t.product}</label>
                <select
                  value={prodProductId}
                  onChange={(e) => setProdProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.sku}>{p.sku} - {p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Produced (Good)</label>
                <input
                  type="number"
                  value={qtyProduced}
                  onChange={(e) => setQtyProduced(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-emerald-400 font-bold text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Qty</label>
                <input
                  type="number"
                  value={qtyTarget}
                  onChange={(e) => setQtyTarget(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-slate-200 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Scrap / Reject</label>
                <input
                  type="number"
                  value={qtyScrap}
                  onChange={(e) => setQtyScrap(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-rose-400 font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t.operatorName}</label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t.notes}</label>
              <input
                type="text"
                placeholder="Optional shift notes..."
                value={prodNotes}
                onChange={(e) => setProdNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg shadow mt-2 transition"
            >
              {t.save}
            </button>
          </form>
        )}

        {/* Tab 2: Downtime Form */}
        {activeTab === 'downtime' && (
          <form onSubmit={handleSubmitDowntime} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">{t.machine}</label>
                <select
                  value={dtMachineId}
                  onChange={(e) => setDtMachineId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{t.reasonCategory}</label>
                <select
                  value={dtCategory}
                  onChange={(e) => setDtCategory(e.target.value as DowntimeCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="MECHANICAL">Mechanical Failure</option>
                  <option value="ELECTRICAL">Electrical / Sensors</option>
                  <option value="MATERIAL_SHORTAGE">Material Shortage</option>
                  <option value="CHANGEOVER">Setup & Changeover</option>
                  <option value="OPERATOR_ERROR">Operator Adjustment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Estimated Duration (Minutes)</label>
              <input
                type="number"
                value={dtDuration}
                onChange={(e) => setDtDuration(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-rose-400 font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Root Cause & Action Taken</label>
              <textarea
                rows={3}
                placeholder="Describe fault, sensor code, or corrective action..."
                value={dtDetail}
                onChange={(e) => setDtDetail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-lg shadow mt-2 transition"
            >
              Report Breakdown & Trigger Alert
            </button>
          </form>
        )}

        {/* Tab 3: Quality Check Form */}
        {activeTab === 'quality' && (
          <form onSubmit={handleSubmitQuality} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">{t.productionLine}</label>
                <select
                  value={qcLineId}
                  onChange={(e) => setQcLineId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {lines.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{t.product}</label>
                <select
                  value={qcProduct}
                  onChange={(e) => setQcProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.sku}>{p.sku}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Sample Size (Audit Units)</label>
                <input
                  type="number"
                  value={qcSampleSize}
                  onChange={(e) => setQcSampleSize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Defects Count</label>
                <input
                  type="number"
                  value={qcDefects}
                  onChange={(e) => setQcDefects(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-rose-400 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Defect Classification</label>
              <select
                value={qcDefectType}
                onChange={(e) => setQcDefectType(e.target.value as DefectType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="WELD_POROSITY">Weld Porosity / Incomplete Penetration</option>
                <option value="DIMENSIONAL">Dimensional Out-of-Spec</option>
                <option value="SURFACE_SCRATCH">Surface Scratch / Dent</option>
                <option value="SEAL_FAILURE">Seal Failure / Leakage</option>
                <option value="PACKAGING_DEFECT">Packaging Defect</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t.inspector}</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg shadow mt-2 transition"
            >
              Save Quality Inspection Audit
            </button>
          </form>
        )}

        {/* Tab 4: Stock Movement Form */}
        {activeTab === 'stock' && (
          <form onSubmit={handleSubmitStock} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Item SKU</label>
                <select
                  value={smItemId}
                  onChange={(e) => setSmItemId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {inventoryItems.map(i => (
                    <option key={i.id} value={i.id}>{i.sku} - {i.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Movement Type</label>
                <select
                  value={smType}
                  onChange={(e) => setSmType(e.target.value as StockMovementType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="IN">STOCK IN (Receipt)</option>
                  <option value="OUT">STOCK OUT (Issue to Line)</option>
                  <option value="SCRAP">SCRAP WRITEOFF</option>
                  <option value="ADJUSTMENT">CYCLE COUNT ADJUSTMENT</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Quantity</label>
                <input
                  type="number"
                  value={smQty}
                  onChange={(e) => setSmQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Reference Document / PO</label>
                <input
                  type="text"
                  value={smRefDoc}
                  onChange={(e) => setSmRefDoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg shadow mt-2 transition"
            >
              Post Warehouse Ledger Movement
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
