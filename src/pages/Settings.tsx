import { useState, type FormEvent } from 'react'
import {
  useCategories,
  useCreateCategory,
  useCreateRequester,
  useDeleteCategory,
  useRequesters,
  useUpdateRequester,
} from '../hooks/useReferenceData'

export function Settings() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Configuració</h1>
      <RequestersPanel />
      <CategoriesPanel />
    </div>
  )
}

function RequestersPanel() {
  const { data: requesters } = useRequesters()
  const createRequester = useCreateRequester()
  const updateRequester = useUpdateRequester()
  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    await createRequester.mutateAsync({ name: name.trim(), department: department.trim() || null })
    setName('')
    setDepartment('')
  }

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h2 className="mb-1 text-sm font-semibold">Usuaris interns (sol·licitants)</h2>
      <p className="mb-4 text-xs text-[var(--color-text-muted)]">
        Persones de l'empresa que poden demanar tasques o reportar incidències.
      </p>

      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Departament (opcional)"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <button
          type="submit"
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
        >
          Afegir
        </button>
      </form>

      <ul className="flex flex-col divide-y divide-[var(--color-border)]">
        {requesters?.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-2 text-sm">
            <div>
              <p className={!r.active ? 'text-[var(--color-text-muted)] line-through' : ''}>{r.name}</p>
              {r.department && <p className="text-xs text-[var(--color-text-muted)]">{r.department}</p>}
            </div>
            <button
              onClick={() => updateRequester.mutate({ id: r.id, changes: { active: !r.active } })}
              className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              {r.active ? 'Desactivar' : 'Activar'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

const DEFAULT_COLOR = '#5C1F2E'

function CategoriesPanel() {
  const { data: categories } = useCategories()
  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()
  const [name, setName] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    await createCategory.mutateAsync({ name: name.trim(), color })
    setName('')
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

      <ul className="flex flex-wrap gap-2">
        {categories?.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-2 rounded-full py-1 pl-3 pr-1 text-xs font-medium"
            style={{ backgroundColor: `${c.color}1a`, color: c.color }}
          >
            {c.name}
            <button
              onClick={() => deleteCategory.mutate(c.id)}
              className="rounded-full px-1.5 py-0.5 text-[10px] hover:bg-black/10"
              aria-label={`Eliminar ${c.name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
