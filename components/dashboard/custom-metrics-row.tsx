"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CustomMetric {
  id: string
  label: string
  value: number
  percentage?: number
  stepKey?: string
}

interface CustomMetricsRowProps {
  metrics: CustomMetric[]
  onAddMetric?: () => void
  loading?: boolean
  className?: string
}

export function CustomMetricsRow({ metrics, onAddMetric, loading, className }: CustomMetricsRowProps) {
  if (loading) {
    return (
      <div className={cn("flex items-stretch gap-0 border rounded-lg bg-white overflow-hidden", className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-1 p-4 border-r last:border-r-0 animate-pulse">
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-stretch gap-0 border rounded-lg bg-white overflow-hidden", className)}>
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          className={cn(
            "flex-1 p-4 border-r last:border-r-0 min-w-0",
            "hover:bg-gray-50 transition-colors cursor-pointer"
          )}
        >
          <p className="text-sm text-gray-500 truncate">{metric.label}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-semibold text-gray-900">
              {metric.value.toLocaleString()}
            </span>
            {metric.percentage !== undefined && (
              <span className="text-sm text-gray-500">
                ({metric.percentage.toFixed(0)}%)
              </span>
            )}
          </div>
        </div>
      ))}
      {onAddMetric && (
        <button
          onClick={onAddMetric}
          className={cn(
            "flex items-center justify-center px-4 min-w-[56px]",
            "bg-violet-50 hover:bg-violet-100 transition-colors",
            "text-violet-600 hover:text-violet-700"
          )}
          title="Add custom metric"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
