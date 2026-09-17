import type { TicketPriority, TicketStatus, TicketType } from '../types/database'

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
