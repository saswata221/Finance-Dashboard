import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { MOCK_TRANSACTIONS } from '../data/mockTransactions'
import type { FilterType, Role, SortDir, SortField, Transaction } from '../types'

// Holds transactions, theme, role, filters — and everything derived (charts, totals) is memoised below.

const STORAGE_KEY = 'fd-finance-dashboard-v1'

interface PersistedShape {
  transactions: Transaction[]
  theme: 'light' | 'dark'
  role: Role
}

type Theme = 'light' | 'dark'

interface State {
  transactions: Transaction[]
  role: Role
  theme: Theme
  filterCategory: string
  filterType: FilterType
  search: string
  sortField: SortField
  sortDir: SortDir
}

type Action =
  | { type: 'ADD'; payload: Transaction }
  | { type: 'UPDATE'; payload: Transaction }
  | { type: 'DELETE'; id: string }
  | { type: 'SET_ROLE'; role: Role }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SET_FILTER_CATEGORY'; value: string }
  | { type: 'SET_FILTER_TYPE'; value: FilterType }
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'SET_SORT'; field: SortField; dir?: SortDir }
  | { type: 'RESET_DATA' }

function loadPersisted(): Partial<PersistedShape> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const p = JSON.parse(raw) as PersistedShape
    if (p && Array.isArray(p.transactions)) return p
  } catch {
    // corrupt JSON / private mode — just start fresh
  }
  return {}
}

function initialState(): State {
  const persisted = loadPersisted()
  return {
    transactions:
      persisted.transactions && persisted.transactions.length > 0
        ? persisted.transactions
        : [...MOCK_TRANSACTIONS],
    role: persisted.role ?? 'viewer',
    theme: persisted.theme ?? 'light',
    filterCategory: 'all',
    filterType: 'all',
    search: '',
    sortField: 'date',
    sortDir: 'desc',
  }
}

function reducer(state: State, action: Action): State {
  // boring but explicit — easy to grep when something breaks
  switch (action.type) {
    case 'ADD':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'UPDATE':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      }
    case 'DELETE':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.id),
      }
    case 'SET_ROLE':
      return { ...state, role: action.role }
    case 'SET_THEME':
      return { ...state, theme: action.theme }
    case 'SET_FILTER_CATEGORY':
      return { ...state, filterCategory: action.value }
    case 'SET_FILTER_TYPE':
      return { ...state, filterType: action.value }
    case 'SET_SEARCH':
      return { ...state, search: action.value }
    case 'SET_SORT':
      return {
        ...state,
        sortField: action.field,
        sortDir:
          action.dir ??
          (state.sortField === action.field && state.sortDir === 'desc' ? 'asc' : 'desc'),
      }
    case 'RESET_DATA':
      return { ...state, transactions: [...MOCK_TRANSACTIONS] }
    default:
      return state
  }
}

export interface BalancePoint {
  date: string
  balance: number
  income: number
  expense: number
}

export interface CategorySpend {
  category: string
  value: number
}

interface DashboardContextValue {
  state: State
  role: Role
  isAdmin: boolean
  theme: Theme
  filteredTransactions: Transaction[]
  summary: {
    totalBalance: number
    income: number
    expenses: number
  }
  balanceTrend: BalancePoint[]
  spendingByCategory: CategorySpend[]
  categories: string[]
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (t: Transaction) => void
  deleteTransaction: (id: string) => void
  setRole: (role: Role) => void
  setTheme: (theme: Theme) => void
  setFilterCategory: (value: string) => void
  setFilterType: (value: FilterType) => void
  setSearch: (value: string) => void
  setSort: (field: SortField) => void
  resetToMockData: () => void
  exportCsv: () => void
  exportJson: () => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

const INITIAL_BALANCE = 2400

function monthKey(iso: string) {
  return iso.slice(0, 7)
}

function buildBalanceTrend(transactions: Transaction[]): BalancePoint[] {
  // walk days in order; running balance starts at INITIAL_BALANCE
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  const byDate = new Map<string, { income: number; expense: number }>()
  for (const t of sorted) {
    const cur = byDate.get(t.date) ?? { income: 0, expense: 0 }
    if (t.type === 'income') cur.income += t.amount
    else cur.expense += t.amount
    byDate.set(t.date, cur)
  }
  const dates = [...byDate.keys()].sort()
  let running = INITIAL_BALANCE
  return dates.map((date) => {
    const { income, expense } = byDate.get(date)!
    running += income - expense
    return { date, balance: running, income, expense }
  })
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    // tailwind dark: variant keys off this class on <html>
    const root = document.documentElement
    if (state.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [state.theme])

  useEffect(() => {
    const payload: PersistedShape = {
      transactions: state.transactions,
      theme: state.theme,
      role: state.role,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* ignore */
    }
  }, [state.transactions, state.theme, state.role])

  const categories = useMemo(() => {
    const set = new Set<string>()
    state.transactions.forEach((t) => set.add(t.category))
    return ['all', ...[...set].sort()]
  }, [state.transactions])

  const filteredTransactions = useMemo(() => {
    const q = state.search.trim().toLowerCase()
    let list = state.transactions.filter((t) => {
      if (state.filterCategory !== 'all' && t.category !== state.filterCategory) return false
      if (state.filterType !== 'all' && t.type !== state.filterType) return false
      if (q) {
        const hay = `${t.description} ${t.category} ${t.type}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    list = [...list].sort((a, b) => {
      const dir = state.sortDir === 'asc' ? 1 : -1
      if (state.sortField === 'amount') return (a.amount - b.amount) * dir
      return a.date.localeCompare(b.date) * dir
    })
    return list
  }, [
    state.transactions,
    state.filterCategory,
    state.filterType,
    state.search,
    state.sortField,
    state.sortDir,
  ])

  const summary = useMemo(() => {
    let income = 0
    let expenses = 0
    for (const t of state.transactions) {
      if (t.type === 'income') income += t.amount
      else expenses += t.amount
    }
    return {
      totalBalance: INITIAL_BALANCE + income - expenses,
      income,
      expenses,
    }
  }, [state.transactions])

  const balanceTrend = useMemo(
    () => buildBalanceTrend(state.transactions),
    [state.transactions],
  )

  const spendingByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of state.transactions) {
      if (t.type !== 'expense') continue
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
    }
    return [...map.entries()]
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
  }, [state.transactions])

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    const full: Transaction = { ...t, id: crypto.randomUUID() }
    dispatch({ type: 'ADD', payload: full })
  }, [])

  const updateTransaction = useCallback((t: Transaction) => {
    dispatch({ type: 'UPDATE', payload: t })
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE', id })
  }, [])

  const setRole = useCallback((role: Role) => dispatch({ type: 'SET_ROLE', role }), [])
  const setTheme = useCallback((theme: Theme) => dispatch({ type: 'SET_THEME', theme }), [])
  const setFilterCategory = useCallback(
    (value: string) => dispatch({ type: 'SET_FILTER_CATEGORY', value }),
    [],
  )
  const setFilterType = useCallback(
    (value: FilterType) => dispatch({ type: 'SET_FILTER_TYPE', value }),
    [],
  )
  const setSearch = useCallback((value: string) => dispatch({ type: 'SET_SEARCH', value }), [])
  const setSort = useCallback((field: SortField) => dispatch({ type: 'SET_SORT', field }), [])
  const resetToMockData = useCallback(() => dispatch({ type: 'RESET_DATA' }), [])

  const exportCsv = useCallback(() => {
    const rows = filteredTransactions
    const header = 'date,amount,category,type,description'
    const body = rows
      .map((t) =>
        [t.date, t.amount, t.category, t.type, `"${t.description.replace(/"/g, '""')}"`].join(
          ',',
        ),
      )
      .join('\n')
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredTransactions])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(filteredTransactions, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredTransactions])

  const value: DashboardContextValue = {
    state,
    role: state.role,
    isAdmin: state.role === 'admin',
    theme: state.theme,
    filteredTransactions,
    summary,
    balanceTrend,
    spendingByCategory,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setRole,
    setTheme,
    setFilterCategory,
    setFilterType,
    setSearch,
    setSort,
    resetToMockData,
    exportCsv,
    exportJson,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}

/** Insights derived in one place for the insights panel */
export function useInsights() {
  const { state, summary, spendingByCategory } = useDashboard()

  return useMemo(() => {
    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`

    let thisIncome = 0
    let thisExpense = 0
    let lastIncome = 0
    let lastExpense = 0

    for (const t of state.transactions) {
      const mk = monthKey(t.date)
      if (t.type === 'income') {
        if (mk === thisMonth) thisIncome += t.amount
        if (mk === lastMonth) lastIncome += t.amount
      } else {
        if (mk === thisMonth) thisExpense += t.amount
        if (mk === lastMonth) lastExpense += t.amount
      }
    }

    const topCategory = spendingByCategory[0]
    const expenseTx = state.transactions.filter((t) => t.type === 'expense')
    const totalExpensesAll =
      expenseTx.length > 0 ? expenseTx.reduce((s, t) => s + t.amount, 0) : 0
    const avgExpense =
      expenseTx.length > 0 ? totalExpensesAll / expenseTx.length : 0

    const expenseDeltaPct =
      lastExpense > 0 ? ((thisExpense - lastExpense) / lastExpense) * 100 : null

    return {
      topCategory,
      totalExpensesAll,
      thisMonth,
      lastMonth,
      thisIncome,
      thisExpense,
      lastIncome,
      lastExpense,
      expenseDeltaPct,
      avgExpense,
      netThisMonth: thisIncome - thisExpense,
      netLastMonth: lastIncome - lastExpense,
      savingsRate:
        thisIncome > 0 ? ((thisIncome - thisExpense) / thisIncome) * 100 : null,
      transactionCount: state.transactions.length,
      totalBalance: summary.totalBalance,
    }
  }, [state.transactions, spendingByCategory, summary.totalBalance])
}
