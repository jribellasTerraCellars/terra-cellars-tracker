import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { useCreateSupplier, useDeleteSupplier, useUpdateSupplier } from '../hooks/useOperations'
import { SUPPLIER_CATEGORY_LABELS, SUPPLIER_CATEGORY_ORDER } from '../lib/constants'
import type { Supplier, SupplierCategory } from '../types/database'

export function SupplierModal({ supplier, onClose }: { supplier?: Supplier; onClose: () => void }) {
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  const [name, setName] = useState(supplier?.name ?? '')
  const [category, setCategory] = useState<SupplierCategory>(supplier?.category ?? 'altres')
  const [contactName, setContactName] = useState(supplier?.contact_name ?? '')
  const [phone, setPhone] = useState(supplier?.phone ?? '')
  const [email, setEmail] = useState(supplier?.email ?? '')
  const [contractStart, setContractStart] = useState(supplier?.contract_start ?? '')
  const [contractEnd, setContractEnd] = useState(supplier?.contract_end ?? '')
  const [renewalNoticeDays, setRenewalNoticeDays] = useState(supplier?.renewal_notice_days?.toString() ?? '')
  const [notes, setNotes] = useState(supplier?.notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(supplier)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const payload = {
      name,
      category,
      contact_name: contactName || null,
      phone: phone || null,
      email: email || null,
      contract_start: contractStart || null,
      contract_end: contractEnd || null,
      renewal_notice_days: renewalNoticeDays ? Number(renewalNoticeDays) : null,
      notes: notes || null,
    }

    try {
      if (isEditing && supplier) {
        await updateSupplier.mutateAsync({ id: supplier.id, changes: payload })
      } else {
        await createSupplier.mutateAsync(payload)
      }
      onClose()
    } catch {
      setError('No s\'ha pogut desar el proveïdor. Torna-ho a provar.')
    }
  }

  const handleDelete = async () => {
    if (!supplier) return
    if (!confirm('Segur que vols eliminar aquest proveïdor?')) return
    await deleteSupplier.mutateAsync(supplier.id)
    onClose()
  }

  const inputClass =
    'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]'
  const labelClass = 'mb-1 block text-xs font-medium text-[var(--color-text-muted)]'

  return (
    <Modal title={isEditing ? 'Editar proveïdor' : 'Nou proveïdor'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="name">Nom</label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="category">Categoria</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as SupplierCategory)} className={inputClass}>
              {SUPPLIER_CATEGORY_ORDER.map((value) => (
                <option key={value} value={value}>{SUPPLIER_CATEGORY_LABELS[value]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="contactName">Persona de contacte</label>
            <input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Telèfon</label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="email">Correu</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="contractStart">Inici contracte</label>
            <input id="contractStart" type="date" value={contractStart} onChange={(e) => setContractStart(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="contractEnd">Fi contracte</label>
            <input id="contractEnd" type="date" value={contractEnd} onChange={(e) => setContractEnd(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="renewalNoticeDays">Avisar-me (dies abans de venciment)</label>
          <input id="renewalNoticeDays" type="number" min={0} value={renewalNoticeDays} onChange={(e) => setRenewalNoticeDays(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
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
              disabled={createSupplier.isPending || updateSupplier.isPending}
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
