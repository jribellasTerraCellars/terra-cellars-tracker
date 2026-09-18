import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { UptimeDay } from '../types/database'

export function useUptimeDaily(days = 14) {
  return useQuery({
    queryKey: ['uptime_daily', days],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uptime_daily')
        .select('*')
        .order('day', { ascending: false })
        .limit(days)
      if (error) throw error
      return (data as UptimeDay[]).reverse()
    },
  })
}
