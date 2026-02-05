export type RecommendationType = 
  | 'ui_optimization' 
  | 'copy_change' 
  | 'flow_modification' 
  | 'technical_fix';

export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationStatus = 'pending' | 'approved' | 'rejected' | 'implemented';

export interface Recommendation {
  id: string;
  funnelId: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  
  // Recommendation details
  title: string;
  description: string;
  reasoning: string;
  expectedImpact?: string;
  
  // Implementation
  implementationSteps?: string;
  estimatedEffort?: string;
  
  // Context
  stepNumber?: number;
  relatedMetrics?: any;
  
  // Status
  status: RecommendationStatus;
  approvedBy?: string;
  approvedAt?: Date;
  implementedAt?: Date;
  
  // AI generation
  generatedBy: 'ai' | 'manual';
  aiModel?: string;
  aiPromptVersion?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface RecommendationInput {
  funnelId: string;
  stepAnalytics: any[];
  recentAlerts: any[];
  historicalTrends: any;
}
