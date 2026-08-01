// Seed Supabase reference tables from the TypeScript seed modules (SSOT).
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:supabase

import { createClient } from '@supabase/supabase-js';
import { SCALES } from '../src/lib/seed/scales';
import { ITEMS } from '../src/lib/seed/items';
import { LOADINGS } from '../src/lib/seed/loadings';
import { ARCHETYPES } from '../src/lib/seed/archetypes';
import { NORMS } from '../src/lib/seed/norms';

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  const db = createClient(url, key, { auth: { persistSession: false } });

  const upsert = async (table: string, rows: unknown[], onConflict = 'id') => {
    const { error } = await db.from(table).upsert(rows as never[], { onConflict });
    if (error) throw new Error(`${table}: ${error.message}`);
    console.log(`✓ ${table}: ${rows.length} rows`);
  };

  await upsert(
    'scales',
    SCALES.map((s) => ({
      id: s.id,
      name_de: s.nameDe,
      dimension_group: s.dimensionGroup,
      norm_source: s.normSource ?? null,
    })),
  );

  await upsert(
    'items',
    ITEMS.map((i) => ({
      id: i.id,
      position: i.position,
      text_de: i.textDe,
      block: i.block,
      is_attention_check: i.isAttentionCheck,
      is_social_desirability: i.isSocialDesirability,
      module: i.module,
      response_format: i.responseFormat,
      reverse: i.reverse,
    })),
  );

  await upsert(
    'item_scale_loadings',
    LOADINGS.map((l) => ({
      item_id: l.itemId,
      scale_id: l.scaleId,
      weight: l.weight,
      direction: l.direction,
    })),
    'item_id,scale_id',
  );

  await upsert(
    'archetypes',
    ARCHETYPES.map((a) => ({
      id: a.id,
      name_de: a.nameDe,
      name_en: a.nameEn,
      description_de: a.descriptionDe,
      strengths: a.strengths,
      growth_areas: a.growthAreas,
      priority: a.priority,
    })),
  );

  // Norms have no natural PK in seed — replace wholesale.
  await db.from('norms').delete().neq('id', -1);
  const { error } = await db.from('norms').insert(
    NORMS.map((n) => ({
      scale_id: n.scaleId,
      population: n.population,
      norm_mean: n.normMean,
      norm_sd: n.normSd,
      percentile_table: n.percentileTable ?? null,
      source: n.source,
    })),
  );
  if (error) throw new Error(`norms: ${error.message}`);
  console.log(`✓ norms: ${NORMS.length} rows`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
