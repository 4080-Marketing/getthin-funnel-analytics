import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { subDays, startOfDay, endOfDay, format, eachDayOfInterval } from 'date-fns';

export const dynamic = 'force-dynamic';

/**
 * GET /api/funnels/analytics
 * Get analytics from the database (populated via webhook)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30', 10);

    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, days));

    // Get the main funnel
    const funnel = await prisma.funnel.findFirst({
      where: { status: 'active' },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (!funnel) {
      return NextResponse.json({
        success: true,
        totalEntries: 0,
        metrics: {
          totalStarts: 0,
          totalCompletions: 0,
          conversionRate: 0,
          abandonmentRate: 0,
        },
        steps: [],
        trends: [],
        message: 'No funnel data yet. Waiting for webhook data from Embeddables.',
      });
    }

    // Get funnel analytics for the period
    const funnelAnalytics = await prisma.funnelAnalytics.findMany({
      where: {
        funnelId: funnel.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Get step analytics
    const stepAnalytics = await prisma.stepAnalytics.findMany({
      where: {
        step: {
          funnelId: funnel.id,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        step: true,
      },
      orderBy: [
        { step: { stepNumber: 'asc' } },
        { date: 'desc' },
      ],
    });

    // Calculate totals
    const totalStarts = funnelAnalytics.reduce((sum, a) => sum + a.totalStarts, 0);
    const totalCompletions = funnelAnalytics.reduce((sum, a) => sum + a.totalCompletions, 0);
    const conversionRate = totalStarts > 0 ? (totalCompletions / totalStarts) * 100 : 0;

    // Group step analytics by step
    const stepMetrics = new Map<string, {
      stepNumber: number;
      stepName: string;
      stepKey: string | null;
      entries: number;
      exits: number;
      conversions: number;
      avgDropOffRate: number;
      avgConversionRate: number;
    }>();

    for (const sa of stepAnalytics) {
      const key = sa.step.id;
      const existing = stepMetrics.get(key);
      if (existing) {
        existing.entries += sa.entries;
        existing.exits += sa.exits;
        existing.conversions += sa.conversions;
      } else {
        stepMetrics.set(key, {
          stepNumber: sa.step.stepNumber,
          stepName: sa.step.stepName,
          stepKey: sa.step.stepKey,
          entries: sa.entries,
          exits: sa.exits,
          conversions: sa.conversions,
          avgDropOffRate: sa.dropOffRate,
          avgConversionRate: sa.conversionRate,
        });
      }
    }

    // Build trends from funnel analytics
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const analyticsMap = new Map(
      funnelAnalytics.map(a => [format(a.date, 'yyyy-MM-dd'), a])
    );

    const trends = dateRange.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const analytics = analyticsMap.get(dateKey);
      return {
        date: dateKey,
        totalStarts: analytics?.totalStarts || 0,
        totalCompletions: analytics?.totalCompletions || 0,
        conversionRate: analytics?.conversionRate || 0,
      };
    });

    return NextResponse.json({
      success: true,
      funnel: {
        id: funnel.id,
        name: funnel.name,
        totalSteps: funnel.totalSteps,
      },
      metrics: {
        totalStarts,
        totalCompletions,
        totalAbandoned: totalStarts - totalCompletions,
        conversionRate: conversionRate.toFixed(2),
        abandonmentRate: totalStarts > 0 ? (((totalStarts - totalCompletions) / totalStarts) * 100).toFixed(2) : '0',
      },
      steps: Array.from(stepMetrics.values())
        .sort((a, b) => a.stepNumber - b.stepNumber)
        .map(step => ({
          stepNumber: step.stepNumber,
          stepName: step.stepName,
          stepKey: step.stepKey,
          entries: step.entries,
          exits: step.exits,
          continues: step.conversions,
          conversionRate: step.avgConversionRate,
          dropOffRate: step.avgDropOffRate,
        })),
      trends,
    });
  } catch (error) {
    console.error('[API] Error fetching analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
