import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { makeCrud } from '../lib/makeCrud'
import type { Category, Profile, Requester } from '../types/database'

export function useRequesters() {
  return useQuery({
    queryKey: ['requesters'],
    queryFn: async () => {
      const { data, error } = await supabase.from('requesters').select('*').order('name')
      if (error) throw error
      return data as Requester[]
    },
  })
}

const requesters = makeCrud<Requester>('requesters', 'requesters')
export const useCreateRequester = requesters.useCreate
export const useUpdateRequester = requesters.useUpdate
export const useDeleteRequester = requesters.useDelete

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data as Category[]
    },
  })
}

const categories = makeCrud<Category>('categories', 'categories')
export const useCreateCategory = categories.useCreate
export const useUpdateCategory = categories.useUpdate
export const useDeleteCategory = categories.useDelete

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('full_name')
      if (error) throw error
      return data as Profile[]
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, full_name }: { id: string; full_name: string }) => {
      const { data, error } = await supabase.from('profiles').update({ full_name }).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
  })
}
