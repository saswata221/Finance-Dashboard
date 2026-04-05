import type { CSSProperties } from 'react'
import { useInsights } from '../context/DashboardContext'
import { formatInr } from '../lib/currency'

function IconTrendUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function IconTrendDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
}

function IconWallet({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  )
}

function IconPie({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
      />
    </svg>
  )
}

function IconSpark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a1.5 1.5 0 00-1.09-1.091L13.5 18.75l1.183-.394a1.5 1.5 0 001.091-1.091L16.5 15.75l.394 1.183a1.5 1.5 0 001.091 1.091L19.5 18.75l-1.183.394a1.5 1.5 0 00-1.091 1.091z" />
    </svg>
  )
}

function IconAvgBars({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10M12 20V4M20 20v-6" />
    </svg>
  )
}

function IconStackList({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h9M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

export function InsightsPanel() {
  const i = useInsights()

  const momUp = i.expenseDeltaPct !== null && i.expenseDeltaPct > 0
  const momDown = i.expenseDeltaPct !== null && i.expenseDeltaPct < 0
  const momPct =
    i.expenseDeltaPct !== null ? Math.abs(Math.round(i.expenseDeltaPct)) : null

  const savingsPct = i.savingsRate !== null ? Math.min(100, Math.max(0, i.savingsRate)) : null

  return (
    <section
      aria-label="Insights"
      className="motion-section min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-shadow duration-300 hover:shadow-md"
      style={{ '--motion-delay': '200ms' } as CSSProperties}
    >
      <div className="border-b border-[var(--color-border)] bg-gradient-to-r from-violet-500/[0.07] via-transparent to-fuchsia-500/[0.07] px-4 py-3.5 dark:from-violet-500/10 dark:to-fuchsia-500/10 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <IconSpark className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Insights</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Visual snapshot · this month</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:gap-4 sm:p-5 lg:grid-cols-12">
        {/* Hero: top category */}
        <div className="relative lg:col-span-7">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl dark:bg-rose-400/10" />
          <div className="relative flex h-full flex-col justify-between rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50/90 to-white p-5 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-[var(--color-surface-muted)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-300">
                <IconPie className="h-6 w-6 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700/80 dark:text-rose-200/90">
                  Top spend
                </span>
              </div>
              {i.topCategory && (
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 shadow-sm dark:bg-black/30 dark:text-rose-100">
                  Expenses
                </span>
              )}
            </div>
            {i.topCategory ? (
              <>
                <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {i.topCategory.category}
                </p>
                <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                  {formatInr(i.topCategory.value)}
                </p>
                <div className="mt-4 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-rose-200/60 dark:bg-rose-900/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-700"
                    style={{
                      width: `${i.totalExpensesAll > 0 ? Math.min(100, (i.topCategory.value / i.totalExpensesAll) * 100) : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Share of all recorded expenses
                </p>
              </>
            ) : (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                Add expenses to see your top category here.
              </p>
            )}
          </div>
        </div>

        {/* Side metrics */}
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <div
            className={`flex items-center gap-4 rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 ${
              momUp
                ? 'border-rose-200 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/30'
                : momDown
                  ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/30'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-muted)]'
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                momUp
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  : momDown
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-500/10 text-slate-500'
              }`}
            >
              {momUp ? (
                <IconTrendUp className="h-6 w-6" />
              ) : momDown ? (
                <IconTrendDown className="h-6 w-6" />
              ) : (
                <IconTrendUp className="h-6 w-6 opacity-40" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                vs last month
              </p>
              <p className="mt-0.5 font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {momPct !== null ? `${momPct}%` : '—'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {i.expenseDeltaPct !== null
                  ? `${momUp ? 'Higher' : momDown ? 'Lower' : 'Same'} spend`
                  : 'Need prior month data'}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 ${
              i.netThisMonth >= 0
                ? 'border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/25'
                : 'border-rose-200/80 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/25'
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                i.netThisMonth >= 0
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              <IconWallet className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Net · this month
              </p>
              <p
                className={`mt-0.5 truncate font-mono text-2xl font-bold tabular-nums ${
                  i.netThisMonth >= 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                {formatInr(Math.round(i.netThisMonth))}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                In {formatInr(Math.round(i.thisIncome))} · Out{' '}
                {formatInr(Math.round(i.thisExpense))}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row: savings bar + compact stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-12">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 lg:col-span-7">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Savings rate
              </p>
              {savingsPct !== null && (
                <span className="font-mono text-lg font-bold tabular-nums text-[var(--color-accent)]">
                  {Math.round(savingsPct)}%
                </span>
              )}
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-violet-400 transition-[width] duration-700 ease-out"
                style={{ width: `${savingsPct ?? 0}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
              Income left after expenses · {i.thisMonth}
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-amber-800/50 dark:from-amber-950/50 dark:via-orange-950/35 dark:to-[var(--color-surface-muted)]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/25 blur-2xl dark:bg-amber-500/15" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 shadow-inner dark:bg-amber-500/25 dark:text-amber-200">
                  <IconAvgBars className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-900/75 dark:text-amber-100/90">
                    Avg expense
                  </p>
                  <p className="mt-0.5 font-mono text-xl font-bold tabular-nums tracking-tight text-amber-950 dark:text-amber-50 sm:text-2xl">
                    {formatInr(Math.round(i.avgExpense))}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-amber-800/70 dark:text-amber-200/70">
                    Across all expense entries
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-violet-200/90 bg-gradient-to-br from-violet-50 via-fuchsia-50/70 to-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-violet-800/50 dark:from-violet-950/45 dark:via-fuchsia-950/30 dark:to-[var(--color-surface-muted)]">
              <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-violet-400/20 blur-2xl dark:bg-violet-500/12" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-700 shadow-inner dark:bg-violet-500/25 dark:text-violet-200">
                  <IconStackList className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-violet-900/80 dark:text-violet-100/90">
                    Transactions
                  </p>
                  <p className="mt-0.5 font-mono text-xl font-bold tabular-nums tracking-tight text-violet-950 dark:text-violet-50 sm:text-2xl">
                    {i.transactionCount}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-violet-800/75 dark:text-violet-200/70">
                    Total in your activity list
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
