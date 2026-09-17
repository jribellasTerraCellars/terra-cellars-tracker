import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
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

export function useCreateBackupJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (job: Partial<BackupJob> & { name: string }) => {
      const { data, error } = await supabase.from('backup_jobs').insert(job).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['backup_jobs'] }),
  })
}

export function useUpdateBackupJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<BackupJob> }) => {
      const { data, error } = await supabase.from('backup_jobs').update(changes).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['backup_jobs'] }),
  })
}

export function useDeleteBackupJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('backup_jobs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['backup_jobs'] }),
  })
}

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

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (supplier: Partial<Supplier> & { name: string }) => {
      const { data, error } = await supabase.from('suppliers').insert(supplier).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<Supplier> }) => {
      const { data, error } = await supabase.from('suppliers').update(changes).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('suppliers').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  })
}
