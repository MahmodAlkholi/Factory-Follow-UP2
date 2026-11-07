import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PlusCircle, 
  Search, 
  Archive, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { 
  InventoryItem, 
  StockMovement, 
  Language, 
  StockMovementType 
} from '../types/factory';
import { translations } from '../i18n/translations';

interface InventoryPageProps {
  inventoryItems: InventoryItem[];
  stockMovements: StockMovement[];
  lang: Language;
  onOpenLogMovement: () => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  inventoryItems,
  stockMovements,
  lang,
  onOpenLogMovement
}) => {
  const t = translations[lang];
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const lowStockItems = inventoryItems.filter(i => i.currentStock < i.minStock);

  const filteredItems = inventoryItems.filter(item => {
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationBin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const movementTypeBadge = (type: StockMovementType) => {
    switch (type) {
      case 'IN':
        return { label: 'STOCK IN', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: ArrowDownLeft };
      case 'OUT':
        return { label: 'STOCK OUT', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: ArrowUpRight };
      case 'SCRAP':
        return { label: 'SCRAP', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30', icon: AlertTriangle };
      case 'ADJUSTMENT':
        return { label: 'AUDIT ADJ', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: CheckCircle2 };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            <span>{t.navInventory}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar' ? 'متابعة أرصدة المواد الخام وقطع الغيار والتنبيه عند انخفاض مخزون الأمان' : 'Track stock levels against safety minimums and review warehouse transaction logs.'}
          </p>
        </div>

        <button
          onClick={onOpenLogMovement}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'تسجيل حركة مخزون' : 'Log Stock Movement'}</span>
        </button>
      </div>

      {/* Critical Stock Warning Banner (if any) */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-amber-200">
                {lang === 'ar' ? 'تحذير نقص مخزون الأمان (Low Stock Alert):' : 'Safety Stock Level Warning:'}
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {lowStockItems.length} {lang === 'ar' ? 'عناصر هبطت دون الحد الأدنى الآمن للتشغيل' : 'materials currently below minimum buffer limits.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="text-[11px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                {item.sku} ({item.currentStock} {item.unit})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'RAW_MATERIAL', 'WIP', 'FINISHED_GOODS', 'SPARE_PART'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Inventory' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search material, SKU, or bin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Inventory Items Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isLow = item.currentStock < item.minStock;
          const capacityPct = Math.min(100, (item.currentStock / item.maxStock) * 100);
          const minMarkerPct = (item.minStock / item.maxStock) * 100;

          return (
            <div 
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                isLow 
                  ? 'bg-amber-950/20 border-amber-600/50' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{item.sku}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                      {item.locationBin}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">
                    {lang === 'ar' ? item.nameAr : item.name}
                  </h3>
                </div>
                {isLow && (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse">
                    LOW STOCK
                  </span>
                )}
              </div>

              {/* Current Stock Number */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className={`text-2xl font-black font-mono tracking-tight ${isLow ? 'text-rose-400' : 'text-white'}`}>
                  {item.currentStock.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lang === 'ar' ? item.unitAr : item.unit}
                </span>
              </div>

              {/* Min/Max Gauge bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Min: <strong className="text-rose-400">{item.minStock}</strong></span>
                  <span>Max Cap: {item.maxStock}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 relative overflow-hidden">
                  {/* Safety min tick line */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10"
                    style={{ left: `${minMarkerPct}%` }}
                    title="Minimum Safety Level"
                  />
                  <div 
                    className={`h-2 rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Movements Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>{t.stockMovements}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Item SKU</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3">Reference / Order</th>
                <th className="py-2.5 px-3">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {stockMovements.map((mov) => {
                const badge = movementTypeBadge(mov.movementType);
                const item = inventoryItems.find(i => i.id === mov.inventoryItemId);
                const Icon = badge.icon;
                return (
                  <tr key={mov.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                      {item?.sku || mov.inventoryItemId}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-white whitespace-nowrap">
                      {mov.movementType === 'OUT' || mov.movementType === 'SCRAP' ? `-${mov.quantity}` : `+${mov.quantity}`} {item?.unit}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400 whitespace-nowrap">
                      {mov.referenceDoc}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">
                      {mov.performedBy}
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
