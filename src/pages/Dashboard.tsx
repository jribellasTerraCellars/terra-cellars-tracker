import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useTickets, useUpdateTicket } from '../hooks/useTickets'
import { KanbanBoard } from '../components/KanbanBoard'
import { TicketModal } from '../components/TicketModal'
import type { TicketStatus, TicketWithRelations } from '../types/database'

type ViewMode = 'totes' | 'avui'

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
    return tickets.filter((t) => t.planned_date === today || t.due_date === today)
  }, [tickets, view, today])

  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    updateTicket.mutate({ id: ticketId, changes: { status } })
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Tauler de treball</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {view === 'totes' ? 'Totes les incidències i tasques obertes' : `Planificat per avui (${today})`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-[var(--color-border)] p-0.5">
            <button
              onClick={() => setView('totes')}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                view === 'totes' ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              Totes
            </button>
            <button
              onClick={() => setView('avui')}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                view === 'avui' ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              Avui
            </button>
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
