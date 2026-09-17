import { useRef, useState } from 'react'
import { useFloorPlanImageUrl, useMapPins } from '../hooks/useFloorPlans'
import { PinModal } from './PinModal'
import { PIN_TYPE_COLORS, PIN_TYPE_LABELS, PIN_TYPE_ORDER, PIN_TYPE_SHORT } from '../lib/constants'
import type { FloorPlan, MapPinType, MapPinWithRelations } from '../types/database'

export function FloorPlanCanvas({ plan }: { plan: FloorPlan }) {
  const { data: imageUrl, isLoading: loadingImage } = useFloorPlanImageUrl(plan.storage_path)
  const { data: pins } = useMapPins(plan.id)
  const imageRef = useRef<HTMLDivElement>(null)

  const [addMode, setAddMode] = useState(false)
  const [pendingPosition, setPendingPosition] = useState<{ x: number; y: number } | undefined>(undefined)
  const [editingPin, setEditingPin] = useState<MapPinWithRelations | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<Set<MapPinType>>(new Set(PIN_TYPE_ORDER))

  const toggleFilter = (type: MapPinType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!addMode || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setPendingPosition({ x, y })
  }

  const visiblePins = pins?.filter((p) => activeFilters.has(p.type)) ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {PIN_TYPE_ORDER.map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium transition-opacity ${
                activeFilters.has(type) ? 'border-transparent' : 'border-[var(--color-border)] opacity-40'
              }`}
              style={activeFilters.has(type) ? { backgroundColor: `${PIN_TYPE_COLORS[type]}1a`, color: PIN_TYPE_COLORS[type] } : undefined}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ backgroundColor: PIN_TYPE_COLORS[type] }}
              >
                {PIN_TYPE_SHORT[type]}
              </span>
              {PIN_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAddMode((v) => !v)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            addMode
              ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]'
              : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]'
          }`}
        >
          {addMode ? 'Clica al plànol per afegir un punt...' : '+ Afegir punt'}
        </button>
      </div>

      {loadingImage ? (
        <p className="text-sm text-[var(--color-text-muted)]">Carregant plànol...</p>
      ) : imageUrl ? (
        <div
          ref={imageRef}
          onClick={handleImageClick}
          className={`relative overflow-hidden rounded-lg border border-[var(--color-border)] ${addMode ? 'cursor-crosshair' : ''}`}
        >
          <img src={imageUrl} alt={plan.name} className="block w-full select-none" draggable={false} />
          {visiblePins.map((pin) => (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation()
                setEditingPin(pin)
              }}
              title={pin.label}
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-md transition-transform hover:scale-110"
              style={{ left: `${pin.x_percent}%`, top: `${pin.y_percent}%`, backgroundColor: PIN_TYPE_COLORS[pin.type] }}
            >
              {PIN_TYPE_SHORT[pin.type]}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-muted)]">No s'ha pogut carregar la imatge del plànol.</p>
      )}

      {pendingPosition && (
        <PinModal
          floorPlanId={plan.id}
          position={pendingPosition}
          onClose={() => {
            setPendingPosition(undefined)
            setAddMode(false)
          }}
        />
      )}
      {editingPin && (
        <PinModal floorPlanId={plan.id} pin={editingPin} onClose={() => setEditingPin(undefined)} />
      )}
    </div>
  )
}
