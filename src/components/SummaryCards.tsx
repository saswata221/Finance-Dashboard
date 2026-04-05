import type { CSSProperties } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { formatInr } from '../lib/currency'

function IconBalance({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function IconIncome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  )
}

function IconExpense({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  )
}

const iconByKey = {
  balance: IconBalance,
  income: IconIncome,
  expense: IconExpense,
} as const

export function SummaryCards() {
  const { summary } = useDashboard()
  const { totalBalance, income, expenses } = summary

  const bal = useAnimatedNumber(totalBalance, 1000, 0)
  const inc = useAnimatedNumber(income, 1000, 140)
  const exp = useAnimatedNumber(expenses, 1000, 280)

  const cards = [
    {
      key: 'balance' as const,
      label: 'Total balance',
      value: formatInr(Math.round(bal)),
      hint: 'Starting balance + activity',
      accent: 'text-[var(--color-accent)]',
      bg: 'bg-[var(--color-accent-soft)]',
      iconWrap: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
      iconClass: 'summary-card-icon--balance',
    },
    {
      key: 'income' as const,
      label: 'Income',
      value: formatInr(Math.round(inc)),
      hint: 'Total credited',
      accent: 'text-[var(--color-income)]',
      bg: 'bg-emerald-100/80 dark:bg-emerald-950/40',
      iconWrap: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      iconClass: 'summary-card-icon--income',
    },
    {
      key: 'expense' as const,
      label: 'Expenses',
      value: formatInr(Math.round(exp)),
      hint: 'Total debited',
      accent: 'text-[var(--color-expense)]',
      bg: 'bg-rose-100/80 dark:bg-rose-950/40',
      iconWrap: 'bg-rose-100/90 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      iconClass: 'summary-card-icon--expense',
    },
  ]

  return (
    <section aria-label="Financial summary">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {cards.map((c, i) => {
          const Icon = iconByKey[c.key]
          return (
            <article
              key={c.key}
              className="summary-card motion-card min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
              style={{ '--motion-delay': `${i * 65}ms` } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{c.label}</p>
                  <p
                    className={`mt-2 font-mono text-xl font-semibold tracking-tight tabular-nums sm:text-2xl ${c.accent}`}
                  >
                    {c.value}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-500">{c.hint}</p>
                </div>
                <div
                  className={`summary-card-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${c.iconWrap} ${c.iconClass}`}
                  aria-hidden
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className={`mt-4 h-1 w-12 rounded-full ${c.bg}`} />
            </article>
          )
        })}
      </div>
    </section>
  )
}
