import { useMemo } from 'react'
import { format, startOfWeek, subWeeks } from 'date-fns'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTickets } from '../hooks/useTickets'

const WEEKS_TO_SHOW = 10

export function Stats() {
  const { data: tickets, isLoading } = useTickets()

  const completedByWeek = useMemo(() => {
    const weeks: { week: string; label: string; count: number }[] = []
    for (let i = WEEKS_TO_SHOW - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
      weeks.push({ week: format(weekStart, 'yyyy-MM-dd'), label: format(weekStart, 'dd/MM'), count: 0 })
    }
    const weekMap = new Map(weeks.map((w) => [w.week, w]))

    tickets?.forEach((ticket) => {
      if (!ticket.completed_at) return
      const weekStart = format(startOfWeek(new Date(ticket.completed_at), { weekStartsOn: 1 }), 'yyyy-MM-dd')
      const bucket = weekMap.get(weekStart)
      if (bucket) bucket.count += 1
    })

    return weeks
  }, [tickets])

  const topRequesters = useMemo(() => {
    const counts = new Map<string, number>()
    tickets?.forEach((ticket) => {
      const name = ticket.requester?.name ?? 'Sense especificar'
      counts.set(name, (counts.get(name) ?? 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [tickets])

  const openCount = tickets?.filter((t) => t.status !== 'fet' && t.status !== 'cancelat').length ?? 0
  const doneCount = tickets?.filter((t) => t.status === 'fet').length ?? 0
  const totalCount = tickets?.length ?? 0
  const donePercent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0

  if (isLoading) {
    return <p className="text-sm text-[var(--color-text-muted)]">Carregant...</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Estadístiques</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Oberts" value={openCount} />
        <StatCard label="Completats" value={doneCount} />
        <StatCard label="% completat (total)" value={`${donePercent}%`} />
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="mb-4 text-sm font-semibold">Tasques completades per setmana</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={completedByWeek}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', fontSize: 12 }}
            />
            <Bar dataKey="count" name="Completades" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <h2 className="mb-4 text-sm font-semibold">Usuaris que més incidències/tasques obren</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topRequesters} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', fontSize: 12 }}
            />
            <Bar dataKey="count" name="Tickets" fill="var(--color-info)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}
