export type UserRole = 'admin' | 'manager' | 'supervisor' | 'operator';

export type Language = 'en' | 'ar';

export type DowntimeCategory = 
  | 'MECHANICAL' 
  | 'ELECTRICAL' 
  | 'MATERIAL_SHORTAGE' 
  | 'CHANGEOVER' 
  | 'OPERATOR_ERROR' 
  | 'PLANNED_MAINTENANCE';

export type DefectType = 
  | 'DIMENSIONAL' 
  | 'SURFACE_SCRATCH' 
  | 'WELD_POROSITY' 
  | 'SEAL_FAILURE' 
  | 'MISSING_PART' 
  | 'PACKAGING_DEFECT';

export type StockMovementType = 'IN' | 'OUT' | 'SCRAP' | 'ADJUSTMENT';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Factory {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  code: string;
}

export interface ProductionLine {
  id: string;
  factoryId: string;
  name: string;
  nameAr: string;
  code: string;
  status: 'running' | 'idle' | 'stopped' | 'maintenance';
  targetHourly: number;
}

export interface Machine {
  id: string;
  lineId: string;
  name: string;
  nameAr: string;
  code: string;
  status: 'running' | 'idle' | 'stopped' | 'maintenance';
  lastPing: string;
  temperature?: number; // °C
  vibration?: number; // mm/s
  rpm?: number;
}

export interface Shift {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  startTime: string; // "06:00"
  endTime: string;   // "14:00"
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameAr: string;
  category: string;
  unit: string;
  targetCycleTimeSeconds: number; // e.g. 12 seconds per piece
}

export interface ProductionLog {
  id: string;
  factoryId: string;
  lineId: string;
  machineId: string;
  shiftId: string;
  productId: string;
  qtyProduced: number;
  qtyTarget: number;
  qtyScrap: number;
  timestamp: string; // ISO format
  loggedBy: string;
  notes?: string;
}

export interface DowntimeEvent {
  id: string;
  machineId: string;
  lineId: string;
  shiftId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  reasonCategory: DowntimeCategory;
  reasonDetail: string;
  reasonDetailAr: string;
  resolved: boolean;
  loggedBy: string;
}

export interface QualityCheck {
  id: string;
  lineId: string;
  productId: string;
  shiftId: string;
  sampleSize: number;
  defectsCount: number;
  defectType: DefectType;
  defectTypeAr: string;
  inspectorName: string;
  timestamp: string;
  passed: boolean;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  factoryId: string;
  sku: string;
  name: string;
  nameAr: string;
  category: 'RAW_MATERIAL' | 'WIP' | 'FINISHED_GOODS' | 'SPARE_PART';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitAr: string;
  locationBin: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  movementType: StockMovementType;
  quantity: number;
  timestamp: string;
  referenceDoc: string;
  performedBy: string;
}

export interface ThresholdAlert {
  id: string;
  ruleName: string;
  ruleNameAr: string;
  metric: 'defect_rate' | 'line_downtime' | 'oee_drop' | 'low_stock';
  thresholdValue: number;
  currentValue: number;
  severity: AlertSeverity;
  factoryId?: string;
  lineId?: string;
  message: string;
  messageAr: string;
  timestamp: string;
  acknowledged: boolean;
  emailSent: boolean;
}

export interface FilterState {
  dateRange: 'today' | 'yesterday' | 'last_7_days' | 'month_to_date' | 'custom';
  startDate?: string;
  endDate?: string;
  factoryId: string; // 'all' or id
  lineId: string;    // 'all' or id
  shiftId: string;   // 'all' or id
}

export interface OEEBreakdown {
  availability: number; // e.g. 88.5%
  performance: number;  // e.g. 92.1%
  quality: number;      // e.g. 97.4%
  oee: number;          // availability * performance * quality
}
