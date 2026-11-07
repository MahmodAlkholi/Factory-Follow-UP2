import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';
import { ThresholdAlert, Language } from '../types/factory';
import { translations } from '../i18n/translations';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: ThresholdAlert[];
  lang: Language;
  onAcknowledgeAlert: (id: string) => void;
  onUpdateThresholds: (thresholds: { defectRate: number; downtimeMinutes: number }) => void;
  currentThresholds: { defectRate: number; downtimeMinutes: number };
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  lang,
  onAcknowledgeAlert,
  onUpdateThresholds,
  currentThresholds
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'alerts' | 'thresholds'>('alerts');
  const [defectLimit, setDefectLimit] = useState(currentThresholds.defectRate);
  const [downtimeLimit, setDowntimeLimit] = useState(currentThresholds.downtimeMinutes);

  if (!isOpen) return null;

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThresholds({
      defectRate: Number(defectLimit),
      downtimeMinutes: Number(downtimeLimit)
    });
    setActiveTab('alerts');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <Bell className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{lang === 'ar' ? 'نظام التنبيهات وحدود الأمان الصناعية' : 'Shop Floor Alert Engine & Thresholds'}</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">
                  CELERY WORKER // 60s
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Automated continuous evaluation via Celery background tasks & SMTP email alerts.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-4 gap-1">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'alerts' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Active Incident Alerts ({alerts.filter(a => !a.acknowledged).length})
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === 'thresholds' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Configure KPI Limits & Email Dispatch
          </button>
        </div>

        {/* Tab 1: Alerts List */}
        {activeTab === 'alerts' && (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No active threshold breaches. All lines operating within specification!
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition ${
                    alert.acknowledged
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : alert.severity === 'critical'
                      ? 'bg-rose-950/30 border-rose-800/60'
                      : 'bg-amber-950/30 border-amber-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded ${alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {alert.severity === 'critical' ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {lang === 'ar' ? alert.ruleNameAr : alert.ruleName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Limit: {alert.thresholdValue} | Actual: {alert.currentValue}
                        </span>
                      </div>
                    </div>

                    {alert.emailSent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
                        <Mail className="w-3 h-3" /> Email Dispatched
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-2 pl-7">
                    {lang === 'ar' ? alert.messageAr : alert.message}
                  </p>

                  <div className="flex justify-end mt-2 pt-2 border-t border-slate-800/80">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1 rounded-md border border-slate-700 transition"
                      >
                        {t.acknowledge}
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged by Supervisor
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Threshold Settings */}
        {activeTab === 'thresholds' && (
          <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-semibold">Maximum Allowed Scrap / Defect Rate</label>
                  <span className="font-mono text-amber-400 font-bold">{defectLimit}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  value={defectLimit}
                  onChange={(e) => setDefectLimit(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Triggers urgent plant supervisor notification when 1-hour QA scrap breaches this limit.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-semibold">Continuous Line Stoppage Limit</label>
                  <span className="font-mono text-rose-400 font-bold">{downtimeLimit} minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={downtimeLimit}
                  onChange={(e) => setDowntimeLimit(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Automated escalation email dispatched when machine stoppage timer exceeds this duration.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <label className="text-slate-300 font-semibold block mb-1">Escalation Recipient Group</label>
                <input
                  type="text"
                  disabled
                  value="operations@factorypulse.com, plant.supervisors@factorypulse.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-400 font-mono text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs shadow transition"
            >
              Save Threshold Rules & Update Celery Beat
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
