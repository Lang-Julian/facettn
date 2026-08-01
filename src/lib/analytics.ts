// Cookieless custom events via Plausible (no consent banner needed). No-op when
// Plausible is not configured. NEVER pass scores or PII as event properties.

type EventName =
  | 'test_started'
  | 'question_answered'
  | 'block_completed'
  | 'attention_check_failed'
  | 'test_completed'
  | 'gate_viewed'
  | 'email_submitted'
  | 'gate_skipped'
  | 'result_viewed'
  | 'section_expanded'
  | 'share_clicked'
  | 'compare_initiated'
  | 'match_completed';

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

export function track(event: EventName, props?: Record<string, string | number>): void {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, props ? { props } : undefined);
  }
}
