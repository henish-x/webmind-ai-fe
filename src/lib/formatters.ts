import { format, formatDistanceToNowStrict } from 'date-fns'

export function formatRelativeTime(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true })
}

export function formatDate(iso: string, pattern = 'MMM d, yyyy'): string {
  return format(new Date(iso), pattern)
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy · h:mm a')
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}
