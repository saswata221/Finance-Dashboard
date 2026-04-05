import { useDashboard } from '../context/DashboardContext'
import type { Role } from '../types'

export function Header() {
  const { role, setRole, theme, setTheme, isAdmin, exportCsv, exportJson, resetToMockData } =
    useDashboard()

  return (
    <header className="motion-header sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex min-w-0 max-w-full items-center gap-2 sm:gap-3">
          <div
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 ${
              theme === 'light'
                ? 'h-10 min-w-10 max-w-[5rem] px-1   sm:max-w-[5.5rem]'
                : 'h-10 w-10'
            }`}
          >
            {theme === 'light' ? (
              <img
                src="/logo-light.png"
                alt=""
                width={88}
                height={40}
                decoding="async"
                aria-hidden
                className="h-9 w-auto max-h-9 max-w-full object-contain object-center"
              />
            ) : (
              <img
                src="/logo-dark.png"
                alt=""
                width={60}
                height={40}
                decoding="async"
                aria-hidden
                className="h-7 w-auto max-w-none object-cover object-right"
              />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg dark:text-white">
              Finance Dashboard
            </h1>
            <p className="line-clamp-1 text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">
              Track activity, spending, and trends
            </p>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
          <span
            className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-300 sm:inline ${
              isAdmin
                ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {isAdmin ? 'Admin — can edit' : 'Viewer — read only'}
          </span>

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="sr-only">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-[var(--color-accent)] transition-shadow duration-200 focus:ring-2 dark:text-slate-100"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-slate-600 transition-all duration-200 hover:bg-[var(--color-accent-soft)] active:scale-95 dark:text-slate-300"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <div className="flex gap-1 border-l border-[var(--color-border)] pl-2 sm:pl-3">
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[var(--color-accent-soft)] active:scale-95 dark:text-slate-300"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={exportJson}
              className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-[var(--color-accent-soft)] active:scale-95 dark:text-slate-300"
            >
              JSON
            </button>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all transactions to the built-in demo data?')) resetToMockData()
              }}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 transition-colors duration-200 hover:bg-amber-100 active:scale-[0.98] dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
            >
              Reset demo
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
