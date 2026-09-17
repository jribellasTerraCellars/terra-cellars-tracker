import { useDraggable } from '@dnd-kit/core'
import { PRIORITY_LABELS, PRIORITY_STYLES, TYPE_LABELS } from '../lib/constants'
import type { TicketWithRelations } from '../types/database'

export function TicketCard({ ticket, onClick }: { ticket: TicketWithRelations; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 20 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
          {TYPE_LABELS[ticket.type]}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLES[ticket.priority]}`}>
          {PRIORITY_LABELS[ticket.priority]}
        </span>
      </div>
      <p className="mb-2 text-sm font-medium leading-snug">{ticket.title}</p>
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        {ticket.category && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${ticket.category.color}1a`, color: ticket.category.color }}
          >
            {ticket.category.name}
          </span>
        )}
        {ticket.requester && <span>· {ticket.requester.name}</span>}
        {ticket.due_date && <span>· venç {ticket.due_date}</span>}
      </div>
    </div>
  )
}
