import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { useDashboard } from '../context/DashboardContext'
import type { FilterType, Transaction } from '../types'
import { formatInrDetail } from '../lib/currency'
import { TransactionModal } from './TransactionModal'

function formatShortDate(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

function formatCompactDate(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function IconIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  )
}

function IconOut({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  )
}

function IconPencil({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  )
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
}

export function TransactionsPanel() {
  const {
    filteredTransactions,
    state,
    categories,
    setFilterCategory,
    setFilterType,
    setSearch,
    setSort,
    isAdmin,
    deleteTransaction,
  } = useDashboard()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const emptyAll = state.transactions.length === 0
  const emptyFiltered = !emptyAll && filteredTransactions.length === 0

  const sortHint = useMemo(() => {
    const dir = state.sortDir === 'desc' ? '↓' : '↑'
    return state.sortField === 'date' ? `Date ${dir}` : `Amt ${dir}`
  }, [state.sortField, state.sortDir])

  function openAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(t: Transaction) {
    setEditing(t)
    setModalOpen(true)
  }

  return (
    <section
      className="motion-section min-w-0 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-shadow duration-300 hover:shadow-md"
      style={{ '--motion-delay': '260ms' } as CSSProperties}
      aria-label="Transactions"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-surface-muted)]/80 to-transparent px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <IconCalendar className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Activity</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredTransactions.length} shown
              {isAdmin ? ' · you can edit' : ''}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-[0.98] sm:self-auto"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        )}
      </div>

      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]/40 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={state.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none ring-[var(--color-accent)] transition-shadow duration-200 placeholder:text-slate-400 focus:ring-2 dark:text-slate-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={state.filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="min-w-[130px] flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm dark:text-slate-100"
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All categories' : c}
                </option>
              ))}
            </select>
            <select
              value={state.filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="min-w-[110px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm dark:text-slate-100"
              aria-label="Filter by type"
            >
              <option value="all">All types</option>
              <option value="income">In</option>
              <option value="expense">Out</option>
            </select>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSort('date')}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  state.sortField === 'date'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-slate-600 shadow-sm dark:text-slate-300'
                }`}
              >
                {state.sortField === 'date' ? sortHint : 'Date'}
              </button>
              <button
                type="button"
                onClick={() => setSort('amount')}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  state.sortField === 'amount'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-slate-600 shadow-sm dark:text-slate-300'
                }`}
              >
                {state.sortField === 'amount' ? sortHint : 'Amount'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 pb-4 pt-2 sm:px-4">
        {emptyAll ? (
          <div className="motion-empty flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <IconCalendar className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Nothing here yet</p>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {isAdmin
                ? 'Add a transaction or reset demo data from the header.'
                : 'Switch to Admin to add entries.'}
            </p>
          </div>
        ) : emptyFiltered ? (
          <div className="motion-empty rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 px-6 py-12 text-center">
            <p className="font-medium text-slate-700 dark:text-slate-200">No matches</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try clearing search or filters.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`mb-2 hidden px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:grid sm:gap-3 sm:px-3 ${
                isAdmin
                  ? 'sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)_88px_minmax(0,120px)_auto]'
                  : 'sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)_88px_minmax(0,120px)]'
              }`}
              aria-hidden
            >
              <span>Date</span>
              <span>Memo</span>
              <span className="text-center">Flow</span>
              <span className="text-right">Amount</span>
              {isAdmin && <span className="w-20" />}
            </div>
            <ul className="space-y-1.5 sm:space-y-2" role="list">
              {filteredTransactions.map((t, rowIndex) => {
                const isIn = t.type === 'income'
                return (
                  <li
                    key={t.id}
                    className="motion-row-in list-none"
                    style={
                      { '--motion-delay': `${Math.min(rowIndex, 18) * 24}ms` } as CSSProperties
                    }
                  >
                    <div
                      className={`group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition-all duration-200 hover:border-[var(--color-accent)]/25 hover:shadow-md sm:rounded-2xl ${
                        isIn ? 'ring-1 ring-emerald-500/15' : 'ring-1 ring-rose-500/15'
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-0.5 sm:w-1 ${isIn ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        aria-hidden
                      />
                      <div
                        className={[
                          'grid items-center gap-x-2 gap-y-0 py-2 pl-3 pr-2 sm:gap-3 sm:px-4 sm:py-4 sm:pl-5',
                          isAdmin
                            ? 'max-sm:grid-cols-[minmax(0,3.1rem)_minmax(0,1fr)_1.75rem_auto_auto] sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)_88px_minmax(0,120px)_auto]'
                            : 'max-sm:grid-cols-[minmax(0,3.1rem)_minmax(0,1fr)_1.75rem_auto] sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)_88px_minmax(0,120px)]',
                        ].join(' ')}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex ${
                              isIn
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            }`}
                          >
                            <IconCalendar className="h-4 w-4 opacity-90" />
                          </span>
                          <time
                            dateTime={t.date}
                            className="text-[11px] font-semibold leading-tight tabular-nums text-slate-800 sm:text-sm dark:text-slate-100"
                          >
                            <span className="sm:hidden">{formatCompactDate(t.date)}</span>
                            <span className="hidden sm:inline">{formatShortDate(t.date)}</span>
                          </time>
                        </div>

                        <div className="min-w-0">
                          <p
                            className="truncate text-xs font-medium leading-snug text-slate-900 sm:hidden dark:text-slate-100"
                            title={`${t.description} · ${t.category}`}
                          >
                            {t.description}{' '}
                            <span className="font-normal text-slate-500 dark:text-slate-400">
                              · {t.category}
                            </span>
                          </p>
                          <div className="hidden min-w-0 sm:block">
                            <div className="flex min-w-0 items-center gap-2">
                              <p
                                className="min-w-0 flex-1 truncate text-sm font-medium leading-snug text-slate-900 dark:text-slate-100"
                                title={t.description}
                              >
                                {t.description}
                              </p>
                              <span
                                className="inline-flex max-w-[38%] shrink-0 truncate rounded-lg bg-slate-100 px-2 py-0.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:max-w-[min(12rem,45%)]"
                                title={t.category}
                              >
                                {t.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full sm:hidden ${
                              isIn
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                            }`}
                            aria-label={isIn ? 'Income' : 'Expense'}
                          >
                            {isIn ? (
                              <IconIn className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                              <IconOut className="h-3.5 w-3.5 shrink-0" />
                            )}
                          </span>
                          <span
                            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${
                              isIn
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                            }`}
                          >
                            {isIn ? (
                              <IconIn className="h-3.5 w-3.5" />
                            ) : (
                              <IconOut className="h-3.5 w-3.5" />
                            )}
                            {isIn ? 'In' : 'Out'}
                          </span>
                        </div>

                        <div className="min-w-0 text-right">
                          <span
                            className={`whitespace-nowrap font-mono text-xs font-bold tabular-nums tracking-tight sm:text-lg ${
                              isIn
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isIn ? '+' : '−'}
                            {formatInrDetail(t.amount)}
                          </span>
                        </div>

                        {isAdmin && (
                          <div className="flex justify-end gap-0.5 sm:gap-1.5 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                            <button
                              type="button"
                              onClick={() => openEdit(t)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)] sm:h-10 sm:w-10 sm:rounded-xl"
                              title="Edit"
                            >
                              <IconPencil className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Delete this transaction?')) deleteTransaction(t.id)
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 sm:h-10 sm:w-10 sm:rounded-xl"
                              title="Delete"
                            >
                              <IconTrash className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        initial={editing}
      />
    </section>
  )
}
