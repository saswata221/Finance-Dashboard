<div align="center">

# Finance Dashboard

**A responsive personal-finance snapshot UI** — balances, trends, category breakdown, and a full activity list.  
Runs entirely in the browser: **no backend**, data optional **`localStorage`** persistence.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Quick start](#-quick-start) · [Features](#-what-you-get) · [Deploy](#-deploy-to-vercel) · [Folder map](#-project-layout)

</div>

---

## Why use it?

| | |
|:---|:---|
| **See money at a glance** | Total balance, income, and expenses with animated summary cards (INR / Indian formatting). |
| **Spot patterns** | Line chart for balance over time, pie chart for spending by category, insights panel for trends. |
| **Manage activity** | Search, filter, sort transactions; export filtered rows as **CSV** or **JSON**. |
| **Light & dark** | Theme toggle + matching header logos; preference is saved. |

> **Heads-up:** This is a **demo / evaluation** front end, not regulated financial software. Numbers are yours only in **this browser** (local storage).

---

## Quick start

You need **[Node.js 18+](https://nodejs.org/)** and **npm**.

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (hot reload)
npm run dev
```

Open the URL printed in the terminal — usually **http://localhost:5173**.

| Command | What it does |
|--------|----------------|
| `npm run dev` | Development server |
| `npm run build` | Typecheck + production bundle → `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Using the app (2-minute tour)

1. **Header** — Switch **Viewer** vs **Admin**, toggle **dark mode**, download **CSV/JSON** (exports whatever is **currently filtered** in Activity). As **Admin**, you can **Reset demo** to restore seed data.
2. **Summary cards** — Total balance uses a fixed **starting balance** (₹2,400 in code) plus all transactions; income/expense are lifetime totals.
3. **Charts** — Balance trend uses days that have transactions; spending pie uses **expenses only**, by category.
4. **Insights** — Mix of **calendar-month** stats (e.g. net this month) and **all-time** rollups (e.g. top category, avg expense); read the subtitles on each block.
5. **Activity** — **Viewer**: read-only. **Admin**: **Add**, **Edit**, **Delete** rows (modal is centered on screen).

Your **transactions, role, and theme** persist under the key `fd-finance-dashboard-v1` in **localStorage** until you clear site data or reset.

---

## What you get

| Area | Details |
|------|---------|
| **Summary** | Balance · income · expenses · subtle hover motion on icons |
| **Balance trend** | Recharts line · friendly date labels (e.g. `3 mar`) · compact Y-axis for large INR |
| **Spending breakdown** | Donut-style pie + legend with amounts and % |
| **Insights** | Top spend category, vs last month %, net this month, savings rate, avg expense, transaction count |
| **Activity** | Filters (category, type), search, sort date/amount with direction toggle; responsive row layout |
| **Accessibility** | Labels, `aria` on sections, keyboard-friendly controls where it matters |

---

## Tech stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Recharts** for charts
- **Context + `useReducer`** for global state; **`useMemo`** for derived data

---

## Project layout

```
src/
├── App.tsx                 # Page shell + provider wrap
├── main.tsx                # React mount
├── index.css               # Tailwind + motion tokens
├── types.ts                # Transaction, role, filters
├── context/
│   └── DashboardContext.tsx   # State, persistence, exports, useInsights
├── data/
│   └── mockTransactions.ts    # Seed data + category options
├── components/             # Header, cards, charts, insights, transactions, modal
├── hooks/
│   └── useAnimatedNumber.ts
└── lib/
    └── currency.ts         # INR formatters (en-IN)
```

Static assets: **`public/`** (e.g. theme logos, favicon).

---

## Deploy to Vercel

1. Push this repo to **GitHub** (or GitLab / Bitbucket).
2. In [Vercel](https://vercel.com): **New Project** → import the repo.
3. Preset **Vite** (or manual): **Build** `npm run build`, **Output** `dist`.

Every push to your production branch redeploys automatically.

---

## Assumptions & notes

- Currency is **INR** via `Intl.NumberFormat('en-IN', …)`.
- **Starting balance** for the running-balance chart is the constant **`INITIAL_BALANCE`** in `DashboardContext.tsx` (currently `2400`).
- No API keys or env vars required for the default app.

---

<div align="center">

**Built as a frontend exercise** — extend or fork as you like.

</div>
