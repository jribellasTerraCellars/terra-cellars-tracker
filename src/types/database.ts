export type TicketType = 'tasca' | 'incidencia'
export type TicketPriority = 'baixa' | 'mitjana' | 'alta' | 'urgent'
export type TicketStatus = 'pendent' | 'en_curs' | 'bloquejat' | 'fet' | 'cancelat'
export type ProfileRole = 'admin' | 'tecnic'
export type EmploymentStatus = 'actiu' | 'baixa' | 'alta_en_proces' | 'baixa_en_proces'
export type AssetType =
  | 'servidor'
  | 'pc'
  | 'impressora'
  | 'nvr'
  | 'switch'
  | 'router'
  | 'punt_acces'
  | 'firewall'
  | 'altres'
export type AssetStatus = 'actiu' | 'en_reparacio' | 'de_baixa' | 'en_estoc'
export type BackupFrequency = 'diaria' | 'setmanal' | 'mensual'
export type BackupType = 'complet' | 'incremental'
export type BackupLastStatus = 'exit' | 'error' | 'pendent'
export type SupplierCategory = 'isp' | 'manteniment_hardware' | 'software' | 'neteja' | 'seguretat' | 'altres'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: ProfileRole
  active: boolean
  created_at: string
}

export interface Requester {
  id: string
  name: string
  department: string | null
  active: boolean
  position: string | null
  ad_username: string | null
  start_date: string | null
  end_date: string | null
  employment_status: EmploymentStatus
  created_at: string
}

export interface Category {
  id: string
  name: string
  color: string
  description: string | null
}

export interface Asset {
  id: string
  name: string
  type: AssetType
  brand: string | null
  model: string | null
  serial_number: string | null
  location: string | null
  status: AssetStatus
  ip_address: string | null
  vlan: string | null
  purchase_date: string | null
  warranty_until: string | null
  assigned_to: string | null
  notes: string | null
  created_at: string
}

export interface AssetWithRelations extends Asset {
  assignee: Requester | null
}

export interface BackupJob {
  id: string
  name: string
  asset_id: string | null
  frequency: BackupFrequency
  backup_type: BackupType
  destination: string | null
  last_success_at: string | null
  last_status: BackupLastStatus
  retention_notes: string | null
  responsible: string | null
  created_at: string
}

export interface BackupJobWithRelations extends BackupJob {
  asset: Asset | null
  responsible_requester: Requester | null
}

export interface Supplier {
  id: string
  name: string
  category: SupplierCategory
  contact_name: string | null
  phone: string | null
  email: string | null
  contract_start: string | null
  contract_end: string | null
  renewal_notice_days: number | null
  notes: string | null
  created_at: string
}

export interface Ticket {
  id: string
  title: string
  description: string | null
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  category_id: string | null
  requester_id: string | null
  assigned_to: string | null
  asset_id: string | null
  supplier_id: string | null
  backup_job_id: string | null
  due_date: string | null
  planned_date: string | null
  estimated_minutes: number | null
  actual_minutes: number | null
  created_by: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface TicketSubtask {
  id: string
  ticket_id: string
  title: string
  is_done: boolean
  position: number
  created_at: string
}

export interface TicketWithRelations extends Ticket {
  category: Category | null
  requester: Requester | null
  assignee: Profile | null
  asset: Asset | null
  supplier: Supplier | null
  subtasks: TicketSubtask[]
}

export type MapPinType = 'camera' | 'switch' | 'rack' | 'ethernet' | 'wifi' | 'taula' | 'isp' | 'cablejat' | 'altres'

export interface FloorPlan {
  id: string
  name: string
  storage_path: string
  created_at: string
}

export interface MapPin {
  id: string
  floor_plan_id: string
  type: MapPinType
  label: string
  x_percent: number
  y_percent: number
  asset_id: string | null
  notes: string | null
  created_at: string
}

export interface MapPinWithRelations extends MapPin {
  asset: Asset | null
}

export interface MapPinPort {
  id: string
  pin_id: string
  port_label: string
  connected_port_id: string | null
  vlan: string | null
  notes: string | null
  created_at: string
}

export interface MapPinPortWithPin extends MapPinPort {
  pin: Pick<MapPin, 'id' | 'label' | 'type'> | null
}

export interface UptimeDay {
  day: string
  checks_total: number
  checks_up: number
  updated_at: string
}
