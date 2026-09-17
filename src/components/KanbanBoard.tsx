import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core'
import { STATUS_LABELS, STATUS_ORDER } from '../lib/constants'
import { TicketCard } from './TicketCard'
import type { TicketStatus, TicketWithRelations } from '../types/database'

function KanbanColumn({
  status,
  tickets,
  onTicketClick,
}: {
  status: TicketStatus
  tickets: TicketWithRelations[]
  onTicketClick: (ticket: TicketWithRelations) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3 transition-colors ${
        isOver ? 'ring-2 ring-[var(--color-primary)]' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{STATUS_LABELS[status]}</h3>
        <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
          {tickets.length}
        </span>
      </div>
      <div className="flex min-h-[100px] flex-col gap-2">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onClick={() => onTicketClick(ticket)} />
        ))}
      </div>
    </div>
  )
}

export function KanbanBoard({
  tickets,
  onTicketClick,
  onStatusChange,
}: {
  tickets: TicketWithRelations[]
  onTicketClick: (ticket: TicketWithRelations) => void
  onStatusChange: (ticketId: string, status: TicketStatus) => void
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as TicketStatus
    const ticket = tickets.find((t) => t.id === active.id)
    if (ticket && ticket.status !== newStatus) {
      onStatusChange(ticket.id, newStatus)
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tickets={tickets.filter((t) => t.status === status)}
            onTicketClick={onTicketClick}
          />
        ))}
      </div>
    </DndContext>
  )
}
