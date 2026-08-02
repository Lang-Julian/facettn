# Facettn

**A multidimensional personality self-test that stores nothing about you.**

No account. No e-mail gate. No database. No cookies, no analytics, no tracking.
Your answers are scored **in your browser** and your result lives in the URL
fragment — the part after `#`, which browsers never send to a server.

German-language instrument · MIT licensed · [What this is not](#what-this-is-not)

---

## Why this exists

Most online personality tests follow the same script: answer forty questions, get a
teaser, hit a wall. *Enter your e-mail to unlock your full result.* The test was
never the product. You were.

Facettn is the counter-example. The full evaluation appears immediately, at full
depth. There is no e-mail field because there is no list. There is no delete
function because there is no database. And because privacy promises are worth
nothing if nobody can check them, the entire thing is open source — the questions,
the weight of every single answer, the formulas, the wording.

## How the no-storage part actually works

The trick is unspectacular and thirty years old: the **URL fragment**.

```
facettn.de/ergebnis#v1.4315224…
                    └─ never leaves the browser
```

Browsers treat everything after `#` differently from the rest of a URL. It is not
in the HTTP request line, not in `Referer` headers, not in any server log. It
exists only on the devices that hold the link.

The payload is deliberately boring: one digit per answer, in canonical item order,
prefixed with a format version. Not encrypted, not obfuscated — you can decode your
own link by hand. A system whose data handling can be verified by reading a URL does
not need to be believed.

On page load the browser decodes those digits, runs the scoring engine locally and
renders the report. You can switch off your network after loading and it still works.

Two consequences worth knowing:

- **The link is the result.** Bookmark it to come back. Lose it and the result is
  gone — for everyone, because it never existed anywhere else.
- **Sharing means sharing.** Anyone with the link sees the profile. The optional
  wellbeing module (PHQ-9/GAD-7) is stripped from share links automatically; it
  contains the item about self-harm and has no business travelling in a shared URL.

## The instrument

| | |
|---|---|
| Items | 119 core + 3 attention checks + 3 social-desirability + 16 optional wellbeing |
| Duration | ~15 minutes |
| Scales | 5 Big Five domains with 3 facets each, ADHD (2 facets), autistic traits (6 facets), masking, 4 dark-trait scales, cognitive/affective empathy, 3 attachment scales, 6 love styles, 3 sensitivity scales |
| Output | Archetype, 10-axis radar, facet-level bars, detected cross-dimension patterns, myths vs. facts, practical suggestions |

Items deliberately **cross-load** onto several scales. That is not a shortcut to
fewer questions — it reflects that traits genuinely overlap. Someone who acts on
impulse may be doing so from ADHD-typical impulse control or from a considered
disregard for rules; the surrounding items decide which reading holds.

The test is long on purpose. With twenty questions you cannot tell whether someone
is disorganised *and* unreliable or disorganised *but* rock-solid — and that
distinction is the interesting part. Hence facets under every domain.

### What this is not

Not a diagnostic or screening instrument. It describes personality tendencies —
"Züge", not conditions. Nothing here detects, screens for or diagnoses anything, and
the wording is kept that way deliberately (see the note in `src/lib/content/copy.ts`).
For real clarity under real distress you need people, not a website.

## Licensing of the items

Every core item is an **original German formulation** written for this project.
They are informed by published *constructs* — the Big Five facet structure
(IPIP/BFI-2), the DSM-5 attention and hyperactivity domains, camouflaging research,
the triarchic psychopathy model, ECR attachment dimensions, sensory-processing
sensitivity — but reproduce no wording from any copyrighted scale. That keeps the
repository MIT-clean.

The only verbatim instruments are **PHQ-9 and GAD-7** (German version; Löwe,
Spitzer, Zipfel & Herzog, translation Universitätsklinik Heidelberg), which the
rights holder released for free reproduction.

This project is not affiliated with the authors of any referenced original instrument.

## Architecture

```
src/lib/engine/      Pure scoring: reverse coding, cross-loading normalization,
                     Φ-percentiles, bands, validity flags, archetype resolution,
                     match formula. No I/O, fully unit-tested.
src/lib/seed/        Items + loading matrix (co-located), scales with facets,
                     archetypes, published norms.
src/lib/share/       The URL payload codec.
src/lib/content/     Dimension copy, cross-dimension pattern rules, legal wording.
src/lib/profile.ts   Answers → full profile. Runs client-side.
src/app/             Landing, /test, /ergebnis, /vergleich, /transparenz,
                     /archetyp/[slug] (static), legal pages.
```

There is no `api/` directory, no database client and no ORM. That absence is the
feature.

## Development

```bash
npm ci
npm run dev        # http://localhost:3000
npm test           # 48 unit tests
npm run typecheck && npm run lint && npm run build
```

Everything is statically renderable — no server-side state, no environment
variables required to run or deploy. Host it anywhere that serves files.

## Contributing

Found a badly worded item, a questionable weight, or a flaw in the scoring? That is
a welcome contribution, not a nuisance. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Status and honest caveats

- The self-written items are **not yet psychometrically validated**. A pilot study
  (N ≥ 300) is needed before any claim about reliability or factor structure.
- Percentiles exist only for the Big Five domains (German BFI-2 reference sample,
  Danner et al. 2019, N = 770). Other scales report raw values without population
  comparison rather than inventing one.
- Cross-loading weights are theory-driven starting values awaiting empirical
  calibration.
- The Impressum and privacy pages contain `[TODO]` placeholders. German law requires
  a real Impressum before a public deployment.

## License

MIT — see [LICENSE](LICENSE).
