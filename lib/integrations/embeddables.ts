/**
 * Embeddables API Integration
 * 
 * This file handles all communication with the Embeddables API
 * to fetch funnel data, analytics, and step-level metrics.
 * 
 * Note: The exact API structure needs to be confirmed with Embeddables documentation.
 * This is a placeholder implementation that should be updated with actual API endpoints.
 */

const EMBEDDABLES_API_URL = process.env.EMBEDDABLES_API_URL || 'https://api.embeddables.com/v1';
const EMBEDDABLES_API_KEY = process.env.EMBEDDABLES_API_KEY;

interface EmbeddablesConfig {
  apiKey: string;
  baseUrl: string;
}

class EmbeddablesClient {
  private config: EmbeddablesConfig;

  constructor() {
    if (!EMBEDDABLES_API_KEY) {
      throw new Error('EMBEDDABLES_API_KEY is not configured');
    }

    this.config = {
      apiKey: EMBEDDABLES_API_KEY,
      baseUrl: EMBEDDABLES_API_URL,
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Embeddables API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get list of all funnels
   * TODO: Update with actual Embeddables API endpoint
   */
  async getFunnels() {
    return this.request('/funnels');
  }

  /**
   * Get funnel details by ID
   * TODO: Update with actual Embeddables API endpoint
   */
  async getFunnelById(funnelId: string) {
    return this.request(`/funnels/${funnelId}`);
  }

  /**
   * Get funnel analytics for a date range
   * TODO: Update with actual Embeddables API endpoint
   */
  async getFunnelAnalytics(funnelId: string, startDate: Date, endDate: Date) {
    const params = new URLSearchParams({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });
    
    return this.request(`/funnels/${funnelId}/analytics?${params}`);
  }

  /**
   * Get step-level analytics for a funnel
   * TODO: Update with actual Embeddables API endpoint
   */
  async getStepAnalytics(funnelId: string, startDate: Date, endDate: Date) {
    const params = new URLSearchParams({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });
    
    return this.request(`/funnels/${funnelId}/steps/analytics?${params}`);
  }

  /**
   * Get funnel steps definition
   * TODO: Update with actual Embeddables API endpoint
   */
  async getFunnelSteps(funnelId: string) {
    return this.request(`/funnels/${funnelId}/steps`);
  }
}

// Export singleton instance
export const embeddables = new EmbeddablesClient();

// Export types (these should be updated based on actual API response structure)
export interface EmbeddablesFunnel {
  id: string;
  name: string;
  description?: string;
  steps: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EmbeddablesAnalytics {
  funnel_id: string;
  date: string;
  total_starts: number;
  total_completions: number;
  total_dropoffs: number;
  conversion_rate: number;
}

export interface EmbeddablesStepAnalytics {
  step_number: number;
  step_name: string;
  total_entries: number;
  total_exits: number;
  dropoff_rate: number;
  conversion_rate: number;
}
