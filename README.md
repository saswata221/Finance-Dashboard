# Finance Dashboard

A small **React + TypeScript + Tailwind CSS** dashboard for tracking a personal finance snapshot: summary cards, trend and category charts, filterable transactions, role-based UI, and derived insights. Data is **mock/static** with optional **localStorage** persistence—no backend.

## Setup

Requirements: **Node.js 18+** and npm.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

```bash
npm run build    # production build to dist/
npm run preview  # serve production build locally
```

## Approach

- **Stack**: Vite, React 19, Tailwind CSS v4 (`@tailwindcss/vite`), [Recharts](https://recharts.org/) for charts.
- **State**: A single `useReducer` plus React Context (`DashboardProvider`) holds transactions, filters (category, type, search), sort (date/amount and direction), **role** (`viewer` | `admin`), and **theme**. Derived values (filtered list, summary totals, chart series, insights) are computed with `useMemo`.
- **Persistence**: On change, transactions, role, and theme are saved under `localStorage` key `fd-finance-dashboard-v1`. Clearing site data or using **Reset demo** (admin) restores the built-in mock dataset.
- **RBAC (simulated)**: **Viewer** sees all data but cannot add, edit, or delete transactions. **Admin** can add/edit (modal form) and delete, and can reset to demo data. Switch roles from the header dropdown.

## Features (assignment mapping)

| Requirement | Implementation |
|-------------|----------------|
| Summary cards | Total balance (starting balance + net flow), total income, total expenses |
| Time-based chart | Line chart: running balance by date |
| Category chart | Donut-style pie: expenses by category |
| Transactions | Table: date, description, category, type, amount; search + category/type filters; sort by date or amount (toggle direction) |
| Role UI | Header role select + read-only vs edit affordances |
| Insights | Top expense category, month-over-month expense %, net flow, savings rate, average expense size |
| UX | Responsive layout, dark mode toggle, empty states (no data / no filter matches), CSV & JSON export of the **currently filtered** list |

## Project structure (high level)

- `src/context/DashboardContext.tsx` — reducer, persistence, selectors, export helpers, `useInsights`
- `src/data/mockTransactions.ts` — seed transactions and category list
- `src/components/` — layout sections (header, cards, charts, insights, transactions, modal)

## Assumptions

- Currency display uses `Intl.NumberFormat` with **USD**; amounts are plain numbers in mock data.
- **Starting balance** for the trend line is a fixed mock constant (`2400`) so the chart shows a sensible running total before the first dated transaction.

---

Built for a frontend evaluation exercise; not intended as production financial software.
