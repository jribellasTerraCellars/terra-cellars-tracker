import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { Avatar } from './Avatar'
import { useCreateTicket, useDeleteTicket, useUpdateTicket } from '../hooks/useTickets'
import { useCategories, useProfiles, useRequesters } from '../hooks/useReferenceData'
import { useAssets } from '../hooks/useAssets'
import { useBackupJobs, useSuppliers } from '../hooks/useOperations'
import { useCreateSubtask, useDeleteSubtask, useSubtasks, useToggleSubtask } from '../hooks/useSubtasks'
import { PRIORITY_LABELS, STATUS_LABELS, STATUS_ORDER, TYPE_LABELS } from '../lib/constants'
import { useAuth } from '../context/AuthContext'
import type { TicketPriority, TicketStatus, TicketType, TicketWithRelations } from '../types/database'

interface TicketModalProps {
  ticket?: TicketWithRelations
  defaultStatus?: TicketStatus
  onClose: () => void
}

export function TicketModal({ ticket, defaultStatus, onClose }: TicketModalProps) {
  const { profile } = useAuth()
  const { data: categories } = useCategories()
  const { data: requesters } = useRequesters()
  const { data: profiles } = useProfiles()
  const { data: assets } = useAssets()
  const { data: suppliers } = useSuppliers()
  const { data: backupJobs } = useBackupJobs()
  const createTicket = useCreateTicket()
  const updateTicket = useUpdateTicket()
  const deleteTicket = useDeleteTicket()

  const [title, setTitle] = useState(ticket?.title ?? '')
  const [description, setDescription] = useState(ticket?.description ?? '')
  const [type, setType] = useState<TicketType>(ticket?.type ?? 'tasca')
  const [priority, setPriority] = useState<TicketPriority>(ticket?.priority ?? 'mitjana')
  const [status, setStatus] = useState<TicketStatus>(ticket?.status ?? defaultStatus ?? 'pendent')
  const [categoryId, setCategoryId] = useState(ticket?.category_id ?? '')
  const [requesterId, setRequesterId] = useState(ticket?.requester_id ?? '')
  const [assignedTo, setAssignedTo] = useState(ticket?.assigned_to ?? '')
  const [assetId, setAssetId] = useState(ticket?.asset_id ?? '')
  const [supplierId, setSupplierId] = useState(ticket?.supplier_id ?? '')
  const [backupJobId, setBackupJobId] = useState(ticket?.backup_job_id ?? '')
  const [dueDate, setDueDate] = useState(ticket?.due_date ?? '')
  const [plannedDate, setPlannedDate] = useState(ticket?.planned_date ?? '')
  const [estimatedMinutes, setEstimatedMinutes] = useState(ticket?.estimated_minutes?.toString() ?? '')
  const [actualMinutes, setActualMinutes] = useState(ticket?.actual_minutes?.toString() ?? '')
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(ticket)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const payload = {
      title,
      description: description || null,
      type,
      priority,
      status,
      category_id: categoryId || null,
      requester_id: requesterId || null,
      assigned_to: assignedTo || null,
      asset_id: assetId || null,
      supplier_id: supplierId || null,
      backup_job_id: backupJobId || null,
      due_date: dueDate || null,
      planned_date: plannedDate || null,
      estimated_minutes: estimatedMinutes ? Number(estimatedMinutes) : null,
      actual_minutes: actualMinutes ? Number(actualMinutes) : null,
    }

    try {
      if (isEditing && ticket) {
        await updateTicket.mutateAsync({ id: ticket.id, changes: payload })
      } else {
        await createTicket.mutateAsync({ ...payload, created_by: profile?.id ?? null })
      }
      onClose()
    } catch {
      setError('No s\'ha pogut desar el ticket. Torna-ho a provar.')
    }
  }

  const handleDelete = async () => {
    if (!ticket) return
    if (!confirm('Segur que vols eliminar aquest ticket?')) return
    await deleteTicket.mutateAsync(ticket.id)
    onClose()
  }

  const inputClass =
    'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]'
  const labelClass = 'mb-1 block text-xs font-medium text-[var(--color-text-muted)]'

  return (
    <Modal title={isEditing ? 'Editar ticket' : 'Nou ticket'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={labelClass} htmlFor="title">Títol</label>
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="description">Descripció</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="type">Tipus</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as TicketType)} className={inputClass}>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="priority">Prioritat</label>
            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className={inputClass}>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="status">Estat</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} className={inputClass}>
              {STATUS_ORDER.map((value) => (
                <option key={value} value={value}>{STATUS_LABELS[value]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="category">Categoria</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
              <option value="">Sense categoria</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="requester">Sol·licitat per</label>
            <select id="requester" value={requesterId} onChange={(e) => setRequesterId(e.target.value)} className={inputClass}>
              <option value="">Sense especificar</option>
              {requesters?.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="assignee">Assignat a</label>
            <div className="flex items-center gap-2">
              <select id="assignee" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={inputClass}>
                <option value="">Sense assignar</option>
                {profiles?.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </select>
              {assignedTo && <Avatar name={profiles?.find((p) => p.id === assignedTo)?.full_name} size="md" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="asset">Actiu relacionat</label>
            <select id="asset" value={assetId} onChange={(e) => setAssetId(e.target.value)} className={inputClass}>
              <option value="">Sense especificar</option>
              {assets?.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="supplier">Proveïdor relacionat</label>
            <select id="supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className={inputClass}>
              <option value="">Sense especificar</option>
              {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="backupJob">Backup relacionat</label>
          <select id="backupJob" value={backupJobId} onChange={(e) => setBackupJobId(e.target.value)} className={inputClass}>
            <option value="">Sense especificar</option>
            {backupJobs?.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="dueDate">Data límit</label>
            <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="plannedDate">Planificat per</label>
            <input id="plannedDate" type="date" value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="estimatedMinutes">Temps estimat (min)</label>
            <input
              id="estimatedMinutes"
              type="number"
              min={0}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="actualMinutes">Temps real (min)</label>
            <input
              id="actualMinutes"
              type="number"
              min={0}
              value={actualMinutes}
              onChange={(e) => setActualMinutes(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {isEditing && ticket && <SubtasksPanel ticketId={ticket.id} />}

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <div className="mt-2 flex items-center justify-between">
          {isEditing ? (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-medium text-[var(--color-danger)] hover:underline"
            >
              Eliminar
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-surface-alt)]"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={createTicket.isPending || updateTicket.isPending}
              className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90 disabled:opacity-60"
            >
              Desar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

function SubtasksPanel({ ticketId }: { ticketId: string }) {
  const { data: subtasks } = useSubtasks(ticketId)
  const createSubtask = useCreateSubtask()
  const toggleSubtask = useToggleSubtask()
  const deleteSubtask = useDeleteSubtask()
  const [title, setTitle] = useState('')

  const handleAdd = async () => {
    if (!title.trim()) return
    await createSubtask.mutateAsync({ ticketId, title: title.trim(), position: subtasks?.length ?? 0 })
    setTitle('')
  }

  const done = subtasks?.filter((s) => s.is_done).length ?? 0

  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--color-text-muted)]">Subtasques</span>
        {subtasks && subtasks.length > 0 && (
          <span className="text-xs text-[var(--color-text-muted)]">{done}/{subtasks.length}</span>
        )}
      </div>

      {subtasks && subtasks.length > 0 && (
        <ul className="mb-2 flex flex-col gap-1">
          {subtasks.map((s) => (
            <li key={s.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.is_done}
                onChange={(e) => toggleSubtask.mutate({ id: s.id, is_done: e.target.checked })}
                className="h-4 w-4 shrink-0 accent-[var(--color-primary)]"
              />
              <span className={`flex-1 ${s.is_done ? 'text-[var(--color-text-muted)] line-through' : ''}`}>{s.title}</span>
              <button
                type="button"
                onClick={() => deleteSubtask.mutate(s)}
                className="shrink-0 rounded px-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                aria-label={`Eliminar ${s.title}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="Afegir subtasca..."
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!title.trim() || createSubtask.isPending}
          className="rounded-md border border-[var(--color-border)] px-2 py-1.5 text-xs font-medium hover:bg-[var(--color-surface-alt)] disabled:opacity-60"
        >
          Afegir
        </button>
      </div>
    </div>
  )
}
