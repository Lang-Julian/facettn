# Facettn (working title)

Mobile-first multidimensional personality self-test — **Edutainment/self-reflection,
explicitly NOT a diagnostic or screening instrument** (MDR Rule 11 positioning).
One questionnaire (57 substantive items + 3 attention checks + 3 social-desirability
items + optional PHQ-9/GAD-7 wellbeing module), items cross-load onto multiple scales,
result is a 10-axis radar profile with one of 14 archetypes.

Built from the three planning docs (Masterplan / Blueprint Phase 2 / Dev-Spec Phase 3).

## Quick start (local)

```bash
npm ci
npm run dev        # http://localhost:3000 — file store in .data/, mails logged to console
npm test           # engine unit tests (spec fixtures 1–5 + properties), 31 tests
npm run typecheck && npm run lint
```

Production mode requires `SESSION_SECRET` (see `.env.example`):

```bash
SESSION_SECRET=... npm run build && SESSION_SECRET=... npm start
BASE=http://localhost:3000 npx tsx scripts/smoke.ts   # 25-check API E2E
```

## Architecture

```
src/lib/engine/      Pure scoring engine (no DB/framework). Reverse coding, cross-loading
                     normalization, Φ-percentiles, bands, validity flags, archetype
                     resolution, match formula, wellbeing sums + crisis guardrail.
src/lib/seed/        SSOT for items (client-safe), loadings (SERVER-ONLY), scales,
                     archetypes, norms. scripts/seed.ts pushes these into Supabase.
src/lib/store/       Persistence adapter: FileStore (.data/, local dev) or SupabaseStore
                     (service role, eu-central-1) — selected via env.
src/lib/server/      Scoring glue, cookie signing (HMAC), email hash/AES-256-GCM
                     encryption, in-memory rate limiting, Brevo mails, match insights.
src/app/api/         session / responses (batch autosave) / complete (idempotent,
                     server-side scoring) / email-gate / result (+teaser) / match /
                     og (Satori share image) / confirm (DOI) / me (GDPR delete).
src/app/             / (landing) /test (quiz) /gate /ergebnis/[token]
                     /vergleich/[token] /archetyp/[slug] (SSG) /datenschutz /impressum
supabase/migrations/ Full schema + RLS (deny-all except reference reads).
```

**Security/compliance invariants (do not weaken):**

- Scoring runs **only server-side**; the loading matrix (`seed/loadings.ts`) is never
  imported by client components.
- Consent (a) is required to create a session (403 otherwise); b/c/d are recorded
  audit-proof with text version + hashed IP. Match requires **mutual** consent (d).
- Crisis guardrail: PHQ-9 item 9 > 0 or sum ≥ 15 → non-dismissable banner above all
  results (also on the gate teaser).
- Result e-mails contain only the token link, never scores. OG images contain only
  archetype name + radar silhouette.
- Copy is MDR-sensitive: "Züge/Tendenzen", never "Diagnose/Screening/Verdacht auf".
  Verbatim legal copy lives in `src/lib/content/copy.ts`.

## Engagement mechanics (completion ≥ 70 % target)

- 5 blocks = 5 collectible "Facetten" with unlock celebrations at block boundaries.
- Segmented sticky progress bar (per-block fill), question count + remaining minutes.
- One question per screen, tap-to-advance with confirmation flash; keyboard users get
  an explicit "Weiter" button (a11y: no auto-advance on focus).
- localStorage autosave + resume ("Willkommen zurück"); server batch sync every 4 answers.
- Gate after the last question with blur teaser; skip link in every variant (no dark pattern).

## Production deployment

1. Supabase project in `eu-central-1` → run `supabase/migrations/0001_init.sql`,
   verify `select tablename from pg_tables where schemaname='public' and not rowsecurity;`
   is **empty**, then `npm run seed:supabase`.
2. Vercel: `vercel.json` pins `fra1`. Env: `SESSION_SECRET`, `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, `EMAIL_FROM`, `APP_BASE_URL`,
   optionally `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
3. Enable the pg_cron purge job (commented at the bottom of the migration).
4. Swap the in-memory rate limiter for @upstash/ratelimit in `middleware.ts` once
   traffic runs on more than one function instance.
5. Sign DPAs: Vercel, Supabase, Brevo, Plausible (and Sentry if added).

## Known gaps / before launch (Phase 0 gates)

- **Legal review is mandatory** (MDR intended purpose, HWG, GDPR Art. 9 concept,
  final item-license check). Impressum/Datenschutz contain `[TODO]` placeholders.
- **Blueprint inconsistency:** the Phase-2 doc claims 58 items but enumerates 57
  (i01–i57). Implemented: the 57 enumerated items.
- **Norms:** BFI-2 DE_total (Danner 2019) + pooled PHQ-9/GAD-7 are live; all other
  scales use score100 as provisional pseudo-percentile until own norm data exists
  (N ≥ 1000 → switch). ASRS Prozentrang tables are paywalled — add as
  `percentile_table` when the manual is available.
- Own items (autism/masking/dark/love/HSP/RS/alexithymia) are legally independent
  but **not yet psychometrically validated** — pilot study (N ≥ 300) before scale
  claims.
- No Playwright E2E yet; `scripts/smoke.ts` covers the API flow (25 checks).
- Sentry EU + A/B testing (server-side bucketing) not wired yet.
