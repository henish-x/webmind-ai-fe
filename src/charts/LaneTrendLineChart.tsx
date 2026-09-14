import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartTooltipStyle, useChartColors } from './chartTheme'

export interface LaneTrendPoint {
  date: string
  value: number
}

export interface LaneTrendLineChartProps {
  data: LaneTrendPoint[]
  lane: 'support' | 'sales'
  valueLabel: string
  height?: number
}

/** A single-series trend line, colored by lane. No gradients, no dot shadows — hairline grid only. */
export function LaneTrendLineChart({ data, lane, valueLabel, height = 220 }: LaneTrendLineChartProps) {
  const colors = useChartColors()
  const stroke = lane === 'support' ? colors.support : colors.sales

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={colors.hairline} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: colors.inkMuted, fontFamily: 'IBM Plex Sans, sans-serif' }}
          axisLine={{ stroke: colors.hairline }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 12, fill: colors.inkMuted, fontFamily: 'IBM Plex Sans, sans-serif' }}
          axisLine={false}
          tickLine={false}
          width={28}
          allowDecimals={false}
        />
        <Tooltip {...chartTooltipStyle(colors)} formatter={(value) => [value, valueLabel] as [number, string]} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={stroke}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
