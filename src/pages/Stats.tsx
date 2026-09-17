import { useMemo, useState } from 'react'
import {
  addMonths,
  addWeeks,
  addYears,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'
import { ca } from 'date-fns/locale'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTickets } from '../hooks/useTickets'
import type { TicketWithRelations } from '../types/database'

type Period = 'setmana' | 'mes' | 'any'

const PERIOD_LABELS: Record<Period, string> = { setmana: 'Setmana', mes: 'Mes', any: 'Any' }

function completedOn(tickets: TicketWithRelations[], day: Date) {
  return tickets.filter((t) => t.completed_at && isSameDayLocal(new Date(t.completed_at), day)).length
}

function isSameDayLocal(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Stats() {
  const { data: tickets, isLoading } = useTickets()
  const [period, setPeriod] = useState<Period>('setmana')
  const [anchor, setAnchor] = useState(new Date())

  const navigate = (direction: 1 | -1) => {
    if (period === 'setmana') setAnchor((d) => (direction === 1 ? addWeeks(d, 1) : subWeeks(d, 1)))
    else if (period === 'mes') setAnchor((d) => (direction === 1 ? addMonths(d, 1) : subMonths(d, 1)))
    else setAnchor((d) => (direction === 1 ? addYears(d, 1) : subYears(d, 1)))
  }

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

  if (isLoading || !tickets) {
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Activitat completada</h2>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-[var(--color-border)] p-0.5">
              {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded px-3 py-1.5 text-sm font-medium ${
                    period === p ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setAnchor(new Date())}
              className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]"
            >
              Avui
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-[var(--color-border)] px-2 py-1 text-sm hover:bg-[var(--color-surface-alt)]"
            aria-label="Període anterior"
          >
            ‹
          </button>
          <p className="min-w-[180px] text-center text-sm font-medium capitalize">
            <PeriodLabel period={period} anchor={anchor} />
          </p>
          <button
            onClick={() => navigate(1)}
            className="rounded-md border border-[var(--color-border)] px-2 py-1 text-sm hover:bg-[var(--color-surface-alt)]"
            aria-label="Període següent"
          >
            ›
          </button>
        </div>

        {period === 'setmana' && <WeekView tickets={tickets} anchor={anchor} />}
        {period === 'mes' && <MonthView tickets={tickets} anchor={anchor} />}
        {period === 'any' && <YearView tickets={tickets} anchor={anchor} />}
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

function PeriodLabel({ period, anchor }: { period: Period; anchor: Date }) {
  if (period === 'setmana') {
    const start = startOfWeek(anchor, { weekStartsOn: 1 })
    const end = endOfWeek(anchor, { weekStartsOn: 1 })
    return <>{format(start, 'd MMM', { locale: ca })} – {format(end, 'd MMM yyyy', { locale: ca })}</>
  }
  if (period === 'mes') {
    return <>{format(anchor, 'MMMM yyyy', { locale: ca })}</>
  }
  return <>{format(anchor, 'yyyy')}</>
}

function WeekView({ tickets, anchor }: { tickets: TicketWithRelations[]; anchor: Date }) {
  const start = startOfWeek(anchor, { weekStartsOn: 1 })
  const end = endOfWeek(anchor, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  const data = days.map((day) => ({
    label: format(day, 'EEE d', { locale: ca }),
    count: completedOn(tickets, day),
    today: isToday(day),
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', fontSize: 12 }} />
        <Bar dataKey="count" name="Completades" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function MonthView({ tickets, anchor }: { tickets: TicketWithRelations[]; anchor: Date }) {
  const monthStart = startOfMonth(anchor)
  const monthEnd = endOfMonth(anchor)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const weekdayLabels = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg']

  const chartData = eachDayOfInterval({ start: monthStart, end: monthEnd }).map((day) => ({
    label: format(day, 'd'),
    count: completedOn(tickets, day),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--color-text-muted)]">
          {weekdayLabels.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const count = completedOn(tickets, day)
            const inMonth = isSameMonth(day, anchor)
            return (
              <div
                key={day.toISOString()}
                className={`flex aspect-square flex-col items-center justify-center rounded-md border text-xs ${
                  inMonth ? 'border-[var(--color-border)]' : 'border-transparent text-[var(--color-text-muted)] opacity-40'
                } ${isToday(day) ? 'ring-2 ring-[var(--color-primary)]' : ''}`}
              >
                <span>{format(day, 'd')}</span>
                {count > 0 && (
                  <span className="mt-0.5 rounded-full bg-[var(--color-primary-soft)] px-1.5 text-[10px] font-medium text-[var(--color-primary)]">
                    {count}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} interval={1} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', fontSize: 12 }} />
          <Bar dataKey="count" name="Completades" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function YearView({ tickets, anchor }: { tickets: TicketWithRelations[]; anchor: Date }) {
  const start = startOfYear(anchor)
  const end = endOfYear(anchor)
  const months = eachMonthOfInterval({ start, end })

  const data = months.map((month) => ({
    label: format(month, 'MMM', { locale: ca }),
    count: tickets.filter(
      (t) => t.completed_at && isSameMonth(new Date(t.completed_at), month) && new Date(t.completed_at).getFullYear() === month.getFullYear(),
    ).length,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', fontSize: 12 }} />
        <Bar dataKey="count" name="Completades" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
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
