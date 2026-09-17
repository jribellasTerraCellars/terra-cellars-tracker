import { useState, type FormEvent } from 'react'
import { useDeleteFloorPlan, useFloorPlans, useUploadFloorPlan } from '../hooks/useFloorPlans'
import { FloorPlanCanvas } from '../components/FloorPlanCanvas'

type Tab = 'mapa' | 'xarxa'

export function Documentation() {
  const [tab, setTab] = useState<Tab>('mapa')

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Documentació</h1>
        <div className="flex rounded-md border border-[var(--color-border)] p-0.5">
          <button
            onClick={() => setTab('mapa')}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              tab === 'mapa' ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'text-[var(--color-text-muted)]'
            }`}
          >
            Mapa de l'empresa
          </button>
          <button
            onClick={() => setTab('xarxa')}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              tab === 'xarxa' ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'text-[var(--color-text-muted)]'
            }`}
          >
            Xarxa i servidors
          </button>
        </div>
      </div>

      {tab === 'mapa' ? <CompanyMap /> : <NetworkDocs />}
    </div>
  )
}

function CompanyMap() {
  const { data: plans, isLoading } = useFloorPlans()
  const uploadPlan = useUploadFloorPlan()
  const deletePlan = useDeleteFloorPlan()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedPlan = plans?.find((p) => p.id === selectedId) ?? plans?.[0]

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !file) return
    setError(null)
    try {
      const created = await uploadPlan.mutateAsync({ name: name.trim(), file })
      setSelectedId(created.id)
      setName('')
      setFile(null)
      setUploading(false)
    } catch {
      setError('No s\'ha pogut pujar el plànol. Comprova que sigui una imatge vàlida.')
    }
  }

  const handleDelete = async (plan: NonNullable<typeof selectedPlan>) => {
    if (!confirm(`Eliminar el plànol "${plan.name}" i tots els seus punts?`)) return
    await deletePlan.mutateAsync(plan)
    setSelectedId(null)
  }

  if (isLoading) return <p className="text-sm text-[var(--color-text-muted)]">Carregant...</p>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {plans?.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedId(plan.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                selectedPlan?.id === plan.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => setUploading(true)}
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
        >
          + Pujar plànol
        </button>
      </div>

      {uploading && (
        <form onSubmit={handleUpload} className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom del plànol (ex: Planta baixa, Sala de servidors)"
            className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <button
            type="submit"
            disabled={!name.trim() || !file || uploadPlan.isPending}
            className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90 disabled:opacity-60"
          >
            Pujar
          </button>
          <button
            type="button"
            onClick={() => setUploading(false)}
            className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-surface-alt)]"
          >
            Cancel·lar
          </button>
          {error && <p className="w-full text-sm text-[var(--color-danger)]">{error}</p>}
        </form>
      )}

      {selectedPlan ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{selectedPlan.name}</h2>
            <button
              onClick={() => handleDelete(selectedPlan)}
              className="text-xs font-medium text-[var(--color-danger)] hover:underline"
            >
              Eliminar plànol
            </button>
          </div>
          <FloorPlanCanvas plan={selectedPlan} />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-muted)]">
          Encara no hi ha cap plànol. Puja'n un per començar a marcar càmeres, switches, racks, punts wifi i preses
          ethernet.
        </div>
      )}
    </div>
  )
}

function NetworkDocs() {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-text-muted)]">
      Aquesta secció encara està buida. Quan em passis les fotos i la informació de servidors, switches i racks, la
      muntarem aquí de manera visual.
    </div>
  )
}
