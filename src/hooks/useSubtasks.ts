import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { TicketSubtask } from '../types/database'

export function useSubtasks(ticketId: string | undefined) {
  return useQuery({
    queryKey: ['ticket_subtasks', ticketId],
    enabled: Boolean(ticketId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_subtasks')
        .select('*')
        .eq('ticket_id', ticketId!)
        .order('position', { ascending: true })
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as TicketSubtask[]
    },
  })
}

export function useCreateSubtask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ ticketId, title, position }: { ticketId: string; title: string; position: number }) => {
      const { data, error } = await supabase
        .from('ticket_subtasks')
        .insert({ ticket_id: ticketId, title, position })
        .select()
        .single()
      if (error) throw error
      return data as TicketSubtask
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ticket_subtasks', data.ticket_id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export function useToggleSubtask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, is_done }: { id: string; is_done: boolean }) => {
      const { data, error } = await supabase
        .from('ticket_subtasks')
        .update({ is_done })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as TicketSubtask
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ticket_subtasks', data.ticket_id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subtask: TicketSubtask) => {
      const { error } = await supabase.from('ticket_subtasks').delete().eq('id', subtask.id)
      if (error) throw error
      return subtask
    },
    onSuccess: (subtask) => {
      queryClient.invalidateQueries({ queryKey: ['ticket_subtasks', subtask.ticket_id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}
