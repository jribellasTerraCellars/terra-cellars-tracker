import { useMemo, useState } from 'react'
import { useAssets } from '../hooks/useAssets'
import { AssetModal } from '../components/AssetModal'
import { ASSET_STATUS_LABELS, ASSET_TYPE_LABELS } from '../lib/constants'
import type { AssetWithRelations } from '../types/database'

export function Assets() {
  const { data: assets, isLoading } = useAssets()
  const [selected, setSelected] = useState<AssetWithRelations | undefined>(undefined)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!assets) return []
    const term = search.trim().toLowerCase()
    if (!term) return assets
    return assets.filter((a) =>
      [a.name, a.brand, a.model, a.serial_number, a.location, a.ip_address]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term)),
    )
  }, [assets, search])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Inventari d'actius</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Servidors, PCs, impressores, NVR i equips de xarxa.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cercar..."
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
          />
          <button
            onClick={() => setCreating(true)}
            className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-contrast)] hover:opacity-90"
          >
            + Nou actiu
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Carregant...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-2 font-medium">Nom</th>
                <th className="px-4 py-2 font-medium">Tipus</th>
                <th className="px-4 py-2 font-medium">Estat</th>
                <th className="px-4 py-2 font-medium">Ubicació</th>
                <th className="px-4 py-2 font-medium">IP</th>
                <th className="px-4 py-2 font-medium">Assignat a</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelected(asset)}
                  className="cursor-pointer hover:bg-[var(--color-surface-alt)]"
                >
                  <td className="px-4 py-2 font-medium">{asset.name}</td>
                  <td className="px-4 py-2 text-[var(--color-text-muted)]">{ASSET_TYPE_LABELS[asset.type]}</td>
                  <td className="px-4 py-2 text-[var(--color-text-muted)]">{ASSET_STATUS_LABELS[asset.status]}</td>
                  <td className="px-4 py-2 text-[var(--color-text-muted)]">{asset.location ?? '—'}</td>
                  <td className="px-4 py-2 text-[var(--color-text-muted)]">{asset.ip_address ?? '—'}</td>
                  <td className="px-4 py-2 text-[var(--color-text-muted)]">{asset.assignee?.name ?? '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
                    No hi ha actius {search ? 'que coincideixin amb la cerca' : 'registrats encara'}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && <AssetModal asset={selected} onClose={() => setSelected(undefined)} />}
      {creating && <AssetModal onClose={() => setCreating(false)} />}
    </div>
  )
}
