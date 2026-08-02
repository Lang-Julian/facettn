# Contributing

Criticism of the instrument is the most valuable contribution here. A badly worded
item, a weight that does not survive scrutiny, a pattern rule that fires too eagerly —
those are the things that decide whether this test is worth anything.

## Ground rules that are not negotiable

**1. No copyrighted item wording.** Every core item must be an original formulation.
You may be informed by a published construct; you may not paraphrase a protected
scale closely enough that its authors would recognise their sentence. This keeps the
project MIT-licensable. PHQ-9 and GAD-7 are the sole exception, because their rights
holder explicitly released them.

**2. No diagnostic or screening language.** The product is Edutainment and
self-reflection. Words like "Diagnose", "Screening" or "Verdacht auf" would turn it
into a regulated medical device under EU MDR Rule 11. Write "Züge", "Tendenzen",
"Ausprägung". This applies to marketing copy too — the intended purpose is
determined by what the product claims about itself, everywhere.

**3. Nothing may be transmitted or stored.** No API routes, no analytics, no
telemetry, no font CDN, no third-party embed, no cookie. If a feature needs a
server, it does not belong here. This is the whole premise.

**4. The wellbeing module stays out of share links.** `stripWellbeing()` exists
because that block contains the item about self-harm. Any new sharing surface must
use the stripped payload.

**5. The crisis guardrail cannot be weakened.** PHQ-9 item 9 > 0 or a sum ≥ 15 shows
the crisis banner above everything else, and it is not dismissable.

## Changing items or the loading matrix

Items and their loadings live together in `src/lib/seed/items.ts` so that the
scoring is as readable as the questions.

- Adding, removing or reordering core items **changes the meaning of every existing
  link**. Bump `PAYLOAD_VERSION` in `src/lib/share/payload.ts` when you do. Old links
  then fail loudly instead of being silently misread against the new questionnaire —
  that failure mode is intentional and must not be "fixed".
- Every scale needs at least two primary items; a test enforces this.
- No more than three items of one scale may run back to back; a test enforces this too.
- Cross-loadings should have a defensible reason. Put it in the commit message.

## Pattern rules

`src/lib/content/patterns.ts` holds the cross-dimension interpretations. Keep them
conservative: a rule should need a clear configuration to fire, cite research where
it makes an empirical claim, and end with something the reader can actually do.

Never write a rule that pathologises a profile. "Bedeutet nicht"-framing is not
decoration.

## Before opening a pull request

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

Write commit messages that explain *why*. For psychometric changes, that matters more
than the diff.

## Tone

The result text speaks to a person reading something personal about themselves.
Strengths come first, plain language beats jargon, and every claim that sounds like a
finding needs either a source or a hedge. When in doubt, be more careful, not more
confident.
