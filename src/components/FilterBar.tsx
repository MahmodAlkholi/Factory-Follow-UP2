import React from 'react';
import { Filter, Calendar, MapPin, Layers, Clock, RotateCcw } from 'lucide-react';
import { FilterState, Factory, ProductionLine, Shift, Language } from '../types/factory';
import { translations } from '../i18n/translations';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  factories: Factory[];
  lines: ProductionLine[];
  shifts: Shift[];
  lang: Language;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  factories,
  lines,
  shifts,
  lang,
}) => {
  const t = translations[lang];

  const handleReset = () => {
    setFilters({
      dateRange: 'today',
      factoryId: 'all',
      lineId: 'all',
      shiftId: 'all',
    });
  };

  const isFiltered = 
    filters.dateRange !== 'today' || 
    filters.factoryId !== 'all' || 
    filters.lineId !== 'all' || 
    filters.shiftId !== 'all';

  // Filter available lines if a factory is selected
  const availableLines = filters.factoryId === 'all' 
    ? lines 
    : lines.filter(l => l.factoryId === filters.factoryId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.filters}</span>
          {isFiltered && (
            <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-mono border border-amber-500/30">
              Active
            </span>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-start md:justify-end">
          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="today" className="bg-slate-900">{t.today}</option>
              <option value="yesterday" className="bg-slate-900">{t.yesterday}</option>
              <option value="last_7_days" className="bg-slate-900">{t.last7Days}</option>
              <option value="month_to_date" className="bg-slate-900">{t.monthToDate}</option>
            </select>
          </div>

          {/* Factory Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.factoryId}
              onChange={(e) => setFilters(prev => ({ ...prev, factoryId: e.target.value, lineId: 'all' }))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all" className="bg-slate-900">{t.allFactories}</option>
              {factories.map(f => (
                <option key={f.id} value={f.id} className="bg-slate-900">
                  {lang === 'ar' ? f.nameAr : f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Line Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.lineId}
              onChange={(e) => setFilters(prev => ({ ...prev, lineId: e.target.value }))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="all" className="bg-slate-900">{t.allLines}</option>
              {availableLines.map(l => (
                <option key={l.id} value={l.id} className="bg-slate-900">
                  {lang === 'ar' ? l.nameAr : l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shift Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.shiftId}
              onChange={(e) => setFilters(prev => ({ ...prev, shiftId: e.target.value }))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">{t.allShifts}</option>
              {shifts.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900">
                  {lang === 'ar' ? s.nameAr : s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2 py-1.5 rounded border border-rose-800/40 transition"
              title={t.resetFilters}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
