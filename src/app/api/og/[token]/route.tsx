// GET /api/og/:token?format=og|story — share image via next/og (Satori).
// Satori constraints (Dev-Spec §6): flexbox only, no display:grid, pure SVG radar
// (no Recharts), bundled/default fonts only, < 500 KB total.
// Privacy by design: archetype name + radar silhouette ONLY — no scores, no scale
// names, no percentiles in the image.

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getStore } from '@/lib/store';
import { ARCHETYPE_BY_ID } from '@/lib/seed/archetypes';
import { radarValues } from '@/lib/content/dimensions';
import { radarGridPoints, radarPolygonPoints } from '@/lib/radar';

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const found = /^[a-f0-9]{32}$/.test(token) ? await getStore().getResultByToken(token) : null;
  if (!found || found.expired) {
    return new Response('not found', { status: 404 });
  }

  const archetype = ARCHETYPE_BY_ID.get(found.result.archetypeId);
  const story = req.nextUrl.searchParams.get('format') === 'story';
  const width = story ? 1080 : 1200;
  const height = story ? 1920 : 630;
  const radarSize = story ? 560 : 360;
  const values = radarValues(found.result.scores);
  const c = radarSize / 2;
  const r = radarSize / 2 - 12;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: story ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          background: '#1a1926',
          color: '#fbfbfd',
          fontFamily: 'sans-serif',
          padding: 60,
        }}
      >
        <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
          {[100, 75, 50, 25].map((lvl) => (
            <polygon
              key={lvl}
              points={radarGridPoints(c, c, (r * lvl) / 100, values.length)}
              fill="none"
              stroke="rgba(251,251,253,0.14)"
              strokeWidth={1}
            />
          ))}
          <polygon
            points={radarPolygonPoints(values, c, c, r)}
            fill="rgba(145,143,232,0.22)"
            stroke="#918fe8"
            strokeWidth={2}
          />
        </svg>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: story ? 'center' : 'flex-start',
            gap: 14,
            maxWidth: 560,
          }}
        >
          <div style={{ fontSize: 22, opacity: 0.6, letterSpacing: 7, textTransform: 'uppercase' }}>
            Mein Archetyp
          </div>
          <div
            style={{
              fontSize: story ? 72 : 60,
              fontWeight: 700,
              letterSpacing: -1,
              textAlign: story ? 'center' : 'left',
            }}
          >
            {archetype?.nameDe ?? 'Facettn'}
          </div>
          <div style={{ fontSize: 30, color: '#918fe8' }}>{archetype?.nameEn ?? ''}</div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid rgba(251,251,253,0.2)',
              fontSize: 22,
              opacity: 0.7,
            }}
          >
            Wie viele Facetten hast du? — facettn.de
          </div>
        </div>
      </div>
    ),
    { width, height },
  );
}
