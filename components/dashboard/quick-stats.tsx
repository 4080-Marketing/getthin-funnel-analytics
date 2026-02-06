"use client"

import { AlertTriangle, TrendingUp, TrendingDown, Target, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickStat {
  id: string
  icon: "critical" | "trend-up" | "trend-down" | "target" | "time"
  label: string
  value: string
  variant?: "default" | "warning" | "critical" | "success"
}

interface QuickStatsProps {
  stats: QuickStat[]
  loading?: boolean
  className?: string
}

const iconMap = {
  critical: AlertTriangle,
  "trend-up": TrendingUp,
  "trend-down": TrendingDown,
  target: Target,
  time: Clock,
}

const variantStyles = {
  default: "bg-gray-50 text-gray-700 border-gray-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  critical: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
}

export function QuickStats({ stats, loading, className }: QuickStatsProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-gray-50 p-4 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon]
        const variant = stat.variant || "default"

        return (
          <div
            key={stat.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-4",
              variantStyles[variant]
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-medium">{stat.value}</span>
              <span className="ml-1.5 text-sm opacity-80">{stat.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
