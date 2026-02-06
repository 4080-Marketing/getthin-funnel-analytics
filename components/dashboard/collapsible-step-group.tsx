"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Star, AlertTriangle } from "lucide-react"
import { cn, formatNumber, formatPercentage } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StepData {
  stepNumber: number
  stepName: string
  stepKey: string
  entries: number
  exits: number
  conversionRate: number
  dropOffRate: number
  isStarred?: boolean
}

interface StepGroup {
  name: string
  category: string
  steps: StepData[]
  avgConversion?: number
}

interface CollapsibleStepGroupProps {
  groups: StepGroup[]
  loading?: boolean
  showStarredOnly?: boolean
  onToggleStar?: (stepKey: string) => void
  onStepClick?: (step: StepData) => void
  className?: string
}

function StepRow({
  step,
  onToggleStar,
  onClick,
}: {
  step: StepData
  onToggleStar?: (stepKey: string) => void
  onClick?: () => void
}) {
  const isCritical = step.dropOffRate > 40
  const isWarning = step.dropOffRate > 25 && step.dropOffRate <= 40

  return (
    <div
      className={cn(
        "flex items-center py-2 px-3 text-sm border-b last:border-b-0 hover:bg-gray-50 cursor-pointer",
        isCritical && "bg-red-50 hover:bg-red-100",
        isWarning && "bg-amber-50 hover:bg-amber-100"
      )}
      onClick={onClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleStar?.(step.stepKey)
        }}
        className={cn(
          "p-1 mr-2 rounded hover:bg-gray-200",
          step.isStarred ? "text-amber-500" : "text-gray-300"
        )}
      >
        <Star className={cn("h-3.5 w-3.5", step.isStarred && "fill-current")} />
      </button>

      <span className="w-8 text-gray-400 font-mono text-xs">{step.stepNumber}.</span>

      <span className="flex-1 truncate">
        {step.stepName}
        {isCritical && (
          <AlertTriangle className="inline-block h-3.5 w-3.5 text-red-500 ml-1.5" />
        )}
      </span>

      <span className="w-20 text-right text-gray-600">
        {formatNumber(step.entries)}
      </span>

      <span className="w-8 text-center text-gray-400 mx-2">→</span>

      <span className="w-20 text-right text-gray-600">
        {formatNumber(step.entries - step.exits)}
      </span>

      <span
        className={cn(
          "w-16 text-right font-medium ml-4",
          isCritical ? "text-red-600" :
          isWarning ? "text-amber-600" : "text-green-600"
        )}
      >
        ({formatPercentage(step.conversionRate)})
      </span>
    </div>
  )
}

function GroupSection({
  group,
  defaultOpen = true,
  showStarredOnly,
  onToggleStar,
  onStepClick,
}: {
  group: StepGroup
  defaultOpen?: boolean
  showStarredOnly?: boolean
  onToggleStar?: (stepKey: string) => void
  onStepClick?: (step: StepData) => void
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const visibleSteps = showStarredOnly
    ? group.steps.filter(s => s.isStarred)
    : group.steps

  if (visibleSteps.length === 0) return null

  const avgConversion =
    visibleSteps.reduce((sum, s) => sum + s.conversionRate, 0) / visibleSteps.length

  const hasCritical = visibleSteps.some(s => s.dropOffRate > 40)

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors",
          hasCritical && "bg-red-50/50"
        )}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          <span className="font-medium text-gray-900">{group.name}</span>
          <span className="text-sm text-gray-500">({visibleSteps.length} steps)</span>
          {hasCritical && (
            <Badge variant="critical" className="ml-2 text-xs">
              Critical
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-500">
          Avg: <span className="font-medium text-green-600">{formatPercentage(avgConversion)}</span> conversion
        </span>
      </button>

      {isOpen && (
        <div className="border-t bg-white">
          {visibleSteps.map((step) => (
            <StepRow
              key={step.stepKey}
              step={step}
              onToggleStar={onToggleStar}
              onClick={() => onStepClick?.(step)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CollapsibleStepGroups({
  groups,
  loading,
  showStarredOnly = false,
  onToggleStar,
  onStepClick,
  className,
}: CollapsibleStepGroupProps) {
  if (loading) {
    return (
      <div className={cn("rounded-lg border bg-white", className)}>
        <div className="p-4 border-b">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border bg-white overflow-hidden", className)}>
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Step-by-Step Breakdown</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Click to expand categories, star important steps
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Entries → Continues (Conversion %)</span>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {groups.map((group, index) => (
          <GroupSection
            key={group.category}
            group={group}
            defaultOpen={index < 2}
            showStarredOnly={showStarredOnly}
            onToggleStar={onToggleStar}
            onStepClick={onStepClick}
          />
        ))}
      </div>
    </div>
  )
}
