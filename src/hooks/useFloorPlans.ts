import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { FloorPlan, MapPin, MapPinWithRelations } from '../types/database'

const BUCKET = 'floor-plans'

export function useFloorPlans() {
  return useQuery({
    queryKey: ['floor_plans'],
    queryFn: async () => {
      const { data, error } = await supabase.from('floor_plans').select('*').order('created_at')
      if (error) throw error
      return data as FloorPlan[]
    },
  })
}

export function useFloorPlanImageUrl(storagePath: string | undefined) {
  return useQuery({
    queryKey: ['floor_plan_image', storagePath],
    enabled: Boolean(storagePath),
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath!, 3600)
      if (error) throw error
      return data.signedUrl
    },
    staleTime: 55 * 60 * 1000,
  })
}

export function useUploadFloorPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, file }: { name: string; file: File }) => {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
      if (uploadError) throw uploadError

      const { data, error } = await supabase.from('floor_plans').insert({ name, storage_path: path }).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['floor_plans'] }),
  })
}

export function useDeleteFloorPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (plan: FloorPlan) => {
      await supabase.storage.from(BUCKET).remove([plan.storage_path])
      const { error } = await supabase.from('floor_plans').delete().eq('id', plan.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floor_plans'] })
      queryClient.invalidateQueries({ queryKey: ['map_pins'] })
    },
  })
}

const PIN_SELECT = '*, asset:assets(*)'

export function useMapPins(floorPlanId: string | undefined) {
  return useQuery({
    queryKey: ['map_pins', floorPlanId],
    enabled: Boolean(floorPlanId),
    queryFn: async () => {
      const { data, error } = await supabase.from('map_pins').select(PIN_SELECT).eq('floor_plan_id', floorPlanId!)
      if (error) throw error
      return data as unknown as MapPinWithRelations[]
    },
  })
}

export function useCreateMapPin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pin: Partial<MapPin> & { floor_plan_id: string; label: string; x_percent: number; y_percent: number }) => {
      const { data, error } = await supabase.from('map_pins').insert(pin).select().single()
      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ['map_pins', variables.floor_plan_id] }),
  })
}

export function useUpdateMapPin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<MapPin> }) => {
      const { data, error } = await supabase.from('map_pins').update(changes).eq('id', id).select().single()
      if (error) throw error
      return data as MapPin
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ['map_pins', data.floor_plan_id] }),
  })
}

export function useDeleteMapPin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pin: MapPin) => {
      const { error } = await supabase.from('map_pins').delete().eq('id', pin.id)
      if (error) throw error
      return pin
    },
    onSuccess: (pin) => queryClient.invalidateQueries({ queryKey: ['map_pins', pin.floor_plan_id] }),
  })
}
