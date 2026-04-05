import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CATEGORY_OPTIONS } from '../data/mockTransactions'
import { useDashboard } from '../context/DashboardContext'
import type { Transaction, TransactionType } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  initial?: Transaction | null
}

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: 'Food',
  type: 'expense' as TransactionType,
  description: '',
}

export function TransactionModal({ open, onClose, initial }: Props) {
  const { addTransaction, updateTransaction } = useDashboard()
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          date: initial.date,
          amount: String(initial.amount),
          category: initial.category,
          type: initial.type,
          description: initial.description,
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, initial])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const amount = Number.parseFloat(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) return

    const payload = {
      date: form.date,
      amount,
      category: form.category,
      type: form.type,
      description: form.description.trim() || '—',
    }

    if (initial) {
      updateTransaction({ ...payload, id: initial.id })
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
    >
      <button
        type="button"
        className="motion-modal-backdrop absolute inset-0 cursor-default bg-slate-900/50"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="motion-modal-panel relative z-10 w-full max-h-[min(100dvh-2rem,720px)] max-w-md overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl sm:max-h-none sm:overflow-visible sm:p-6">
        <h2 id="tx-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
          {initial ? 'Edit transaction' : 'New transaction'}
        </h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-slate-600 dark:text-slate-400">Date</span>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-slate-900 transition-shadow duration-200 focus:ring-2 focus:ring-[var(--color-accent)] dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600 dark:text-slate-400">Amount</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 font-mono text-sm text-slate-900 transition-shadow duration-200 focus:ring-2 focus:ring-[var(--color-accent)] dark:text-slate-100"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Type</span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value as TransactionType }))
              }
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-slate-900 transition-shadow duration-200 focus:ring-2 focus:ring-[var(--color-accent)] dark:text-slate-100"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-slate-900 transition-shadow duration-200 focus:ring-2 focus:ring-[var(--color-accent)] dark:text-slate-100"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600 dark:text-slate-400">Description</span>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-slate-900 transition-shadow duration-200 focus:ring-2 focus:ring-[var(--color-accent)] dark:text-slate-100"
              placeholder="What was this for?"
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-[var(--color-surface-muted)] active:scale-95 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              {initial ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
