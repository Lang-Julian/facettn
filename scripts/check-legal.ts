// Pre-deploy gate: refuse to build a public site with an incomplete Impressum.
//
// Run by the Pages workflow before `next build`. Locally the site still builds and
// runs with placeholder legal pages — this only blocks the path that would make it
// publicly reachable, which is where the legal obligation actually attaches.
//
// Usage: npx tsx scripts/check-legal.ts

import { HOSTING, isLegalReady, missingLegalFields, OPERATOR } from '../src/lib/content/legal';

const missing = missingLegalFields();

if (!isLegalReady()) {
  console.error('\n✗ Deployment abgelehnt: Impressum unvollständig.\n');
  console.error(`  Fehlende Felder: ${missing.join(', ')}`);
  console.error('  Zu hinterlegen in: src/lib/content/legal.ts\n');
  console.error('  Eine öffentlich erreichbare deutschsprachige Seite braucht nach § 5 DDG');
  console.error('  vollständige Betreiberangaben. Ohne sie besteht ein reales Abmahnrisiko');
  console.error('  für die betreibende Person — deshalb bricht der Build hier ab.\n');
  process.exit(1);
}

console.log('✓ Impressum vollständig');
console.log(`  Betreiber: ${OPERATOR.name}, ${OPERATOR.postalCode} ${OPERATOR.city}`);
console.log(`  Hosting:   ${HOSTING.provider.split('(')[0].trim()}`);
