import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { ModalFooter } from './ModalFooter'
import { useCreateAsset, useDeleteAsset, useUpdateAsset } from '../hooks/useAssets'
import { useRequesters } from '../hooks/useReferenceData'
import { ASSET_STATUS_LABELS, ASSET_STATUS_ORDER, ASSET_TYPE_LABELS, ASSET_TYPE_ORDER, inputClass, labelClass } from '../lib/constants'
import type { AssetStatus, AssetType, AssetWithRelations } from '../types/database'

export function AssetModal({ asset, onClose }: { asset?: AssetWithRelations; onClose: () => void }) {
  const { data: requesters } = useRequesters()
  const createAsset = useCreateAsset()
  const updateAsset = useUpdateAsset()
  const deleteAsset = useDeleteAsset()

  const [name, setName] = useState(asset?.name ?? '')
  const [type, setType] = useState<AssetType>(asset?.type ?? 'pc')
  const [status, setStatus] = useState<AssetStatus>(asset?.status ?? 'actiu')
  const [brand, setBrand] = useState(asset?.brand ?? '')
  const [model, setModel] = useState(asset?.model ?? '')
  const [serialNumber, setSerialNumber] = useState(asset?.serial_number ?? '')
  const [location, setLocation] = useState(asset?.location ?? '')
  const [ipAddress, setIpAddress] = useState(asset?.ip_address ?? '')
  const [vlan, setVlan] = useState(asset?.vlan ?? '')
  const [assignedTo, setAssignedTo] = useState(asset?.assigned_to ?? '')
  const [purchaseDate, setPurchaseDate] = useState(asset?.purchase_date ?? '')
  const [warrantyUntil, setWarrantyUntil] = useState(asset?.warranty_until ?? '')
  const [notes, setNotes] = useState(asset?.notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(asset)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const payload = {
      name,
      type,
      status,
      brand: brand || null,
      model: model || null,
      serial_number: serialNumber || null,
      location: location || null,
      ip_address: ipAddress || null,
      vlan: vlan || null,
      assigned_to: assignedTo || null,
      purchase_date: purchaseDate || null,
      warranty_until: warrantyUntil || null,
      notes: notes || null,
    }

    try {
      if (isEditing && asset) {
        await updateAsset.mutateAsync({ id: asset.id, changes: payload })
      } else {
        await createAsset.mutateAsync(payload)
      }
      onClose()
    } catch {
      setError('No s\'ha pogut desar l\'actiu. Torna-ho a provar.')
    }
  }

  return (
    <Modal title={isEditing ? 'Editar actiu' : 'Nou actiu'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={labelClass} htmlFor="name">Nom / identificador</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="type">Tipus</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as AssetType)} className={inputClass}>
              {ASSET_TYPE_ORDER.map((value) => (
                <option key={value} value={value}>{ASSET_TYPE_LABELS[value]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="status">Estat</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as AssetStatus)} className={inputClass}>
              {ASSET_STATUS_ORDER.map((value) => (
                <option key={value} value={value}>{ASSET_STATUS_LABELS[value]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="brand">Marca</label>
            <input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="model">Model</label>
            <input id="model" value={model} onChange={(e) => setModel(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="serialNumber">Número de sèrie</label>
            <input id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="location">Ubicació</label>
            <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="ipAddress">IP</label>
            <input id="ipAddress" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="vlan">VLAN</label>
            <input id="vlan" value={vlan} onChange={(e) => setVlan(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="assignedTo">Assignat a</label>
          <select id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={inputClass}>
            <option value="">Sense assignar</option>
            {requesters?.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="purchaseDate">Data de compra</label>
            <input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="warrantyUntil">Garantia fins</label>
            <input id="warrantyUntil" type="date" value={warrantyUntil} onChange={(e) => setWarrantyUntil(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
        </div>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <ModalFooter
          onClose={onClose}
          saving={createAsset.isPending || updateAsset.isPending}
          onDelete={asset ? () => deleteAsset.mutateAsync(asset.id) : undefined}
          confirmMessage="Segur que vols eliminar aquest actiu?"
        />
      </form>
    </Modal>
  )
}
