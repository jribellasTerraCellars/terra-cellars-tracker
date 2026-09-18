import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Ticket, TicketWithRelations } from '../types/database'

const TICKET_SELECT =
  '*, category:categories(*), requester:requesters(*), assignee:profiles!tickets_assigned_to_fkey(*), project:projects(*), asset:assets(*), supplier:suppliers(*), subtasks:ticket_subtasks(*)'

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select(TICKET_SELECT)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as unknown as TicketWithRelations[]
    },
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ticket: Partial<Ticket> & { title: string }) => {
      const { data, error } = await supabase.from('tickets').insert(ticket).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  })
}

export function useUpdateTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<Ticket> }) => {
      const { data, error } = await supabase.from('tickets').update(changes).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  })
}

export function useDeleteTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tickets').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  })
}
