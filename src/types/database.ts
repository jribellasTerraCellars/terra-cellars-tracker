export type TicketType = 'tasca' | 'incidencia'
export type TicketPriority = 'baixa' | 'mitjana' | 'alta' | 'urgent'
export type TicketStatus = 'pendent' | 'en_curs' | 'bloquejat' | 'fet' | 'cancelat'
export type ProfileRole = 'admin' | 'tecnic'
export type ProjectStatus = 'actiu' | 'pausat' | 'tancat'

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
  created_at: string
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
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
  project_id: string | null
  requester_id: string | null
  assigned_to: string | null
  due_date: string | null
  planned_date: string | null
  estimated_minutes: number | null
  actual_minutes: number | null
  created_by: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface TicketWithRelations extends Ticket {
  category: Category | null
  requester: Requester | null
  assignee: Profile | null
  project: Project | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string; email: string; full_name: string }
        Update: Partial<Profile>
        Relationships: []
      }
      requesters: {
        Row: Requester
        Insert: Partial<Requester> & { name: string }
        Update: Partial<Requester>
        Relationships: []
      }
      categories: {
        Row: Category
        Insert: Partial<Category> & { name: string }
        Update: Partial<Category>
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: Partial<Project> & { name: string }
        Update: Partial<Project>
        Relationships: []
      }
      tickets: {
        Row: Ticket
        Insert: Partial<Ticket> & { title: string }
        Update: Partial<Ticket>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
