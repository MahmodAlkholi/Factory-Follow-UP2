import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Send, 
  CheckCircle2, 
  Zap, 
  Activity, 
  Key, 
  Terminal, 
  RotateCw 
} from 'lucide-react';
import { Machine, Language } from '../types/factory';
import { translations } from '../i18n/translations';

interface IoTTelemetryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  machines: Machine[];
  lang: Language;
  onSimulateTelemetry: (payload: {
    machineCode: string;
    producedIncrement: number;
    scrapIncrement: number;
    status: 'running' | 'stopped' | 'idle';
    temperature: number;
    vibration: number;
  }) => void;
}

export const IoTTelemetryPanel: React.FC<IoTTelemetryPanelProps> = ({
  isOpen,
  onClose,
  machines,
  lang,
  onSimulateTelemetry
}) => {
  const t = translations[lang];
  const [selectedMachine, setSelectedMachine] = useState(machines[0]?.code || 'HP-500');
  const [statusVal, setStatusVal] = useState<'running' | 'stopped' | 'idle'>('running');
  const [producedInc, setProducedInc] = useState(5);
  const [scrapInc, setScrapInc] = useState(0);
  const [tempVal, setTempVal] = useState(64.5);
  const [vibVal, setVibVal] = useState(2.3);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPayload = {
    machine_code: selectedMachine,
    status: statusVal,
    produced_count_increment: producedInc,
    scrap_count_increment: scrapInc,
    temperature_c: tempVal,
    vibration_rms: vibVal,
    rpm: statusVal === 'running' ? 1200 : 0,
    shift_code: 'SHIFT-A',
    protocol: 'Modbus_TCP_Port_502'
  };

  const handleTransmit = () => {
    onSimulateTelemetry({
      machineCode: selectedMachine,
      producedIncrement: producedInc,
      scrapIncrement: scrapInc,
      status: statusVal,
      temperature: tempVal,
      vibration: vibVal
    });

    setLastResponse(JSON.stringify({
      status: 'success',
      endpoint: '/api/v1/telemetry/ingest/',
      auth: 'HTTP 200 TokenAuthentication Verified',
      machine: selectedMachine,
      machine_state: statusVal,
      oee_updated: true,
      timestamp: new Date().toISOString()
    }, null, 2));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>PLC / IoT Field Telemetry Ingest Simulator</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono border border-cyan-500/30">
                  DRF TOKEN AUTH
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Simulates real-world Modbus TCP / OPC-UA gateway packets pushing into Django REST API.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Endpoint & Token Header preview */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono mb-4 text-slate-300">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-bold">POST /api/v1/telemetry/ingest/</span>
          </div>
          <div className="text-slate-400 text-[11px] flex items-center gap-2">
            <Key className="w-3 h-3 text-amber-400" />
            <span>Authorization: Token 9a8f4c718e2b90d34fa12...</span>
          </div>
        </div>

        {/* Interactive parameter controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
          <div>
            <label className="block text-slate-400 mb-1">Target Machine Asset</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
            >
              {machines.map(m => (
                <option key={m.id} value={m.code}>{m.code} - {m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Operational Status</label>
            <select
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
            >
              <option value="running">running (Normal)</option>
              <option value="stopped">stopped (Breakdown!)</option>
              <option value="idle">idle (Starved / Blocked)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Units Increment (+)</label>
            <input
              type="number"
              value={producedInc}
              onChange={(e) => setProducedInc(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Scrap Count (+)</label>
            <input
              type="number"
              value={scrapInc}
              onChange={(e) => setScrapInc(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-rose-400 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Bearing Temp (°C)</label>
            <input
              type="number"
              step="0.5"
              value={tempVal}
              onChange={(e) => setTempVal(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Vibration (mm/s)</label>
            <input
              type="number"
              step="0.1"
              value={vibVal}
              onChange={(e) => setVibVal(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Live Payload Preview */}
        <div className="mb-4">
          <label className="block text-[11px] font-mono text-slate-400 mb-1">Transmitted JSON Payload</label>
          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-300 max-h-24 overflow-y-auto">
            {JSON.stringify(currentPayload, null, 2)}
          </pre>
        </div>

        {/* Server Response (if transmitted) */}
        {lastResponse && (
          <div className="mb-4">
            <label className="block text-[11px] font-mono text-emerald-400 mb-1">Django Server 200 OK Response</label>
            <pre className="bg-slate-950 border border-emerald-900/50 rounded-lg p-2.5 text-[10px] font-mono text-emerald-300 max-h-24 overflow-y-auto">
              {lastResponse}
            </pre>
          </div>
        )}

        <button
          onClick={handleTransmit}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-lg text-xs shadow-lg transition"
        >
          <Send className="w-4 h-4" />
          <span>Fire Telemetry Ingest Packet</span>
        </button>
      </div>
    </div>
  );
};
