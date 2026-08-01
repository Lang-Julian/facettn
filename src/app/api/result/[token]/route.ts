// GET /api/result/:token — public, token-validated. ?teaser=1 returns only the
// archetype name + coarse radar silhouette (for the gate blur teaser).
// 404 unknown token, 410 expired.

import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { ARCHETYPE_BY_ID } from '@/lib/seed/archetypes';
import { radarValues, RADAR_SCALES } from '@/lib/content/dimensions';

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!/^[a-f0-9]{32}$/.test(token)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const found = await getStore().getResultByToken(token);
  if (!found) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (found.expired) return NextResponse.json({ error: 'expired' }, { status: 410 });

  const { result } = found;
  const archetype = ARCHETYPE_BY_ID.get(result.archetypeId);

  if (req.nextUrl.searchParams.get('teaser') === '1') {
    // Coarse silhouette only (rounded to 5) — no numeric detail scores.
    return NextResponse.json({
      archetypeNameDe: archetype?.nameDe ?? '',
      archetypeNameEn: archetype?.nameEn ?? '',
      radar: radarValues(result.scores).map((v) => Math.round(v / 5) * 5),
      crisis: result.crisis,
    });
  }

  return NextResponse.json({
    archetype: archetype
      ? {
          id: archetype.id,
          nameDe: archetype.nameDe,
          nameEn: archetype.nameEn,
          descriptionDe: archetype.descriptionDe,
          strengths: archetype.strengths,
          growthAreas: archetype.growthAreas,
        }
      : null,
    scores: result.scores,
    percentiles: result.percentiles,
    bands: result.bands,
    validity: result.validity,
    crisis: result.crisis,
    radarAxes: RADAR_SCALES.map((s) => s.label),
    radarValues: radarValues(result.scores),
  });
}
