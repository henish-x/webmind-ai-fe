/**
 * Reads the current CSS custom property values so Recharts (which needs raw
 * color strings, not var()) stays in sync with the design tokens and flips
 * with dark mode. Call inside a component/render, not at module scope, so
 * the values are read after the DOM (and data-theme) exist.
 */
export function readToken(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function useChartColors() {
  return {
    support: readToken('--support-500'),
    sales: readToken('--sales-500'),
    ink: readToken('--ink-primary'),
    inkSecondary: readToken('--ink-secondary'),
    inkMuted: readToken('--ink-muted'),
    hairline: readToken('--hairline'),
    surfaceCard: readToken('--surface-card'),
    danger: readToken('--danger-500'),
    warning: readToken('--warning-500'),
    success: readToken('--success-500'),
  }
}

export const chartTooltipStyle = (colors: ReturnType<typeof useChartColors>) => ({
  contentStyle: {
    background: colors.surfaceCard,
    border: `1px solid ${colors.hairline}`,
    borderRadius: 8,
    fontSize: 12,
    fontFamily: 'IBM Plex Sans, sans-serif',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  labelStyle: { color: colors.ink, fontWeight: 500 },
  itemStyle: { color: colors.inkSecondary },
})
