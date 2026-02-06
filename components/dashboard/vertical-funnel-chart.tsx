"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"
import { cn, formatNumber, formatPercentage } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FunnelStep {
  stepNumber: number
  stepName: string
  stepKey: string
  entries: number
  conversionRate: number
  dropOffRate: number
  category?: string
  isStarred?: boolean
}

interface VerticalFunnelChartProps {
  steps: FunnelStep[]
  loading?: boolean
  showStarredOnly?: boolean
  displayMode?: "absolute" | "percentage"
  onStepClick?: (step: FunnelStep) => void
  className?: string
}

const VIOLET_COLOR = "#7c3aed"
const VIOLET_LIGHT = "#a78bfa"

export function VerticalFunnelChart({
  steps,
  loading,
  showStarredOnly = false,
  displayMode = "absolute",
  onStepClick,
  className,
}: VerticalFunnelChartProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  if (loading) {
    return (
      <div className={cn("rounded-lg border bg-white p-6", className)}>
        <div className="animate-pulse">
          <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-[350px] bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  const filteredSteps = showStarredOnly
    ? steps.filter(s => s.isStarred)
    : steps

  const maxEntries = Math.max(...filteredSteps.map(s => s.entries), 1)

  const chartData = filteredSteps.map((step, index) => {
    const prevStep = index > 0 ? filteredSteps[index - 1] : null
    const dropFromPrev = prevStep
      ? ((prevStep.entries - step.entries) / prevStep.entries * 100)
      : 0

    return {
      name: step.stepName.length > 15
        ? step.stepName.substring(0, 12) + "..."
        : step.stepName,
      fullName: step.stepName,
      stepKey: step.stepKey,
      stepNumber: step.stepNumber,
      entries: step.entries,
      percentage: (step.entries / maxEntries) * 100,
      dropOffRate: step.dropOffRate,
      conversionRate: step.conversionRate,
      dropFromPrev,
      category: step.category,
      isStarred: step.isStarred,
    }
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-white p-4 shadow-lg min-w-[200px]">
          <p className="font-medium text-gray-900 text-sm">Page: {data.fullName}</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Contacts</span>
              <span className="font-semibold">{formatNumber(data.entries)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Drop-off</span>
              <span className={cn(
                "font-semibold",
                data.dropOffRate > 40 ? "text-red-600" :
                data.dropOffRate > 25 ? "text-amber-600" : "text-gray-600"
              )}>
                {formatPercentage(data.dropOffRate)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">% of Total</span>
              <span className="font-semibold">{formatPercentage(data.percentage)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <button className="w-full text-center text-sm text-violet-600 hover:text-violet-700 font-medium">
              View Users
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={cn("rounded-lg border bg-white p-6", className)}>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">Funnel Visualization</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Click on any bar to see step details
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                displayMode === "percentage"
                  ? `${value}%`
                  : formatNumber(value)
              }
              domain={displayMode === "percentage" ? [0, 100] : [0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
            <Bar
              dataKey={displayMode === "percentage" ? "percentage" : "entries"}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              onClick={(data: any) => {
                if (data && data.stepKey) {
                  const step = steps.find(s => s.stepKey === data.stepKey)
                  if (step) onStepClick?.(step)
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hoveredStep === index ? VIOLET_LIGHT : VIOLET_COLOR}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Drop-off indicators between key steps */}
      {chartData.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span>Tip: Hover over bars to see drop-off details</span>
        </div>
      )}
    </div>
  )
}
