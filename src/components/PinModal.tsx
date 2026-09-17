import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { useCreateMapPin, useDeleteMapPin, useUpdateMapPin } from '../hooks/useFloorPlans'
import { useAssets } from '../hooks/useAssets'
import { PIN_TYPE_LABELS, PIN_TYPE_ORDER } from '../lib/constants'
import type { MapPinType, MapPinWithRelations } from '../types/database'

interface PinModalProps {
  floorPlanId: string
  position?: { x: number; y: number }
  pin?: MapPinWithRelations
  onClose: () => void
}

export function PinModal({ floorPlanId, position, pin, onClose }: PinModalProps) {
  const { data: assets } = useAssets()
  const createPin = useCreateMapPin()
  const updatePin = useUpdateMapPin()
  const deletePin = useDeleteMapPin()

  const [type, setType] = useState<MapPinType>(pin?.type ?? 'altres')
  const [label, setLabel] = useState(pin?.label ?? '')
  const [assetId, setAssetId] = useState(pin?.asset_id ?? '')
  const [notes, setNotes] = useState(pin?.notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(pin)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    try {
      if (isEditing && pin) {
        await updatePin.mutateAsync({
          id: pin.id,
          changes: { type, label, asset_id: assetId || null, notes: notes || null },
        })
      } else if (position) {
        await createPin.mutateAsync({
          floor_plan_id: floorPlanId,
          type,
          label,
          x_percent: position.x,
          y_percent: position.y,
          asset_id: assetId || null,
          notes: notes || null,
        })
      }
      onClose()
    } catch {
      setError('No s\'ha pogut desar el punt. Torna-ho a provar.')
    }
  }

  const handleDelete = async () => {
    if (!pin) return
    if (!confirm('Segur que vols eliminar aquest punt?')) return
    await deletePin.mutateAsync(pin)
    onClose()
  }

  const inputClass =
    'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]'
  const labelClass = 'mb-1 block text-xs font-medium text-[var(--color-text-muted)]'

  return (
    <Modal title={isEditing ? 'Editar punt' : 'Nou punt'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={labelClass} htmlFor="pinType">Tipus</label>
          <select id="pinType" value={type} onChange={(e) => setType(e.target.value as MapPinType)} className={inputClass}>
            {PIN_TYPE_ORDER.map((value) => (
              <option key={value} value={value}>{PIN_TYPE_LABELS[value]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="pinLabel">Etiqueta</label>
          <input id="pinLabel" required value={label} onChange={(e) => setLabel(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="pinAsset">Actiu relacionat</label>
          <select id="pinAsset" value={assetId} onChange={(e) => setAssetId(e.target.value)} className={inputClass}>
            <option value="">Sense especificar</option>
            {assets?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="pinNotes">Notes</label>
          <textarea id="pinNotes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
        </div>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <div className="mt-2 flex items-center justify-between">
          {isEditing ? (
            <button type="button" onClick={handleDelete} className="text-sm font-medium text-[var(--color-danger)] hover:underline">
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
              disabled={!label.trim() || createPin.isPending || updatePin.isPending}
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
