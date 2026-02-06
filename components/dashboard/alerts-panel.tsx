"use client"

import { useState } from "react"
import { AlertTriangle, Bell, Clock, Eye, BellOff, Check, Settings, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Alert {
  id: string
  type: "drop_off" | "conversion" | "volume" | "anomaly"
  message: string
  stepName?: string
  stepKey?: string
  severity: "critical" | "warning" | "info"
  value: number
  threshold: number
  triggeredAt: Date
  status: "active" | "acknowledged" | "resolved" | "snoozed"
}

interface AlertsPanelProps {
  activeAlerts: Alert[]
  alertHistory: Alert[]
  loading?: boolean
  onViewStep?: (stepKey: string) => void
  onAcknowledge?: (alertId: string) => void
  onSnooze?: (alertId: string) => void
  onConfigureRules?: () => void
  className?: string
}

const severityStyles = {
  critical: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
}

const severityBadge = {
  critical: "critical" as const,
  warning: "warning" as const,
  info: "secondary" as const,
}

const typeLabels = {
  drop_off: "Drop-off",
  conversion: "Conversion",
  volume: "Volume",
  anomaly: "Anomaly",
}

export function AlertsPanel({
  activeAlerts,
  alertHistory,
  loading,
  onViewStep,
  onAcknowledge,
  onSnooze,
  onConfigureRules,
  className,
}: AlertsPanelProps) {
  const [historyFilter, setHistoryFilter] = useState<"all" | "critical" | "warning">("all")

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="rounded-lg border bg-white p-6 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const filteredHistory = alertHistory.filter((alert) => {
    if (historyFilter === "all") return true
    return alert.severity === historyFilter
  })

  return (
    <div className={cn("space-y-6", className)}>
      {/* Active Alerts Section */}
      <div className="rounded-lg border bg-white">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-violet-600" />
            <h3 className="font-semibold text-gray-900">
              Active Alerts
              {activeAlerts.length > 0 && (
                <Badge variant="critical" className="ml-2">
                  {activeAlerts.length}
                </Badge>
              )}
            </h3>
          </div>
          <Button variant="outline" size="sm" onClick={onConfigureRules}>
            <Settings className="h-4 w-4 mr-1.5" />
            Configure Rules
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="font-medium text-gray-900">All clear!</p>
              <p className="text-sm text-gray-500 mt-1">
                No active alerts at the moment
              </p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "rounded-lg border p-4",
                  severityStyles[alert.severity]
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      alert.severity === "critical" ? "text-red-500" : "text-amber-500"
                    )} />
                    <div>
                      <p className="font-medium">
                        <Badge variant={severityBadge[alert.severity]} className="mr-2">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.message}
                      </p>
                      {alert.stepName && (
                        <p className="text-sm mt-1 opacity-80">
                          Step: {alert.stepName}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-sm opacity-70">
                        <span>Threshold: {alert.threshold}%</span>
                        <span>|</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDistanceToNow(alert.triggeredAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-current border-opacity-20">
                  {alert.stepKey && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewStep?.(alert.stepKey!)}
                      className="bg-white/50"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      View Step
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSnooze?.(alert.id)}
                    className="bg-white/50"
                  >
                    <BellOff className="h-3.5 w-3.5 mr-1.5" />
                    Snooze
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAcknowledge?.(alert.id)}
                    className="bg-white/50"
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert History Section */}
      <div className="rounded-lg border bg-white">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Alert History</h3>
          <div className="flex items-center gap-2">
            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value as any)}
              className="px-3 py-1.5 text-sm border rounded-lg bg-white"
            >
              <option value="all">All</option>
              <option value="critical">Critical only</option>
              <option value="warning">Warnings only</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No alert history found
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.slice(0, 10).map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="text-sm text-gray-500">
                    {alert.triggeredAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-sm">
                    {typeLabels[alert.type]}
                  </TableCell>
                  <TableCell className="text-sm truncate max-w-[300px]">
                    {alert.message}
                  </TableCell>
                  <TableCell>
                    <Badge variant={severityBadge[alert.severity]}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-sm",
                      alert.status === "resolved" && "text-green-600",
                      alert.status === "acknowledged" && "text-blue-600",
                      alert.status === "snoozed" && "text-gray-500"
                    )}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
