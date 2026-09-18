import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useTickets, useUpdateTicket } from '../hooks/useTickets'
import { KanbanBoard } from '../components/KanbanBoard'
import { TicketModal } from '../components/TicketModal'
import { Avatar } from '../components/Avatar'
import { PRIORITY_LABELS, STATUS_LABELS, TYPE_LABELS } from '../lib/constants'
import type { TicketStatus, TicketWithRelations } from '../types/database'

type ViewMode = 'totes' | 'avui' | 'tancades'

export function Dashboard() {
  const { data: tickets, isLoading } = useTickets()
  const updateTicket = useUpdateTicket()
  const [view, setView] = useState<ViewMode>('totes')
  const [selectedTicket, setSelectedTicket] = useState<TicketWithRelations | undefined>(undefined)
  const [creating, setCreating] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  const visibleTickets = useMemo(() => {
    if (!tickets) return []
    if (view === 'totes') {
      return tickets.filter((t) => t.status !== 'fet' && t.status !== 'cancelat')
    }
    if (view === 'tancades') {
      return [...tickets]
        .filter((t) => t.status === 'fet' || t.status === 'cancelat')
        .sort((a, b) => new Date(b.completed_at ?? b.updated_at).getTime() - new Date(a.completed_at ?? a.updated_at).getTime())
    }
    return tickets.filter((t) => t.planned_date === today || t.due_date === today)
  }, [tickets, view, today])

  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    updateTicket.mutate({ id: ticketId, changes: { status } })
  }

  const viewLabels: Record<ViewMode, string> = { totes: 'Totes', avui: 'Avui', tancades: 'Tancades' }
  const viewDescriptions: Record<ViewMode, string> = {
    totes: 'Totes les incidències i tasques obertes',
    avui: `Planificat per avui (${today})`,
    tancades: 'Tasques fetes o cancel·lades, de la més recent a la més antiga',
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Tauler de treball</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{viewDescriptions[view]}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-[var(--color-border)] p-0.5">
            {(Object.keys(viewLabels) as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-3 py-1.5 text-sm font-medium ${
                  view === v ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {viewLabels[v]}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCreating(true)}
            className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
          >
            + Nou ticket
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Carregant...</p>
      ) : view === 'tancades' ? (
        <ClosedTicketsTable tickets={visibleTickets} onTicketClick={setSelectedTicket} />
      ) : (
        <KanbanBoard
          tickets={visibleTickets}
          onTicketClick={setSelectedTicket}
          onStatusChange={handleStatusChange}
        />
      )}

      {selectedTicket && (
        <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(undefined)} />
      )}
      {creating && <TicketModal onClose={() => setCreating(false)} />}
    </div>
  )
}

function ClosedTicketsTable({
  tickets,
  onTicketClick,
}: {
  tickets: TicketWithRelations[]
  onTicketClick: (ticket: TicketWithRelations) => void
}) {
  if (tickets.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">Encara no hi ha cap tasca tancada.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--color-border)] text-xs uppercase text-[var(--color-text-muted)]">
          <tr>
            <th className="px-4 py-2 font-medium">Títol</th>
            <th className="px-4 py-2 font-medium">Tipus</th>
            <th className="px-4 py-2 font-medium">Prioritat</th>
            <th className="px-4 py-2 font-medium">Estat</th>
            <th className="px-4 py-2 font-medium">Sol·licitat per</th>
            <th className="px-4 py-2 font-medium">Assignat</th>
            <th className="px-4 py-2 font-medium">Tancat el</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {tickets.map((ticket) => (
            <tr key={ticket.id} onClick={() => onTicketClick(ticket)} className="cursor-pointer hover:bg-[var(--color-surface-alt)]">
              <td className="px-4 py-2 font-medium">{ticket.title}</td>
              <td className="px-4 py-2 text-[var(--color-text-muted)]">{TYPE_LABELS[ticket.type]}</td>
              <td className="px-4 py-2 text-[var(--color-text-muted)]">{PRIORITY_LABELS[ticket.priority]}</td>
              <td className="px-4 py-2 text-[var(--color-text-muted)]">{STATUS_LABELS[ticket.status]}</td>
              <td className="px-4 py-2 text-[var(--color-text-muted)]">{ticket.requester?.name ?? '—'}</td>
              <td className="px-4 py-2">
                <Avatar name={ticket.assignee?.full_name} size="xs" />
              </td>
              <td className="px-4 py-2 text-[var(--color-text-muted)]">
                {ticket.completed_at ? new Date(ticket.completed_at).toLocaleDateString('ca-ES') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
