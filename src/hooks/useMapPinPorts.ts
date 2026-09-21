import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { MapPinPort, MapPinPortWithPin } from '../types/database'

const PORT_SELECT = '*, pin:map_pins(id, label, type)'

export function usePinPorts(pinId: string | undefined) {
  return useQuery({
    queryKey: ['map_pin_ports', pinId],
    enabled: Boolean(pinId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_pin_ports')
        .select('*')
        .eq('pin_id', pinId!)
        .order('port_label', { ascending: true })
      if (error) throw error
      return data as MapPinPort[]
    },
  })
}

export function useAllPinPorts() {
  return useQuery({
    queryKey: ['map_pin_ports_all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('map_pin_ports').select(PORT_SELECT)
      if (error) throw error
      return data as unknown as MapPinPortWithPin[]
    },
  })
}

function invalidatePorts(queryClient: ReturnType<typeof useQueryClient>, pinId: string) {
  queryClient.invalidateQueries({ queryKey: ['map_pin_ports', pinId] })
  queryClient.invalidateQueries({ queryKey: ['map_pin_ports_all'] })
}

export function useCreatePinPort() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ pinId, portLabel, vlan }: { pinId: string; portLabel: string; vlan?: string }) => {
      const { data, error } = await supabase
        .from('map_pin_ports')
        .insert({ pin_id: pinId, port_label: portLabel, vlan: vlan || null })
        .select()
        .single()
      if (error) throw error
      return data as MapPinPort
    },
    onSuccess: (data) => invalidatePorts(queryClient, data.pin_id),
  })
}

export function useDeletePinPort() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (port: MapPinPort) => {
      const { error } = await supabase.from('map_pin_ports').delete().eq('id', port.id)
      if (error) throw error
      return port
    },
    onSuccess: (port) => invalidatePorts(queryClient, port.pin_id),
  })
}

export function useConnectPorts() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ portAId, portBId }: { portAId: string; portBId: string }) => {
      const { error: errorA } = await supabase.from('map_pin_ports').update({ connected_port_id: portBId }).eq('id', portAId)
      if (errorA) throw errorA
      const { data, error: errorB } = await supabase
        .from('map_pin_ports')
        .update({ connected_port_id: portAId })
        .eq('id', portBId)
        .select()
        .single()
      if (errorB) throw errorB
      return data as MapPinPort
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_pin_ports'] })
      queryClient.invalidateQueries({ queryKey: ['map_pin_ports_all'] })
    },
  })
}

export function useDisconnectPort() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (port: MapPinPort) => {
      if (port.connected_port_id) {
        await supabase.from('map_pin_ports').update({ connected_port_id: null }).eq('id', port.connected_port_id)
      }
      const { error } = await supabase.from('map_pin_ports').update({ connected_port_id: null }).eq('id', port.id)
      if (error) throw error
      return port
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map_pin_ports'] })
      queryClient.invalidateQueries({ queryKey: ['map_pin_ports_all'] })
    },
  })
}
