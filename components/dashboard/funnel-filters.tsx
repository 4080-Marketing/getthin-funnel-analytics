"use client"

import { Star, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FunnelFiltersProps {
  showStarredOnly: boolean
  onShowStarredOnlyChange: (value: boolean) => void
  displayMode: "absolute" | "percentage"
  onDisplayModeChange: (mode: "absolute" | "percentage") => void
  onRefresh: () => void
  loading?: boolean
  className?: string
}

export function FunnelFilters({
  showStarredOnly,
  onShowStarredOnlyChange,
  displayMode,
  onDisplayModeChange,
  onRefresh,
  loading,
  className,
}: FunnelFiltersProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant={showStarredOnly ? "default" : "outline"}
          size="sm"
          onClick={() => onShowStarredOnlyChange(!showStarredOnly)}
          className={cn(
            showStarredOnly && "bg-violet-600 hover:bg-violet-700"
          )}
        >
          <Star className={cn("h-4 w-4 mr-1.5", showStarredOnly && "fill-current")} />
          Starred pages only
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => onDisplayModeChange("absolute")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-colors",
              displayMode === "absolute"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            ABS
          </button>
          <button
            onClick={() => onDisplayModeChange("percentage")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-colors",
              displayMode === "percentage"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            %
          </button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      </div>
    </div>
  )
}
