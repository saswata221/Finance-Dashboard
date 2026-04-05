import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDashboard } from '../context/DashboardContext'
import { formatInr, formatInrShort } from '../lib/currency'

// X-axis wants something readable — "3 mar" not "03-03"
function formatTrendDayMonth(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  const day = d.getDate()
  const mon = d.toLocaleDateString('en-IN', { month: 'short' }).toLowerCase()
  return `${day} ${mon}`
}

export function BalanceTrendChart() {
  const { balanceTrend } = useDashboard()
  const [chartHover, setChartHover] = useState(false)

  if (balanceTrend.length === 0) {
    return (
      <div className="motion-empty flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-slate-500">
        Add transactions to see balance over time.
      </div>
    )
  }

  // each point = one calendar day that has transactions; balance is cumulative
  const data = balanceTrend.map((d) => ({
    ...d,
    label: formatTrendDayMonth(d.date),
  }))

  return (
    <section
      className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-all duration-300 hover:border-[var(--color-accent)]/35 hover:shadow-[0_12px_40px_-16px_rgba(59,130,246,0.35)] sm:p-5 dark:hover:shadow-[0_12px_40px_-16px_rgba(96,165,250,0.18)]"
      aria-label="Balance trend"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Balance trend</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Running balance after each day with activity
          </p>
        </div>
      </div>
      <div
        className="h-52 w-full min-w-0 cursor-crosshair rounded-xl bg-gradient-to-b from-[var(--color-accent-soft)]/25 to-transparent px-0 pt-1 transition-[background,box-shadow] duration-300 sm:h-64 sm:px-1 dark:from-[var(--color-accent)]/10 dark:to-transparent"
        onMouseEnter={() => setChartHover(true)}
        onMouseLeave={() => setChartHover(false)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 transition-opacity duration-300 dark:stroke-slate-700"
              opacity={chartHover ? 0.85 : 0.65}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-slate-500"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-slate-500"
              tickFormatter={(v) => formatInrShort(Number(v))}
            />
            <Tooltip
              cursor={{
                stroke: 'oklch(0.55 0.18 250)',
                strokeWidth: chartHover ? 2 : 1,
                strokeDasharray: '5 5',
                opacity: 0.9,
              }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                boxShadow: '0 10px 40px -12px rgba(0,0,0,0.2)',
                transition: 'transform 0.15s ease',
              }}
              formatter={(value) => [formatInr(Number(value ?? 0)), 'Balance']}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as { date?: string } | undefined
                const raw = p?.date
                return raw ? formatTrendDayMonth(raw) : ''
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="oklch(0.55 0.18 250)"
              strokeWidth={chartHover ? 3.5 : 2.2}
              dot={{
                r: chartHover ? 4 : 3,
                fill: 'oklch(0.55 0.18 250)',
                strokeWidth: 2,
                stroke: 'var(--color-surface)',
                className: 'transition-all duration-200',
              }}
              activeDot={{
                r: chartHover ? 9 : 7,
                strokeWidth: 2,
                stroke: '#fff',
                fill: 'oklch(0.45 0.22 250)',
                style: { filter: 'drop-shadow(0 2px 8px rgba(59,130,246,0.5))' },
              }}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
