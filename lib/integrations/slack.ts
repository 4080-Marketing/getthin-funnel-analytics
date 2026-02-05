/**
 * Slack Integration
 * 
 * Handles sending alerts and daily reports to Slack via webhook
 */

import { Alert } from '@/types/alert';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL || '#funnel-alerts';

interface SlackMessage {
  text?: string;
  blocks?: any[];
  channel?: string;
}

/**
 * Send message to Slack
 */
async function sendSlackMessage(message: SlackMessage): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
    return false;
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return false;
  }
}

/**
 * Format and send alert to Slack
 */
export async function sendAlertToSlack(alert: Alert): Promise<boolean> {
  const emoji = alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
  const severityText = alert.severity.toUpperCase();
  
  // Calculate estimated impact
  const additionalDropoffs = Math.round((alert.currentValue - alert.previousDayValue) * 100);
  const estimatedRevenue = additionalDropoffs * 30; // Assuming $30 avg customer value
  
  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} ${severityText} ALERT: ${alert.message}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Funnel:*\n${alert.funnelName}`,
          },
          {
            type: 'mrkdwn',
            text: alert.stepName ? `*Step:*\nStep ${alert.stepNumber} - ${alert.stepName}` : '*Type:*\nOverall Funnel',
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*📊 Metrics:*\n• Current: ${(alert.currentValue * 100).toFixed(1)}%\n• Previous day: ${(alert.previousDayValue * 100).toFixed(1)}%\n• 7-day average: ${(alert.sevenDayAverage * 100).toFixed(1)}%\n• Change: ${alert.percentageChange > 0 ? '+' : ''}${alert.percentageChange.toFixed(1)}% vs yesterday`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*⚠️ Impact:*\n• ~${additionalDropoffs} additional users dropping\n• Estimated revenue impact: $${estimatedRevenue.toLocaleString()}`,
        },
      },
    ],
  };

  if (alert.recommendation) {
    message.blocks?.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*💡 Recommendation:*\n${alert.recommendation}`,
      },
    });
  }

  message.blocks?.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Dashboard',
        },
        url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${alert.funnelId}?step=${alert.stepNumber || 'all'}`,
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Acknowledge Alert',
        },
        url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alerts?id=${alert.id}`,
        style: 'primary',
      },
    ],
  });

  return sendSlackMessage(message);
}

/**
 * Format and send daily report to Slack
 */
export async function sendDailyReportToSlack(report: any): Promise<boolean> {
  const trendEmoji = report.overallConversionTrend > 0 ? '📈' : report.overallConversionTrend < 0 ? '📉' : '➡️';
  
  const message: SlackMessage = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📊 Daily Funnel Report - ${new Date(report.reportDate).toLocaleDateString()}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Executive Summary for ${report.funnelName}*`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Overall Conversion:*\n${(report.overallConversionRate * 100).toFixed(1)}% ${trendEmoji} ${report.overallConversionTrend > 0 ? '+' : ''}${report.overallConversionTrend.toFixed(1)}%`,
          },
          {
            type: 'mrkdwn',
            text: `*Total Starts:*\n${report.totalFunnelStarts.toLocaleString()} (${report.totalFunnelStartsTrend > 0 ? '+' : ''}${report.totalFunnelStartsTrend.toFixed(1)}%)`,
          },
        ],
      },
    ],
  };

  // Add top performing steps
  if (report.topPerformingSteps && report.topPerformingSteps.length > 0) {
    const topSteps = report.topPerformingSteps
      .map((step: any) => `• Step ${step.stepNumber}: ${step.stepName} (${(step.conversionRate * 100).toFixed(1)}%)`)
      .join('\n');
    
    message.blocks?.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*✅ Top Performing Steps:*\n${topSteps}`,
      },
    });
  }

  // Add underperforming steps
  if (report.underperformingSteps && report.underperformingSteps.length > 0) {
    const underSteps = report.underperformingSteps
      .map((step: any) => `• Step ${step.stepNumber}: ${step.stepName} (${(step.dropoffRate * 100).toFixed(1)}% drop-off)`)
      .join('\n');
    
    message.blocks?.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*⚠️ Underperforming Steps:*\n${underSteps}`,
      },
    });
  }

  // Add AI summary if available
  if (report.aiSummary) {
    message.blocks?.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*🤖 AI Analysis:*\n${report.aiSummary}`,
      },
    });
  }

  message.blocks?.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Full Dashboard',
        },
        url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    ],
  });

  return sendSlackMessage(message);
}

export const slack = {
  sendMessage: sendSlackMessage,
  sendAlert: sendAlertToSlack,
  sendDailyReport: sendDailyReportToSlack,
};
