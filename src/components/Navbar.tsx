import React, { useState, useEffect } from 'react';
import { 
  Factory as FactoryIcon, 
  Globe, 
  ShieldCheck, 
  Bell, 
  RotateCw, 
  Cpu, 
  PlusCircle, 
  Upload, 
  Code2, 
  LayoutDashboard, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Boxes, 
  FileSpreadsheet,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { UserRole, Language, ThresholdAlert } from '../types/factory';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  autoRefreshInterval: number; // 0, 30, 60
  setAutoRefreshInterval: (interval: number) => void;
  activeAlerts: ThresholdAlert[];
  onOpenDataEntry: () => void;
  onOpenBulkImport: () => void;
  onOpenIoTPanel: () => void;
  onOpenAlerts: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  role,
  setRole,
  lang,
  setLang,
  autoRefreshInterval,
  setAutoRefreshInterval,
  activeAlerts,
  onOpenDataEntry,
  onOpenBulkImport,
  onOpenIoTPanel,
  onOpenAlerts,
  onManualRefresh,
  isRefreshing
}) => {
  const t = translations[lang];
  const [secondsRemaining, setSecondsRemaining] = useState<number>(autoRefreshInterval);

  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    setSecondsRemaining(autoRefreshInterval);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          onManualRefresh();
          return autoRefreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, onManualRefresh]);

  const navItems = [
    { id: 'overview', label: t.navOverview, icon: LayoutDashboard },
    { id: 'production', label: t.navProduction, icon: TrendingUp },
    { id: 'downtime', label: t.navDowntime, icon: Clock },
    { id: 'quality', label: t.navQuality, icon: CheckCircle2 },
    { id: 'inventory', label: t.navInventory, icon: Boxes },
    { id: 'reports', label: t.navReports, icon: FileSpreadsheet },
    { id: 'catalog', label: t.navCatalog, icon: BookOpen, highlight: true },
    { id: 'django', label: t.navDjangoExplorer, icon: Code2, highlight: true },
  ];

  const unacknowledgedAlerts = activeAlerts.filter(a => !a.acknowledged);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Telemetry & Role Status Bar */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-semibold tracking-wider text-emerald-400 uppercase">
              SYS::ONLINE // MES-GW-01
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline font-mono">
            HOST: 10.240.1.18 [OPC-UA ACTIVE]
          </span>
        </div>

        {/* Quick action badges & Role indicator */}
        <div className="flex items-center gap-3">
          {/* Role selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded px-2 py-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 hidden sm:inline">{t.currentRole}:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="admin" className="bg-slate-900 text-slate-100">{t.roleAdmin}</option>
              <option value="manager" className="bg-slate-900 text-slate-100">{t.roleManager}</option>
              <option value="supervisor" className="bg-slate-900 text-slate-100">{t.roleSupervisor}</option>
              <option value="operator" className="bg-slate-900 text-slate-100">{t.roleOperator}</option>
            </select>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded transition font-medium border border-slate-700"
            title="Toggle Arabic / English RTL"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Logo and branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('overview')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
            <FactoryIcon className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                {t.appTitle}
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-mono border border-amber-500/30">
                  DJANGO 5
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Shop Floor Entry Button (Visible for all, primary for Operator & Supervisor) */}
          <button
            onClick={onOpenDataEntry}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md shadow-emerald-900/30 transition transform active:scale-95 border border-emerald-500/30"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span className="hidden md:inline">{t.logProduction}</span>
            <span className="md:hidden">{t.navDataEntry}</span>
          </button>

          {/* CSV Bulk Import */}
          {role !== 'operator' && (
            <button
              onClick={onOpenBulkImport}
              className="hidden lg:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              title={t.bulkImport}
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.bulkImport}</span>
            </button>
          )}

          {/* IoT Telemetry Simulator */}
          <button
            onClick={onOpenIoTPanel}
            className="flex items-center gap-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-cyan-700/50 transition"
            title={t.simulateIot}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.simulateIot}</span>
          </button>

          {/* Alerts Trigger with Badge */}
          <button
            onClick={onOpenAlerts}
            className="relative p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title={t.viewAlerts}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unacknowledgedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse shadow">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </button>

          {/* Auto Refresh Toggle & Indicator */}
          <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={onManualRefresh}
              className={`p-1.5 rounded hover:bg-slate-700 text-slate-300 transition ${isRefreshing ? 'animate-spin text-amber-400' : ''}`}
              title={t.refreshNow}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <div className="px-1.5 py-0.5 text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900">Auto: OFF</option>
                <option value={30} className="bg-slate-900">Auto: 30s</option>
                <option value={60} className="bg-slate-900">Auto: 60s</option>
              </select>
              {autoRefreshInterval > 0 && (
                <span className="text-amber-400 font-mono font-bold">
                  ({secondsRemaining}s)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Tab Navigation Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800/70 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : item.highlight
                    ? 'text-cyan-400 hover:bg-cyan-950/40 border border-cyan-800/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
