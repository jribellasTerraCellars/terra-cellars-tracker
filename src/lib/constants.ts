import type {
  AssetStatus,
  AssetType,
  BackupFrequency,
  BackupLastStatus,
  BackupType,
  EmploymentStatus,
  MapPinType,
  SupplierCategory,
  TicketPriority,
  TicketStatus,
  TicketType,
} from '../types/database'

export const STATUS_LABELS: Record<TicketStatus, string> = {
  pendent: 'Pendent',
  en_curs: 'En curs',
  bloquejat: 'Bloquejat',
  fet: 'Fet',
  cancelat: 'Cancel·lat',
}

export const STATUS_ORDER: TicketStatus[] = ['pendent', 'en_curs', 'bloquejat', 'fet', 'cancelat']

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  baixa: 'Baixa',
  mitjana: 'Mitjana',
  alta: 'Alta',
  urgent: 'Urgent',
}

export const PRIORITY_STYLES: Record<TicketPriority, string> = {
  baixa: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  mitjana: 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]',
  alta: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  urgent: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
}

export const TYPE_LABELS: Record<TicketType, string> = {
  tasca: 'Tasca',
  incidencia: 'Incidència',
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  servidor: 'Servidor',
  pc: 'PC / portàtil',
  impressora: 'Impressora',
  nvr: 'NVR',
  switch: 'Switch',
  router: 'Router',
  punt_acces: 'Punt d\'accés',
  firewall: 'Firewall',
  altres: 'Altres',
}

export const ASSET_TYPE_ORDER: AssetType[] = [
  'servidor',
  'pc',
  'impressora',
  'nvr',
  'switch',
  'router',
  'punt_acces',
  'firewall',
  'altres',
]

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  actiu: 'Actiu',
  en_reparacio: 'En reparació',
  de_baixa: 'De baixa',
  en_estoc: 'En estoc',
}

export const ASSET_STATUS_ORDER: AssetStatus[] = ['actiu', 'en_reparacio', 'de_baixa', 'en_estoc']

export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  actiu: 'Actiu',
  baixa: 'Baixa',
  alta_en_proces: "Alta en procés",
  baixa_en_proces: 'Baixa en procés',
}

export const EMPLOYMENT_STATUS_ORDER: EmploymentStatus[] = ['actiu', 'alta_en_proces', 'baixa_en_proces', 'baixa']

export const BACKUP_FREQUENCY_LABELS: Record<BackupFrequency, string> = {
  diaria: 'Diària',
  setmanal: 'Setmanal',
  mensual: 'Mensual',
}

export const BACKUP_TYPE_LABELS: Record<BackupType, string> = {
  complet: 'Complet',
  incremental: 'Incremental',
}

export const BACKUP_STATUS_LABELS: Record<BackupLastStatus, string> = {
  exit: 'Èxit',
  error: 'Error',
  pendent: 'Pendent de verificar',
}

export const BACKUP_STATUS_STYLES: Record<BackupLastStatus, string> = {
  exit: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  error: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  pendent: 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]',
}

export const SUPPLIER_CATEGORY_LABELS: Record<SupplierCategory, string> = {
  isp: 'Internet (ISP)',
  manteniment_hardware: 'Manteniment hardware',
  software: 'Software',
  neteja: 'Neteja',
  seguretat: 'Seguretat',
  altres: 'Altres',
}

export const SUPPLIER_CATEGORY_ORDER: SupplierCategory[] = [
  'isp',
  'manteniment_hardware',
  'software',
  'neteja',
  'seguretat',
  'altres',
]

export const PIN_TYPE_LABELS: Record<MapPinType, string> = {
  camera: 'Càmera',
  switch: 'Switch',
  rack: 'Rack',
  ethernet: 'Presa Ethernet',
  wifi: 'Punt WiFi',
  taula: 'Taula',
  isp: 'Proveïdor ISP',
  cablejat: 'Cablejat',
  altres: 'Altres',
}

export const PIN_TYPE_ORDER: MapPinType[] = [
  'camera',
  'switch',
  'rack',
  'ethernet',
  'wifi',
  'taula',
  'isp',
  'cablejat',
  'altres',
]

export const PIN_TYPE_SHORT: Record<MapPinType, string> = {
  camera: 'C',
  switch: 'S',
  rack: 'R',
  ethernet: 'E',
  wifi: 'W',
  taula: 'T',
  isp: 'I',
  cablejat: 'X',
  altres: 'A',
}

export const PIN_TYPE_COLORS: Record<MapPinType, string> = {
  camera: '#B3261E',
  switch: '#2563A6',
  rack: '#5C1F2E',
  ethernet: '#2F7D4F',
  wifi: '#B7791F',
  taula: '#656D76',
  isp: '#2F6F5E',
  cablejat: '#2B3A45',
  altres: '#8A8F98',
}
