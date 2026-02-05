export interface Funnel {
  id: string;
  embeddablesId: string;
  name: string;
  description?: string;
  totalSteps: number;
  status: 'active' | 'paused' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt?: Date;
}

export interface FunnelStep {
  id: string;
  funnelId: string;
  stepNumber: number;
  stepName: string;
  stepType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelAnalytics {
  id: string;
  funnelId: string;
  date: Date;
  hour?: number;
  totalStarts: number;
  totalCompletions: number;
  totalDropoffs: number;
  overallConversionRate: number;
  averageDropoffRate: number;
  averageCompletionTime?: number;
  medianCompletionTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StepAnalytics {
  id: string;
  stepId: string;
  date: Date;
  hour?: number;
  totalEntries: number;
  totalExits: number;
  totalContinues: number;
  dropoffRate: number;
  conversionRate: number;
  averageTimeOnStep?: number;
  medianTimeOnStep?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelMetrics {
  totalStarts: number;
  totalCompletions: number;
  overallConversionRate: number;
  averageDropoffRate: number;
  criticalSteps: {
    stepNumber: number;
    stepName: string;
    dropoffRate: number;
  }[];
  trend: {
    conversionRateChange: number;
    volumeChange: number;
  };
}

export interface StepMetrics {
  stepNumber: number;
  stepName: string;
  totalEntries: number;
  totalExits: number;
  dropoffRate: number;
  conversionRate: number;
  averageTimeOnStep?: number;
  comparisonToPrevious?: {
    dropoffRateChange: number;
    volumeChange: number;
  };
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ComparisonDateRange extends DateRange {
  compareStartDate: Date;
  compareEndDate: Date;
}
