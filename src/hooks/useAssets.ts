import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { makeCrud } from '../lib/makeCrud'
import type { Asset, AssetWithRelations } from '../types/database'

const ASSET_SELECT = '*, assignee:requesters(*)'

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data, error } = await supabase.from('assets').select(ASSET_SELECT).order('name')
      if (error) throw error
      return data as unknown as AssetWithRelations[]
    },
  })
}

const assets = makeCrud<Asset>('assets', 'assets')
export const useCreateAsset = assets.useCreate
export const useUpdateAsset = assets.useUpdate
export const useDeleteAsset = assets.useDelete
