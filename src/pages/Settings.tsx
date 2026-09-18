import { useState, type FormEvent } from 'react'
import {
  useCategories,
  useCreateCategory,
  useCreateRequester,
  useDeleteCategory,
  useDeleteRequester,
  useProfiles,
  useRequesters,
  useUpdateCategory,
  useUpdateProfile,
  useUpdateRequester,
} from '../hooks/useReferenceData'
import { Avatar } from '../components/Avatar'
import { EMPLOYMENT_STATUS_LABELS, EMPLOYMENT_STATUS_ORDER } from '../lib/constants'
import type { Category, EmploymentStatus, Profile, Requester } from '../types/database'

export function Settings() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Configuració</h1>
      <ProfilesPanel />
      <RequestersPanel />
      <CategoriesPanel />
    </div>
  )
}

function ProfilesPanel() {
  const { data: profiles } = useProfiles()
  const updateProfile = useUpdateProfile()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')

  const startEditing = (profile: Profile) => {
    setEditingId(profile.id)
    setName(profile.full_name)
  }

  const handleSave = async (id: string) => {
    if (!name.trim()) return
    await updateProfile.mutateAsync({ id, full_name: name.trim() })
    setEditingId(null)
  }

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h2 className="mb-1 text-sm font-semibold">Usuaris de l'equip IT</h2>
      <p className="mb-4 text-xs text-[var(--color-text-muted)]">
        Persones amb accés a l'aplicació. Edita el nom mostrat si cal.
      </p>

      <ul className="flex flex-col divide-y divide-[var(--color-border)]">
        {profiles?.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-2 py-2 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar name={p.full_name} size="md" />
              {editingId === p.id ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm outline-none focus:border-[var(--color-primary)]"
                />
              ) : (
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.full_name}</p>
                  <p className="truncate text-xs text-[var(--color-text-muted)]">{p.email}</p>
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {editingId === p.id ? (
                <>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    Cancel·lar
                  </button>
                  <button
                    onClick={() => handleSave(p.id)}
                    disabled={!name.trim()}
                    className="text-xs font-medium text-[var(--color-primary)] hover:underline disabled:opacity-60"
                  >
                    Desar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing(p)}
                  className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Editar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RequestersPanel() {
  const { data: requesters } = useRequesters()
  const createRequester = useCreateRequester()
  const updateRequester = useUpdateRequester()
  const deleteRequester = useDeleteRequester()
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    await createRequester.mutateAsync({ name: name.trim(), department: department.trim() || null })
    setName('')
    setDepartment('')
  }

  const handleDelete = async (requester: Requester) => {
    if (!confirm(`Segur que vols eliminar "${requester.name}"? Els tickets que hi facin referència es quedaran sense sol·licitant.`)) return
    await deleteRequester.mutateAsync(requester.id)
  }

  const inputClass =
    'flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]'

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h2 className="mb-1 text-sm font-semibold">Empleats</h2>
      <p className="mb-4 text-xs text-[var(--color-text-muted)]">
        Persones de l'empresa que poden demanar tasques o reportar incidències. Edita'ls per afegir càrrec,
        usuari d'AD o dates d'alta/baixa.
      </p>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className={inputClass} />
        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Departament (opcional)"
          className={inputClass}
        />
        <button
          type="submit"
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
        >
          Afegir
        </button>
      </form>

      <ul className="flex flex-col divide-y divide-[var(--color-border)]">
        {requesters?.map((r) =>
          editingId === r.id ? (
            <RequesterEditRow
              key={r.id}
              requester={r}
              onCancel={() => setEditingId(null)}
              onSave={async (changes) => {
                await updateRequester.mutateAsync({ id: r.id, changes })
                setEditingId(null)
              }}
            />
          ) : (
            <li key={r.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <div>
                <div className="flex items-center gap-2">
                  <p className={!r.active ? 'text-[var(--color-text-muted)] line-through' : ''}>{r.name}</p>
                  <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                    {EMPLOYMENT_STATUS_LABELS[r.employment_status]}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {[r.department, r.position].filter(Boolean).join(' · ') || '—'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setEditingId(r.id)}
                  className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Editar
                </button>
                <button
                  onClick={() => updateRequester.mutate({ id: r.id, changes: { active: !r.active } })}
                  className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  {r.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  className="text-xs font-medium text-[var(--color-danger)] hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}

function RequesterEditRow({
  requester,
  onSave,
  onCancel,
}: {
  requester: Requester
  onSave: (changes: Partial<Requester>) => Promise<void>
  onCancel: () => void
}) {
  const [name, setName] = useState(requester.name)
  const [department, setDepartment] = useState(requester.department ?? '')
  const [position, setPosition] = useState(requester.position ?? '')
  const [adUsername, setAdUsername] = useState(requester.ad_username ?? '')
  const [startDate, setStartDate] = useState(requester.start_date ?? '')
  const [endDate, setEndDate] = useState(requester.end_date ?? '')
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>(requester.employment_status)

  const inputClass =
    'flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]'

  return (
    <li className="flex flex-col gap-2 py-3 text-sm">
      <div className="flex flex-wrap gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className={inputClass} />
        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Departament"
          className={inputClass}
        />
        <input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Càrrec" className={inputClass} />
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={adUsername} onChange={(e) => setAdUsername(e.target.value)} placeholder="Usuari AD" className={inputClass} />
        <select
          value={employmentStatus}
          onChange={(e) => setEmploymentStatus(e.target.value as EmploymentStatus)}
          className={inputClass}
        >
          {EMPLOYMENT_STATUS_ORDER.map((value) => (
            <option key={value} value={value}>{EMPLOYMENT_STATUS_LABELS[value]}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-[var(--color-text-muted)]">Alta</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        <label className="text-xs text-[var(--color-text-muted)]">Baixa</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
      </div>
      <div className="flex shrink-0 justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs font-medium hover:bg-[var(--color-surface-alt)]"
        >
          Cancel·lar
        </button>
        <button
          onClick={() =>
            onSave({
              name: name.trim(),
              department: department.trim() || null,
              position: position.trim() || null,
              ad_username: adUsername.trim() || null,
              start_date: startDate || null,
              end_date: endDate || null,
              employment_status: employmentStatus,
            })
          }
          disabled={!name.trim()}
          className="rounded-md bg-[var(--color-primary)] px-2 py-1 text-xs font-medium text-[var(--color-primary-contrast)] hover:opacity-90 disabled:opacity-60"
        >
          Desar
        </button>
      </div>
    </li>
  )
}

const DEFAULT_COLOR = '#5C1F2E'

function CategoriesPanel() {
  const { data: categories } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    await createCategory.mutateAsync({ name: name.trim(), color, description: description.trim() || null })
    setName('')
    setDescription('')
    setColor(DEFAULT_COLOR)
  }

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h2 className="mb-1 text-sm font-semibold">Categories</h2>
      <p className="mb-4 text-xs text-[var(--color-text-muted)]">
        Etiquetes generals per classificar tickets (xarxa, AD, Azure, M365...).
      </p>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la categoria"
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripció (opcional)"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-9 w-12 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
        <button
          type="submit"
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
        >
          Afegir
        </button>
      </form>

      <ul className="flex flex-col divide-y divide-[var(--color-border)]">
        {categories?.map((c) =>
          editingId === c.id ? (
            <CategoryEditRow
              key={c.id}
              category={c}
              onCancel={() => setEditingId(null)}
              onSave={async (changes) => {
                await updateCategory.mutateAsync({ id: c.id, changes })
                setEditingId(null)
              }}
            />
          ) : (
            <li key={c.id} className="flex items-center justify-between gap-2 py-2 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${c.color}1a`, color: c.color }}
                >
                  {c.name}
                </span>
                {c.description && <span className="text-xs text-[var(--color-text-muted)]">{c.description}</span>}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setEditingId(c.id)}
                  className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteCategory.mutate(c.id)}
                  className="text-xs font-medium text-[var(--color-danger)] hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}

function CategoryEditRow({
  category,
  onSave,
  onCancel,
}: {
  category: Category
  onSave: (changes: Partial<Category>) => Promise<void>
  onCancel: () => void
}) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description ?? '')
  const [color, setColor] = useState(category.color)

  const inputClass =
    'flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-primary)]'

  return (
    <li className="flex flex-wrap items-center gap-2 py-2 text-sm">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" className={inputClass} />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripció"
        className={inputClass}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="h-8 w-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
      />
      <div className="flex shrink-0 gap-2">
        <button
          onClick={onCancel}
          className="rounded-md border border-[var(--color-border)] px-2 py-1 text-xs font-medium hover:bg-[var(--color-surface-alt)]"
        >
          Cancel·lar
        </button>
        <button
          onClick={() => onSave({ name: name.trim(), description: description.trim() || null, color })}
          disabled={!name.trim()}
          className="rounded-md bg-[var(--color-primary)] px-2 py-1 text-xs font-medium text-[var(--color-primary-contrast)] hover:opacity-90 disabled:opacity-60"
        >
          Desar
        </button>
      </div>
    </li>
  )
}
