import type { CSSProperties } from 'react'
import { BalanceTrendChart } from './components/BalanceTrendChart'
import { Header } from './components/Header'
import { InsightsPanel } from './components/InsightsPanel'
import { SpendingBreakdownChart } from './components/SpendingBreakdownChart'
import { SummaryCards } from './components/SummaryCards'
import { TransactionsPanel } from './components/TransactionsPanel'
import { DashboardProvider } from './context/DashboardContext'

// page layout only; real data + logic sit inside DashboardProvider
export default function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen min-w-0 max-w-[100vw] pb-12 sm:pb-16">
        <Header />
        <main className="mx-auto min-w-0 max-w-6xl space-y-6 px-3 py-6 sm:space-y-8 sm:px-6 sm:py-8">
          <SummaryCards />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="motion-section" style={{ '--motion-delay': '100ms' } as CSSProperties}>
              <BalanceTrendChart />
            </div>
            <div className="motion-section" style={{ '--motion-delay': '160ms' } as CSSProperties}>
              <SpendingBreakdownChart />
            </div>
          </div>
          <InsightsPanel />
          <TransactionsPanel />
        </main>
        <footer
          className="motion-footer mx-auto min-w-0 max-w-6xl px-3 pb-6 text-center text-xs text-slate-500 dark:text-slate-500 sm:px-6 sm:pb-8"
          style={{ '--motion-delay': '320ms' } as CSSProperties}
        >
          Mock data for evaluation — state persists in localStorage (transactions, role, theme).
        </footer>
      </div>
    </DashboardProvider>
  )
}
