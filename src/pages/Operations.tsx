import { useState } from 'react'
import { useBackupJobs, useSuppliers } from '../hooks/useOperations'
import { BackupJobModal } from '../components/BackupJobModal'
import { SupplierModal } from '../components/SupplierModal'
import {
  BACKUP_FREQUENCY_LABELS,
  BACKUP_STATUS_LABELS,
  BACKUP_STATUS_STYLES,
  SUPPLIER_CATEGORY_LABELS,
} from '../lib/constants'
import type { BackupJobWithRelations, Supplier } from '../types/database'

export function Operations() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Backups i proveïdors</h1>
      <BackupsPanel />
      <SuppliersPanel />
    </div>
  )
}

function BackupsPanel() {
  const { data: jobs, isLoading } = useBackupJobs()
  const [selected, setSelected] = useState<BackupJobWithRelations | undefined>(undefined)
  const [creating, setCreating] = useState(false)

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Backups i continuïtat</h2>
          <p className="text-xs text-[var(--color-text-muted)]">Seguiment dels backups i la seva última verificació.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
        >
          + Nou backup
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Carregant...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-2 py-2 font-medium">Nom</th>
                <th className="px-2 py-2 font-medium">Actiu</th>
                <th className="px-2 py-2 font-medium">Freqüència</th>
                <th className="px-2 py-2 font-medium">Última verificació</th>
                <th className="px-2 py-2 font-medium">Estat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {jobs?.map((job) => (
                <tr key={job.id} onClick={() => setSelected(job)} className="cursor-pointer hover:bg-[var(--color-surface-alt)]">
                  <td className="px-2 py-2 font-medium">{job.name}</td>
                  <td className="px-2 py-2 text-[var(--color-text-muted)]">{job.asset?.name ?? '—'}</td>
                  <td className="px-2 py-2 text-[var(--color-text-muted)]">{BACKUP_FREQUENCY_LABELS[job.frequency]}</td>
                  <td className="px-2 py-2 text-[var(--color-text-muted)]">
                    {job.last_success_at ? new Date(job.last_success_at).toLocaleDateString('ca-ES') : '—'}
                  </td>
                  <td className="px-2 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BACKUP_STATUS_STYLES[job.last_status]}`}>
                      {BACKUP_STATUS_LABELS[job.last_status]}
                    </span>
                  </td>
                </tr>
              ))}
              {(!jobs || jobs.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-2 py-6 text-center text-sm text-[var(--color-text-muted)]">
                    No hi ha backups registrats encara.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && <BackupJobModal job={selected} onClose={() => setSelected(undefined)} />}
      {creating && <BackupJobModal onClose={() => setCreating(false)} />}
    </section>
  )
}

function SuppliersPanel() {
  const { data: suppliers, isLoading } = useSuppliers()
  const [selected, setSelected] = useState<Supplier | undefined>(undefined)
  const [creating, setCreating] = useState(false)

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Proveïdors i contractes</h2>
          <p className="text-xs text-[var(--color-text-muted)]">ISP, manteniment, software i altres proveïdors.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
        >
          + Nou proveïdor
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Carregant...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-2 py-2 font-medium">Nom</th>
                <th className="px-2 py-2 font-medium">Categoria</th>
                <th className="px-2 py-2 font-medium">Contacte</th>
                <th className="px-2 py-2 font-medium">Fi de contracte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {suppliers?.map((s) => (
                <tr key={s.id} onClick={() => setSelected(s)} className="cursor-pointer hover:bg-[var(--color-surface-alt)]">
                  <td className="px-2 py-2 font-medium">{s.name}</td>
                  <td className="px-2 py-2 text-[var(--color-text-muted)]">{SUPPLIER_CATEGORY_LABELS[s.category]}</td>
                  <td className="px-2 py-2 text-[var(--color-text-muted)]">{s.contact_name ?? '—'}</td>
                  <td className="px-2 py-2 text-[var(--color-text-muted)]">
                    {s.contract_end ? new Date(s.contract_end).toLocaleDateString('ca-ES') : '—'}
                  </td>
                </tr>
              ))}
              {(!suppliers || suppliers.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-2 py-6 text-center text-sm text-[var(--color-text-muted)]">
                    No hi ha proveïdors registrats encara.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && <SupplierModal supplier={selected} onClose={() => setSelected(undefined)} />}
      {creating && <SupplierModal onClose={() => setCreating(false)} />}
    </section>
  )
}
