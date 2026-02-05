import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Test endpoint to discover working Embeddables API endpoints
 */
export async function GET() {
  const apiKey = process.env.EMBEDDABLES_API_KEY;
  const projectId = process.env.EMBEDDABLES_PROJECT_ID;

  if (!apiKey) {
    return NextResponse.json({ error: 'EMBEDDABLES_API_KEY not set' }, { status: 500 });
  }

  const baseUrls = [
    'https://api.embeddables.com',
    'https://api.embeddables.com/v1',
    'https://embeddables.com/api',
    'https://embeddables.com/api/v1',
  ];

  const endpoints = [
    `/projects/${projectId}/entries`,
    `/projects/${projectId}/entries-page-views`,
    `/projects/${projectId}/flows`,
    `/projects/${projectId}/analytics`,
    `/projects/${projectId}`,
    `/entries`,
    `/flows`,
    `/projects`,
    `/v1/projects/${projectId}/entries`,
    `/v1/entries`,
  ];

  const results: Array<{
    url: string;
    status: number;
    ok: boolean;
    preview?: string;
  }> = [];

  for (const baseUrl of baseUrls) {
    for (const endpoint of endpoints) {
      const url = `${baseUrl}${endpoint}`;
      try {
        const response = await fetch(url, {
          headers: {
            'X-Api-Key': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        let preview = '';
        if (response.ok) {
          const text = await response.text();
          preview = text.substring(0, 500);
        }

        results.push({
          url,
          status: response.status,
          ok: response.ok,
          preview: preview || undefined,
        });
      } catch (error) {
        results.push({
          url,
          status: 0,
          ok: false,
          preview: error instanceof Error ? error.message : 'Network error',
        });
      }
    }
  }

  // Filter to show working endpoints first
  const working = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  return NextResponse.json({
    apiKeySet: !!apiKey,
    projectId,
    workingEndpoints: working,
    failedEndpoints: failed.map(f => ({ url: f.url, status: f.status })),
  });
}
