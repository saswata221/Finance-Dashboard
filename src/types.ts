export type TransactionType = 'income' | 'expense'

export type Role = 'viewer' | 'admin'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  description: string
}

export type SortField = 'date' | 'amount'
export type SortDir = 'asc' | 'desc'
export type FilterType = 'all' | TransactionType
