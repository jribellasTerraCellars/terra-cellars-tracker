import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { ModalFooter } from './ModalFooter'
import { useCreateBackupJob, useDeleteBackupJob, useUpdateBackupJob } from '../hooks/useOperations'
import { useAssets } from '../hooks/useAssets'
import { useRequesters } from '../hooks/useReferenceData'
import { BACKUP_FREQUENCY_LABELS, BACKUP_STATUS_LABELS, BACKUP_TYPE_LABELS, inputClass, labelClass } from '../lib/constants'
import type { BackupFrequency, BackupJobWithRelations, BackupLastStatus, BackupType } from '../types/database'

export function BackupJobModal({ job, onClose }: { job?: BackupJobWithRelations; onClose: () => void }) {
  const { data: assets } = useAssets()
  const { data: requesters } = useRequesters()
  const createJob = useCreateBackupJob()
  const updateJob = useUpdateBackupJob()
  const deleteJob = useDeleteBackupJob()

  const [name, setName] = useState(job?.name ?? '')
  const [assetId, setAssetId] = useState(job?.asset_id ?? '')
  const [frequency, setFrequency] = useState<BackupFrequency>(job?.frequency ?? 'diaria')
  const [backupType, setBackupType] = useState<BackupType>(job?.backup_type ?? 'complet')
  const [destination, setDestination] = useState(job?.destination ?? '')
  const [lastStatus, setLastStatus] = useState<BackupLastStatus>(job?.last_status ?? 'pendent')
  const [lastSuccessAt, setLastSuccessAt] = useState(job?.last_success_at?.slice(0, 10) ?? '')
  const [responsible, setResponsible] = useState(job?.responsible ?? '')
  const [retentionNotes, setRetentionNotes] = useState(job?.retention_notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(job)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const payload = {
      name,
      asset_id: assetId || null,
      frequency,
      backup_type: backupType,
      destination: destination || null,
      last_status: lastStatus,
      last_success_at: lastSuccessAt ? new Date(lastSuccessAt).toISOString() : null,
      responsible: responsible || null,
      retention_notes: retentionNotes || null,
    }

    try {
      if (isEditing && job) {
        await updateJob.mutateAsync({ id: job.id, changes: payload })
      } else {
        await createJob.mutateAsync(payload)
      }
      onClose()
    } catch {
      setError('No s\'ha pogut desar el backup. Torna-ho a provar.')
    }
  }

  return (
    <Modal title={isEditing ? 'Editar backup' : 'Nou backup'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={labelClass} htmlFor="name">Nom</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="asset">Actiu</label>
          <select id="asset" value={assetId} onChange={(e) => setAssetId(e.target.value)} className={inputClass}>
            <option value="">Sense especificar</option>
            {assets?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="frequency">Freqüència</label>
            <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as BackupFrequency)} className={inputClass}>
              {Object.entries(BACKUP_FREQUENCY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="backupType">Tipus</label>
            <select id="backupType" value={backupType} onChange={(e) => setBackupType(e.target.value as BackupType)} className={inputClass}>
              {Object.entries(BACKUP_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="destination">Destinació</label>
          <input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Local / Cloud / Offsite" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="lastStatus">Últim estat</label>
            <select id="lastStatus" value={lastStatus} onChange={(e) => setLastStatus(e.target.value as BackupLastStatus)} className={inputClass}>
              {Object.entries(BACKUP_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="lastSuccessAt">Última verificació</label>
            <input id="lastSuccessAt" type="date" value={lastSuccessAt} onChange={(e) => setLastSuccessAt(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="responsible">Responsable</label>
          <select id="responsible" value={responsible} onChange={(e) => setResponsible(e.target.value)} className={inputClass}>
            <option value="">Sense especificar</option>
            {requesters?.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="retentionNotes">Notes de retenció / recuperació</label>
          <textarea id="retentionNotes" value={retentionNotes} onChange={(e) => setRetentionNotes(e.target.value)} rows={2} className={inputClass} />
        </div>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <ModalFooter
          onClose={onClose}
          saving={createJob.isPending || updateJob.isPending}
          onDelete={job ? () => deleteJob.mutateAsync(job.id) : undefined}
          confirmMessage="Segur que vols eliminar aquest backup?"
        />
      </form>
    </Modal>
  )
}
