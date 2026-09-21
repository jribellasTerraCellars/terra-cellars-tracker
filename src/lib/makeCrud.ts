import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { supabase } from './supabaseClient'

export type NewRow<T> = Partial<T> & { name: string }

// keysFor: query keys to refresh for a given row (default: the whole table key).
// ponytail: TNew defaults to NewRow<T> (requires `name`); pass an explicit TNew for tables without it (e.g. map_pin_ports) when a hook needs create.
export function makeCrud<T extends { id: string }, TNew = NewRow<T>>(
  table: string,
  key: string,
  keysFor: (row: T) => QueryKey[] = () => [[key]],
) {
  const useRefresh = () => {
    const queryClient = useQueryClient()
    return (keys: QueryKey[]) => Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
  }

  return {
    useCreate() {
      const refresh = useRefresh()
      return useMutation({
        mutationFn: async (row: TNew) => {
          const { data, error } = await supabase.from(table).insert(row as never).select().single()
          if (error) throw error
          return data as T
        },
        onSuccess: (row) => refresh(keysFor(row)),
      })
    },
    useUpdate() {
      const refresh = useRefresh()
      return useMutation({
        mutationFn: async ({ id, changes }: { id: string; changes: Partial<T> }) => {
          const { data, error } = await supabase.from(table).update(changes as never).eq('id', id).select().single()
          if (error) throw error
          return data as T
        },
        onSuccess: (row) => refresh(keysFor(row)),
      })
    },
    // ponytail: useDelete ignores keysFor (only refreshes [key]); use useDeleteRow for scoped/composite keys, or make it honour keysFor when a new hook needs id-based delete with them.
    useDelete() {
      const refresh = useRefresh()
      return useMutation({ mutationFn: remove, onSuccess: () => refresh([[key]]) })
    },
    useDeleteRow() {
      const refresh = useRefresh()
      return useMutation({ mutationFn: (row: T) => remove(row.id), onSuccess: (_, row) => refresh(keysFor(row)) })
    },
  }
}
