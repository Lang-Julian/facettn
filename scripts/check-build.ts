// Post-build assertions on the actual artefact that gets deployed.
//
// Some guarantees can only be checked after the export exists, because they are
// properties of the emitted HTML rather than of the source. The CSP is the sharp
// one: it needs 'unsafe-eval' in development (React Fast Refresh evaluates code at
// runtime) and must never carry it in production. A conditional like that is exactly
// the kind of thing that gets flattened during a refactor, and nothing in the test
// suite would notice — so it is verified here, against the shipped files.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';

function htmlFiles(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...htmlFiles(path));
    else if (entry.endsWith('.html')) found.push(path);
  }
  return found;
}

let failures = 0;
function check(label: string, ok: boolean, detail = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${ok || !detail ? '' : ` — ${detail}`}`);
  if (!ok) failures += 1;
}

let pages: string[];
try {
  pages = htmlFiles(OUT);
} catch {
  console.error(`✗ ${OUT}/ nicht gefunden — zuerst bauen.`);
  process.exit(1);
}

console.log(`\nPrüfe ${pages.length} exportierte Seiten\n`);

check('Export ist nicht leer', pages.length > 0);

const withoutCsp = pages.filter((p) => !readFileSync(p, 'utf8').includes('Content-Security-Policy'));
check('Jede Seite trägt eine CSP', withoutCsp.length === 0, withoutCsp.join(', '));

// The one that matters: the dev-only escape hatch must not be in the artefact.
const withEval = pages.filter((p) => readFileSync(p, 'utf8').includes('unsafe-eval'));
check("Keine Seite erlaubt 'unsafe-eval'", withEval.length === 0, withEval.join(', '));

// The privacy claim is enforced by the CSP being self-only. A third-party host here
// would contradict the transparency page, which states that nothing is loaded
// externally. data: is permitted for inline images only.
const foreign = pages.filter((p) => {
  const csp = /Content-Security-Policy"\s+content="([^"]+)"/.exec(readFileSync(p, 'utf8'))?.[1] ?? '';
  return /https?:\/\//.test(csp);
});
check('Keine CSP nennt einen fremden Host', foreign.length === 0, foreign.join(', '));

const base = process.env.BASE_PATH ?? '';
if (base) {
  const missing = pages.filter((p) => !readFileSync(p, 'utf8').includes(`${base}/_next/`));
  check(`Alle Seiten laden Assets unter ${base}`, missing.length === 0, missing.slice(0, 3).join(', '));
}

console.log('');
if (failures === 0) console.log('✓ Build-Prüfung bestanden\n');
else console.log(`✗ ${failures} Build-Prüfung(en) fehlgeschlagen\n`);
process.exit(failures === 0 ? 0 : 1);
