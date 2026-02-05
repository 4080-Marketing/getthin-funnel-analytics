export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 'drop_off' | 'conversion' | 'volume' | 'step_anomaly';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  funnelId: string;
  funnelName: string;
  severity: AlertSeverity;
  type: AlertType;
  stepNumber?: number;
  stepName?: string;
  
  // Metrics
  currentValue: number;
  previousDayValue: number;
  sevenDayAverage: number;
  percentageChange: number;
  
  // Context
  message: string;
  recommendation?: string;
  
  // Status
  status: AlertStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  
  // Slack notification
  slackMessageTs?: string;
  slackSent: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertTrigger {
  funnelId: string;
  funnelName: string;
  type: AlertType;
  stepNumber?: number;
  stepName?: string;
  currentValue: number;
  previousDayValue: number;
  sevenDayAverage: number;
}

export interface AlertThresholds {
  dropoff: {
    oneDayThreshold: number;
    sevenDayThreshold: number;
  };
  conversion: {
    oneDayThreshold: number;
    sevenDayThreshold: number;
  };
  volume: {
    oneDayThreshold: number;
    sevenDayThreshold: number;
  };
}
