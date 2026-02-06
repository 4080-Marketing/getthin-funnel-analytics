"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { format, parseISO } from "date-fns"
import { cn, formatNumber } from "@/lib/utils"

interface TrendDataPoint {
  date: string
  value: number
  label?: string
}

interface AreaTrendChartProps {
  data: TrendDataPoint[]
  loading?: boolean
  valueLabel?: string
  color?: string
  className?: string
}

export function AreaTrendChart({
  data,
  loading,
  valueLabel = "Users",
  color = "#7c3aed",
  className,
}: AreaTrendChartProps) {
  if (loading) {
    return (
      <div className={cn("rounded-lg border bg-white p-6", className)}>
        <div className="animate-pulse">
          <div className="h-[200px] bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  const chartData = data.map((d) => ({
    date: d.date,
    value: d.value,
    formattedDate: format(parseISO(d.date), "MMM d"),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-white px-3 py-2 shadow-lg">
          <p className="text-xs text-gray-500">{data.formattedDate}</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatNumber(data.value)} {valueLabel.toLowerCase()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={cn("h-[200px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            dy={5}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatNumber(value)}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
