const AVATAR_PALETTE = ['#5C1F2E', '#2563A6', '#2F6F5E', '#B7791F', '#B3261E', '#2F7D4F', '#6B4C9A', '#2B3A45']

function colorFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

const SIZE_CLASSES = {
  xs: 'h-5 w-5 text-[10px]',
  sm: 'h-6 w-6 text-[11px]',
  md: 'h-9 w-9 text-sm',
}

export function Avatar({ name, size = 'sm' }: { name?: string | null; size?: keyof typeof SIZE_CLASSES }) {
  const trimmed = name?.trim()
  const initial = trimmed ? trimmed[0].toUpperCase() : '?'
  const color = colorFor(trimmed || '?')

  return (
    <span
      title={trimmed || 'Sense assignar'}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZE_CLASSES[size]}`}
      style={{ backgroundColor: `${color}26`, color }}
    >
      {initial}
    </span>
  )
}
