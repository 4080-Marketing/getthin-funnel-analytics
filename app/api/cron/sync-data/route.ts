/**
 * Data Sync Cron Job
 *
 * Recalculates funnel metrics from stored entries (received via webhook)
 * The Embeddables API doesn't support bulk fetching - data comes via DataPipes webhook
 * Should run every 15-30 minutes via Railway Cron or external cron service
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { startOfDay, subDays } from 'date-fns';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max execution

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Sync] Starting funnel metrics recalculation...');

    const today = startOfDay(new Date());
    const projectId = process.env.EMBEDDABLES_PROJECT_ID || 'pr_WU28KvQa9qZ4BOuW';

    // Get or create a default funnel
    let funnel = await prisma.funnel.findFirst({
      where: { embeddablesId: projectId },
    });

    if (!funnel) {
      funnel = await prisma.funnel.create({
        data: {
          embeddablesId: projectId,
          name: 'Get Thin MD Quiz',
          totalSteps: 10,
          status: 'active',
        },
      });
      console.log(`[Sync] Created new funnel: ${funnel.name}`);
    }

    // Get today's entries from FunnelEntry table
    const todayEntries = await prisma.funnelEntry.findMany({
      where: {
        funnelId: funnel.id,
        createdAt: {
          gte: today,
        },
      },
    });

    console.log(`[Sync] Found ${todayEntries.length} entries for today`);

    // Calculate metrics from entries
    const totalStarts = todayEntries.length;
    const totalCompletions = todayEntries.filter(e => e.completed).length;
    const totalDropoffs = totalStarts - totalCompletions;
    const conversionRate = totalStarts > 0 ? (totalCompletions / totalStarts) * 100 : 0;

    // Upsert funnel analytics for today
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
      await prisma.funnelAnalytics.update({
        where: { id: existingFunnelAnalytics.id },
        data: {
          totalStarts,
          totalCompletions,
          totalDropoffs,
          conversionRate,
        },
      });
    } else {
      await prisma.funnelAnalytics.create({
        data: {
          funnelId: funnel.id,
          date: today,
          totalStarts,
          totalCompletions,
          totalDropoffs,
          conversionRate,
        },
      });
    }

    // Recalculate step metrics
    const steps = await prisma.funnelStep.findMany({
      where: { funnelId: funnel.id },
      orderBy: { stepNumber: 'asc' },
    });

    let stepsProcessed = 0;

    for (const step of steps) {
      // Count entries that reached this step
      const entriesAtStep = todayEntries.filter(e => e.lastStepIndex >= step.stepNumber);
      const entriesPastStep = todayEntries.filter(e => e.lastStepIndex > step.stepNumber || e.completed);
      const entriesExitedAtStep = todayEntries.filter(
        e => e.lastStepIndex === step.stepNumber && !e.completed
      );

      const entries = entriesAtStep.length;
      const conversions = entriesPastStep.length;
      const exits = entriesExitedAtStep.length;
      const dropOffRate = entries > 0 ? (exits / entries) * 100 : 0;
      const stepConversionRate = entries > 0 ? (conversions / entries) * 100 : 0;

      // Upsert step analytics
      const existingStepAnalytics = await prisma.stepAnalytics.findFirst({
        where: {
          stepId: step.id,
          date: today,
          hour: null,
          deviceType: null,
          browser: null,
        },
      });

      if (existingStepAnalytics) {
        await prisma.stepAnalytics.update({
          where: { id: existingStepAnalytics.id },
          data: {
            entries,
            exits,
            conversions,
            dropOffRate,
            conversionRate: stepConversionRate,
          },
        });
      } else {
        await prisma.stepAnalytics.create({
          data: {
            stepId: step.id,
            date: today,
            entries,
            exits,
            conversions,
            dropOffRate,
            conversionRate: stepConversionRate,
            avgTimeOnStep: 0,
          },
        });
      }

      stepsProcessed++;
    }

    const duration = Date.now() - startTime;

    // Log sync execution
    await prisma.syncLog.create({
      data: {
        syncType: 'metrics_recalculation',
        status: 'success',
        recordsProcessed: todayEntries.length,
        startedAt: new Date(startTime),
        completedAt: new Date(),
      },
    });

    console.log(
      `[Sync] Completed in ${duration}ms - Entries: ${todayEntries.length}, Steps: ${stepsProcessed}`
    );

    return NextResponse.json({
      success: true,
      message: 'Metrics recalculated from stored entries',
      entriesProcessed: todayEntries.length,
      stepsProcessed,
      funnelMetrics: {
        totalStarts,
        totalCompletions,
        conversionRate: conversionRate.toFixed(2),
      },
      duration,
      note: todayEntries.length === 0
        ? 'No entries yet. Set up Embeddables DataPipe to POST to /api/webhooks/embeddables'
        : undefined,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failed sync
    try {
      await prisma.syncLog.create({
        data: {
          syncType: 'metrics_recalculation',
          status: 'failed',
          recordsProcessed: 0,
          errorMessage,
          startedAt: new Date(startTime),
          completedAt: new Date(),
        },
      });
    } catch (logError) {
      console.error('[Sync] Failed to log sync error:', logError);
    }

    console.error('[Sync] Fatal error:', error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        duration,
      },
      { status: 500 }
    );
  }
}
