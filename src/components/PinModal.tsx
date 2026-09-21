import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { ModalFooter } from './ModalFooter'
import { useCreateMapPin, useDeleteMapPin, useUpdateMapPin } from '../hooks/useFloorPlans'
import {
  useAllPinPorts,
  useConnectPorts,
  useCreatePinPort,
  useDeletePinPort,
  useDisconnectPort,
  usePinPorts,
} from '../hooks/useMapPinPorts'
import { useAssets } from '../hooks/useAssets'
import { PIN_TYPE_LABELS, PIN_TYPE_ORDER, inputClass, labelClass } from '../lib/constants'
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

        {isEditing && pin && <PortsPanel pinId={pin.id} />}

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <ModalFooter
          onClose={onClose}
          saving={!label.trim() || createPin.isPending || updatePin.isPending}
          onDelete={pin ? () => deletePin.mutateAsync(pin) : undefined}
          confirmMessage="Segur que vols eliminar aquest punt?"
        />
      </form>
    </Modal>
  )
}

function PortsPanel({ pinId }: { pinId: string }) {
  const { data: ports } = usePinPorts(pinId)
  const { data: allPorts } = useAllPinPorts()
  const createPort = useCreatePinPort()
  const deletePort = useDeletePinPort()
  const connectPorts = useConnectPorts()
  const disconnectPort = useDisconnectPort()

  const [portLabel, setPortLabel] = useState('')
  const [vlan, setVlan] = useState('')
  const [connectingPortId, setConnectingPortId] = useState<string | null>(null)
  const [targetPortId, setTargetPortId] = useState('')

  const handleAddPort = async () => {
    if (!portLabel.trim()) return
    await createPort.mutateAsync({ pinId, portLabel: portLabel.trim(), vlan: vlan.trim() || undefined })
    setPortLabel('')
    setVlan('')
  }

  const handleConnect = async () => {
    if (!connectingPortId || !targetPortId) return
    await connectPorts.mutateAsync({ portAId: connectingPortId, portBId: targetPortId })
    setConnectingPortId(null)
    setTargetPortId('')
  }

  const findPort = (id: string | null) => allPorts?.find((p) => p.id === id)
  const availableTargets = allPorts?.filter((p) => p.pin_id !== pinId && !p.connected_port_id) ?? []

  return (
    <div className="rounded-md border border-[var(--color-border)] p-3">
      <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">Ports i connexions de cablejat</p>

      {ports && ports.length > 0 && (
        <ul className="mb-2 flex flex-col gap-2">
          {ports.map((port) => {
            const connected = findPort(port.connected_port_id)
            return (
              <li key={port.id} className="rounded border border-[var(--color-border)] p-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">
                    Port {port.port_label}
                    {port.vlan ? ` · VLAN ${port.vlan}` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => deletePort.mutate(port)}
                    className="shrink-0 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                  {connected ? (
                    <span>
                      → {connected.pin?.label ?? 'Punt desconegut'} · port {connected.port_label}
                    </span>
                  ) : connectingPortId === port.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <select
                        value={targetPortId}
                        onChange={(e) => setTargetPortId(e.target.value)}
                        className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs outline-none"
                      >
                        <option value="">Selecciona port destí...</option>
                        {availableTargets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.pin?.label ?? 'Punt desconegut'} · port {p.port_label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleConnect}
                        disabled={!targetPortId}
                        className="shrink-0 text-xs font-medium text-[var(--color-primary)] disabled:opacity-60"
                      >
                        Confirmar
                      </button>
                      <button type="button" onClick={() => setConnectingPortId(null)} className="shrink-0 text-xs">
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConnectingPortId(port.id)}
                      className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                    >
                      Connectar a...
                    </button>
                  )}
                  {connected && (
                    <button type="button" onClick={() => disconnectPort.mutate(port)} className="shrink-0 text-xs hover:underline">
                      Desconnectar
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={portLabel}
          onChange={(e) => setPortLabel(e.target.value)}
          placeholder="Núm. port"
          className="w-24 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <input
          value={vlan}
          onChange={(e) => setVlan(e.target.value)}
          placeholder="VLAN (opcional)"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <button
          type="button"
          onClick={handleAddPort}
          disabled={!portLabel.trim() || createPort.isPending}
          className="shrink-0 rounded-md border border-[var(--color-border)] px-2 py-1.5 text-xs font-medium hover:bg-[var(--color-surface-alt)] disabled:opacity-60"
        >
          + Port
        </button>
      </div>
    </div>
  )
}
