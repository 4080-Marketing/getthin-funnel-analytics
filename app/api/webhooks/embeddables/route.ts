/**
 * Embeddables Webhook Endpoint
 *
 * Receives data pushed from Embeddables DataPipes
 * Set up a DataPipe in Embeddables to POST to:
 * https://your-app.railway.app/api/webhooks/embeddables
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { startOfDay } from 'date-fns';

export const runtime = 'nodejs';

// Embeddables DataPipe payload structure
interface EmbeddablesWebhookPayload {
  event: 'entry.created' | 'entry.updated' | 'entry.completed' | 'page_view';
  entryId: string;
  flowId?: string;
  projectId?: string;
  completed?: boolean;
  currentPageIndex?: number;
  currentPageKey?: string;
  currentPageName?: string;
  totalPages?: number;
  timeSpent?: number;
  createdAt?: string;
  updatedAt?: string;
  pageViews?: Array<{
    index: number;
    pageKey?: string;
    pageName?: string;
    timeSpent?: number;
    viewedAt?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify webhook secret
    const webhookSecret = process.env.EMBEDDABLES_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-webhook-signature');
      if (signature !== webhookSecret) {
        console.warn('[Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload: EmbeddablesWebhookPayload = await request.json();
    console.log(`[Webhook] Received event: ${payload.event} for entry: ${payload.entryId}`);

    const projectId = payload.projectId || payload.flowId || process.env.EMBEDDABLES_PROJECT_ID || 'default';
    const today = startOfDay(new Date());

    // Get or create funnel
    let funnel = await prisma.funnel.findFirst({
      where: { embeddablesId: projectId },
    });

    if (!funnel) {
      funnel = await prisma.funnel.create({
        data: {
          embeddablesId: projectId,
          name: 'Main Questionnaire',
          totalSteps: payload.totalPages || 10,
          status: 'active',
        },
      });
    }

    // Store the entry
    await prisma.funnelEntry.upsert({
      where: { entryId: payload.entryId },
      create: {
        entryId: payload.entryId,
        funnelId: funnel.id,
        completed: payload.completed || false,
        lastStepIndex: payload.currentPageIndex || 0,
        lastStepKey: payload.currentPageKey,
        totalSteps: payload.totalPages || 0,
        timeSpent: payload.timeSpent || 0,
        createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
        updatedAt: new Date(),
      },
      update: {
        completed: payload.completed || false,
        lastStepIndex: payload.currentPageIndex || 0,
        lastStepKey: payload.currentPageKey,
        timeSpent: payload.timeSpent || 0,
        updatedAt: new Date(),
      },
    });

    // Process page views if available
    if (payload.pageViews && payload.pageViews.length > 0) {
      for (const pageView of payload.pageViews) {
        // Ensure step exists
        const step = await prisma.funnelStep.upsert({
          where: {
            funnelId_stepNumber: {
              funnelId: funnel.id,
              stepNumber: pageView.index,
            },
          },
          create: {
            funnelId: funnel.id,
            stepNumber: pageView.index,
            stepName: pageView.pageName || `Step ${pageView.index + 1}`,
            stepKey: pageView.pageKey,
          },
          update: {
            stepName: pageView.pageName || `Step ${pageView.index + 1}`,
            stepKey: pageView.pageKey,
          },
        });

        // Update step analytics
        const existingAnalytics = await prisma.stepAnalytics.findFirst({
          where: {
            stepId: step.id,
            date: today,
            hour: null,
            deviceType: null,
            browser: null,
          },
        });

        if (existingAnalytics) {
          await prisma.stepAnalytics.update({
            where: { id: existingAnalytics.id },
            data: {
              entries: { increment: 1 },
              avgTimeOnStep: pageView.timeSpent || existingAnalytics.avgTimeOnStep,
            },
          });
        } else {
          await prisma.stepAnalytics.create({
            data: {
              stepId: step.id,
              date: today,
              entries: 1,
              exits: 0,
              conversions: 0,
              dropOffRate: 0,
              conversionRate: 0,
              avgTimeOnStep: pageView.timeSpent || 0,
            },
          });
        }
      }
    }

    // Update funnel analytics
    const existingFunnelAnalytics = await prisma.funnelAnalytics.findFirst({
      where: {
        funnelId: funnel.id,
        date: today,
        hour: null,
        deviceType: null,
        browser: null,
      },
    });

    if (existingFunnelAnalytics) {
      const updateData: Record<string, unknown> = {};

      if (payload.event === 'entry.created') {
        updateData.totalStarts = { increment: 1 };
      }
      if (payload.completed) {
        updateData.totalCompletions = { increment: 1 };
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.funnelAnalytics.update({
          where: { id: existingFunnelAnalytics.id },
          data: updateData,
        });
      }
    } else {
      await prisma.funnelAnalytics.create({
        data: {
          funnelId: funnel.id,
          date: today,
          totalStarts: payload.event === 'entry.created' ? 1 : 0,
          totalCompletions: payload.completed ? 1 : 0,
          totalDropoffs: 0,
          conversionRate: 0,
        },
      });
    }

    console.log(`[Webhook] Successfully processed entry: ${payload.entryId}`);

    return NextResponse.json({
      success: true,
      entryId: payload.entryId,
      event: payload.event,
    });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support GET for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Embeddables Webhook',
    message: 'POST entry data to this endpoint',
  });
}
