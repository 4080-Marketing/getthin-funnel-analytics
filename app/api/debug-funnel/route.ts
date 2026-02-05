import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to see actual funnel structure from Embeddables
 */
export async function GET() {
  const apiKey = process.env.EMBEDDABLES_API_KEY;
  const projectId = process.env.EMBEDDABLES_PROJECT_ID;

  if (!apiKey || !projectId) {
    return NextResponse.json({ error: 'API not configured' }, { status: 500 });
  }

  const response = await fetch(
    `https://api.embeddables.com/projects/${projectId}/entries-page-views?limit=100`,
    {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'API error' }, { status: 500 });
  }

  const entries = await response.json();

  // Analyze the funnel structure
  const stepMap = new Map<number, { key: string; count: number }>();
  const maxStepsPerEntry: number[] = [];
  let completedCount = 0;

  for (const entry of entries) {
    const pageViews = entry.page_views || [];

    if (pageViews.length > 0) {
      const maxIdx = Math.max(...pageViews.map((pv: any) => pv.page_index));
      maxStepsPerEntry.push(maxIdx);
    }

    for (const pv of pageViews) {
      const existing = stepMap.get(pv.page_index);
      if (existing) {
        existing.count++;
      } else {
        stepMap.set(pv.page_index, { key: pv.page_key, count: 1 });
      }
    }

    // Check if entry_data has completion markers
    if (entry.entry_data) {
      try {
        const data = JSON.parse(entry.entry_data);
        if (data.completed || data.status === 'completed' || data.product) {
          completedCount++;
        }
      } catch {}
    }
  }

  // Sort steps by index
  const steps = Array.from(stepMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, data]) => ({
      index,
      key: data.key,
      count: data.count,
    }));

  // Find distribution of max steps reached
  const stepDistribution: Record<number, number> = {};
  for (const max of maxStepsPerEntry) {
    stepDistribution[max] = (stepDistribution[max] || 0) + 1;
  }

  return NextResponse.json({
    totalEntries: entries.length,
    completedWithProductData: completedCount,
    totalSteps: steps.length,
    steps,
    maxStepDistribution: stepDistribution,
    sampleEntry: entries[0] ? {
      entry_id: entries[0].entry_id,
      page_views_count: entries[0].page_views?.length,
      has_entry_data: !!entries[0].entry_data,
      entry_data_preview: entries[0].entry_data?.substring(0, 500),
    } : null,
  });
}
