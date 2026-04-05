// INR formatters — en-IN gives the grouping we want (lakhs etc.)

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const inrDetail = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

// big round numbers for cards / tooltips
export function formatInr(n: number) {
  return inrWhole.format(n)
}

// table rows — keeps decimals when they matter
export function formatInrDetail(n: number) {
  return inrDetail.format(n)
}

// Y-axis style: squish huge values to ₹12.5L instead of a mile of digits
export function formatInrShort(n: number) {
  const v = Math.abs(n)
  const sign = n < 0 ? '−' : ''
  if (v >= 1e7) return `${sign}₹${(v / 1e7).toFixed(1)}Cr`
  if (v >= 1e5) return `${sign}₹${(v / 1e5).toFixed(1)}L`
  if (v >= 1e3) return `${sign}₹${(v / 1e3).toFixed(1)}k`
  return formatInr(n)
}
