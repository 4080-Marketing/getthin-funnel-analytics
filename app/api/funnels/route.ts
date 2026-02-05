import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/funnels
 * List all funnels with basic metrics from database
 */
export async function GET() {
  try {
    // Get funnels from database
    const dbFunnels = await prisma.funnel.findMany({
      include: {
        _count: {
          select: { steps: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (dbFunnels.length === 0) {
      // Return empty state - funnel will be created when webhook receives data
      return NextResponse.json({
        funnels: [],
        message: 'No funnels yet. Data will appear once Embeddables webhook sends entries.',
      });
    }

    // Get latest analytics for each funnel
    const funnelsWithAnalytics = await Promise.all(
      dbFunnels.map(async (funnel) => {
        const latestAnalytics = await prisma.funnelAnalytics.findFirst({
          where: { funnelId: funnel.id },
          orderBy: { date: 'desc' },
        });

        return {
          id: funnel.id,
          embeddablesId: funnel.embeddablesId,
          name: funnel.name,
          description: funnel.description,
          totalSteps: funnel.totalSteps,
          status: funnel.status,
          lastUpdated: funnel.updatedAt.toISOString(),
          metrics: latestAnalytics
            ? {
                conversionRate: latestAnalytics.conversionRate,
                totalStarts: latestAnalytics.totalStarts,
                totalCompletions: latestAnalytics.totalCompletions,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ funnels: funnelsWithAnalytics });
  } catch (error) {
    console.error('[API] Error fetching funnels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnels', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
