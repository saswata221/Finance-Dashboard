import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useDashboard } from '../context/DashboardContext'
import { formatInr } from '../lib/currency'

// slice colours — cycle if there are loads of categories
const COLORS = [
  'oklch(0.55 0.2 25)',
  'oklch(0.55 0.18 250)',
  'oklch(0.55 0.16 300)',
  'oklch(0.55 0.14 200)',
  'oklch(0.6 0.12 145)',
  'oklch(0.58 0.14 75)',
  'oklch(0.5 0.08 260)',
  'oklch(0.55 0.12 30)',
]

// expenses only, rolled up by category (biggest slice first in the data)
export function SpendingBreakdownChart() {
  const { spendingByCategory } = useDashboard()
  const total = spendingByCategory.reduce((s, c) => s + c.value, 0)
  const [activeIndex, setActiveIndex] = useState<number | undefined>()
  const [chartHover, setChartHover] = useState(false)

  if (spendingByCategory.length === 0) {
    return (
      <div className="motion-empty flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-slate-500">
        No expense data yet. Expenses will appear here by category.
      </div>
    )
  }

  return (
    <section
      className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-all duration-300 hover:border-rose-400/25 hover:shadow-[0_12px_40px_-16px_rgba(244,63,94,0.2)] sm:p-5 dark:hover:shadow-[0_12px_40px_-16px_rgba(251,113,133,0.12)]"
      aria-label="Spending by category"
    >
      <div className="mb-2">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Spending breakdown
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          By category · total {formatInr(total)}
        </p>
      </div>
      <div className="flex min-w-0 flex-col items-center gap-4 lg:flex-row lg:items-center">
        <div
          className={`h-48 w-full min-w-0 max-w-xs rounded-xl bg-gradient-to-b from-rose-500/10 to-transparent px-0 pt-1 transition-[background,transform] duration-300 sm:h-56 sm:px-1 dark:from-rose-500/15 ${chartHover ? 'scale-[1.02]' : 'scale-100'}`}
          onMouseEnter={() => setChartHover(true)}
          onMouseLeave={() => {
            setChartHover(false)
            setActiveIndex(undefined)
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingByCategory}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                animationDuration={1000}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {spendingByCategory.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke="var(--color-surface)"
                    strokeWidth={activeIndex === i ? 3 : 1}
                    opacity={activeIndex === undefined || activeIndex === i ? 1 : 0.48}
                    style={{
                      transition: 'opacity 0.2s ease, stroke-width 0.2s ease, filter 0.2s ease',
                      filter:
                        activeIndex === i
                          ? 'drop-shadow(0 8px 18px rgba(0,0,0,0.2)) brightness(1.06)'
                          : 'none',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatInr(Number(value ?? 0))}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  boxShadow: '0 10px 40px -12px rgba(0,0,0,0.2)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex w-full flex-1 flex-wrap gap-2 text-sm">
          {spendingByCategory.map((c, i) => (
            <li
              key={c.category}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(undefined)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(undefined)}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
                activeIndex === i
                  ? 'scale-[1.03] border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-md'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] hover:scale-[1.02] hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/50 dark:ring-black/20"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="font-medium text-slate-800 dark:text-slate-100">{c.category}</span>
              <span className="font-mono text-slate-600 tabular-nums dark:text-slate-400">
                {formatInr(c.value)}
              </span>
              <span className="text-xs tabular-nums text-slate-500">
                {total > 0 ? Math.round((c.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
