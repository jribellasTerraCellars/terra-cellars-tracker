import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { makeCrud } from '../lib/makeCrud'
import type { BackupJob, BackupJobWithRelations, Supplier } from '../types/database'

const BACKUP_SELECT = '*, asset:assets(*), responsible_requester:requesters(*)'

export function useBackupJobs() {
  return useQuery({
    queryKey: ['backup_jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('backup_jobs').select(BACKUP_SELECT).order('name')
      if (error) throw error
      return data as unknown as BackupJobWithRelations[]
    },
  })
}

const backupJobs = makeCrud<BackupJob>('backup_jobs', 'backup_jobs')
export const useCreateBackupJob = backupJobs.useCreate
export const useUpdateBackupJob = backupJobs.useUpdate
export const useDeleteBackupJob = backupJobs.useDelete

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('suppliers').select('*').order('name')
      if (error) throw error
      return data as Supplier[]
    },
  })
}

const suppliers = makeCrud<Supplier>('suppliers', 'suppliers')
export const useCreateSupplier = suppliers.useCreate
export const useUpdateSupplier = suppliers.useUpdate
export const useDeleteSupplier = suppliers.useDelete
