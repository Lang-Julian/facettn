// Crisis guardrail banner (Epic E1): rendered ABOVE all results, NOT dismissable.
// Triggered by PHQ-9 item 9 > 0 or PHQ-9 sum >= 15.

import { CRISIS_BANNER } from '@/lib/content/copy';

export default function CrisisBanner() {
  return (
    <div className="crisis-banner" role="alert">
      <strong>{CRISIS_BANNER.title}</strong>
      {CRISIS_BANNER.lines.map((line) => (
        <p key={line.slice(0, 20)}>{line}</p>
      ))}
    </div>
  );
}
