'use client';

// Quiz flow: intro (consent a) -> core blocks 1-5 with facet-unlock interstitials ->
// wellbeing opt-in -> optional block 6 -> server-side complete -> gate.
// Engagement mechanics: segmented facet progress (collection effect), unlock
// celebrations at block boundaries, question slide-in, autosave reassurance.
// localStorage is the primary autosave (resume-safe); the server gets debounced
// batches every SYNC_EVERY answers and a final flush before /complete.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITEMS, LIKERT_OPTIONS, PHQ4_OPTIONS } from '@/lib/seed/items';
import {
  BLOCK_META,
  CONSENTS,
  CONSENT_TEXT_VERSION,
  DISCLAIMER_PRE_TEST,
  MOTIVATORS,
  WELLBEING_INTRO,
} from '@/lib/content/copy';
import { track } from '@/lib/analytics';
import LikertScale from './LikertScale';

const STORAGE_KEY = 'facettn:quiz:v1';
const SYNC_EVERY = 4;

interface StoredAnswer {
  value: number;
  timeMs: number;
  synced?: boolean;
}

interface QuizState {
  sessionId: string | null;
  answers: Record<string, StoredAnswer>;
  index: number;
  wellbeing: 'pending' | 'accepted' | 'skipped';
  phase: 'intro' | 'questions' | 'motivator' | 'wellbeing-optin' | 'finishing';
}

const CORE_FLOW = ITEMS.filter((i) => i.module === 'core');
const WELLBEING_FLOW = ITEMS.filter((i) => i.module === 'wellbeing');
const CORE_BLOCKS = [1, 2, 3, 4, 5];

function loadState(): QuizState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuizState) : null;
  } catch {
    return null;
  }
}

function saveState(s: QuizState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage full/blocked — server sync still works */
  }
}

export default function QuizShell() {
  const router = useRouter();
  const [state, setState] = useState<QuizState>({
    sessionId: null,
    answers: {},
    index: 0,
    wellbeing: 'pending',
    phase: 'intro',
  });
  const [hydrated, setHydrated] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [consentA, setConsentA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const questionShownAt = useRef<number>(Date.now());
  const unsyncedCount = useRef(0);

  useEffect(() => {
    const stored = loadState();
    if (stored?.sessionId && stored.phase !== 'intro') {
      setState({ ...stored, phase: stored.phase === 'finishing' ? 'questions' : stored.phase });
      setResumed(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const flow = useMemo(
    () => (state.wellbeing === 'accepted' ? [...CORE_FLOW, ...WELLBEING_FLOW] : CORE_FLOW),
    [state.wellbeing],
  );
  const currentItem = flow[state.index];
  const progress = Math.min(100, Math.round((state.index / flow.length) * 100));
  const remainingMin = Math.max(1, Math.ceil(((flow.length - state.index) * 7) / 60));
  const currentBlock = currentItem?.block ?? 6;

  /** Per-block completion 0..1 for the segmented facet bar. */
  const blockProgress = useMemo(() => {
    const map = new Map<number, { total: number; done: number }>();
    flow.forEach((item, i) => {
      const acc = map.get(item.block) ?? { total: 0, done: 0 };
      acc.total += 1;
      if (i < state.index) acc.done += 1;
      map.set(item.block, acc);
    });
    return map;
  }, [flow, state.index]);

  const syncBatch = useCallback(async (s: QuizState, force = false) => {
    if (!s.sessionId) return;
    const unsynced = Object.entries(s.answers).filter(([, a]) => !a.synced);
    if (unsynced.length === 0) return;
    if (!force && unsynced.length < SYNC_EVERY) return;
    try {
      const res = await fetch(`/api/session/${s.sessionId}/responses`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          responses: unsynced.map(([itemId, a]) => ({
            itemId,
            value: a.value,
            responseTimeMs: a.timeMs,
          })),
        }),
      });
      if (res.ok) {
        setState((prev) => {
          const answers = { ...prev.answers };
          for (const [id] of unsynced) {
            if (answers[id]) answers[id] = { ...answers[id], synced: true };
          }
          return { ...prev, answers };
        });
      }
    } catch {
      /* offline — retried on the next batch / final flush */
    }
  }, []);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ consentA: true, textVersion: CONSENT_TEXT_VERSION }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const { sessionId } = (await res.json()) as { sessionId: string };
      track('test_started');
      questionShownAt.current = Date.now();
      setState((prev) => ({ ...prev, sessionId, phase: 'questions', index: 0 }));
    } catch {
      setError('Der Test konnte nicht gestartet werden. Bitte versuche es gleich noch einmal.');
    } finally {
      setBusy(false);
    }
  }

  function answer(value: number) {
    if (!currentItem) return;
    const timeMs = Date.now() - questionShownAt.current;
    const answers = {
      ...state.answers,
      [currentItem.id]: { value, timeMs, synced: false },
    };
    track('question_answered', { position: currentItem.position });

    const nextIndex = state.index + 1;
    const nextItem = flow[nextIndex];
    const blockDone = nextItem && nextItem.block !== currentItem.block;
    const coreDone = nextIndex >= CORE_FLOW.length && state.wellbeing !== 'accepted';
    const allDone = nextIndex >= flow.length;

    let next: QuizState;
    if (allDone || coreDone) {
      if (state.wellbeing === 'pending' && coreDone) {
        next = { ...state, answers, index: nextIndex, phase: 'wellbeing-optin' };
      } else {
        next = { ...state, answers, index: nextIndex, phase: 'finishing' };
      }
    } else if (blockDone) {
      track('block_completed', { block: currentItem.block });
      next = { ...state, answers, index: nextIndex, phase: 'motivator' };
    } else {
      next = { ...state, answers, index: nextIndex, phase: 'questions' };
    }
    setState(next);
    unsyncedCount.current += 1;
    if (unsyncedCount.current >= SYNC_EVERY) {
      unsyncedCount.current = 0;
      void syncBatch(next);
    }
    questionShownAt.current = Date.now();
  }

  const finish = useCallback(async () => {
    if (!state.sessionId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await syncBatch(state, true);
      const res = await fetch(`/api/session/${state.sessionId}/complete`, { method: 'POST' });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const { token } = (await res.json()) as { token: string; crisis: boolean };
      track('test_completed');
      sessionStorage.setItem('facettn:lastSession', state.sessionId);
      sessionStorage.setItem('facettn:lastToken', token);
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/gate?t=${token}&s=${state.sessionId}`);
    } catch {
      setError('Speichern fehlgeschlagen — deine Antworten sind lokal gesichert. Bitte erneut versuchen.');
      setBusy(false);
    }
  }, [state, busy, router, syncBatch]);

  useEffect(() => {
    if (state.phase === 'finishing') void finish();
  }, [state.phase, finish]);

  if (!hydrated) return null;

  // ---------- Intro ----------
  if (state.phase === 'intro') {
    return (
      <div className="quiz-enter">
        <div className="card">
          <h1>Dein Test in 5 Facetten</h1>
          <p>{DISCLAIMER_PRE_TEST}</p>
          <div className="facet-preview">
            {CORE_BLOCKS.map((b) => (
              <span key={b} className="facet-chip">
                <span className="idx" aria-hidden>{BLOCK_META[b].num}</span> {BLOCK_META[b].name}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
            5 Facetten, ~8 Minuten. Dein Fortschritt wird automatisch gespeichert — du kannst
            jederzeit pausieren und später weitermachen.
          </p>
          <label className="consent-row">
            <input
              type="checkbox"
              checked={consentA}
              onChange={(e) => setConsentA(e.target.checked)}
              aria-required="true"
            />
            <span>{CONSENTS.a}</span>
          </label>
          {error ? <p role="alert" style={{ color: 'var(--danger)' }}>{error}</p> : null}
          <button className="btn" onClick={start} disabled={!consentA || busy}>
            {busy ? 'Einen Moment …' : 'Los geht’s'}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Facet unlocked (motivator) ----------
  if (state.phase === 'motivator') {
    const lastBlock = flow[state.index - 1]?.block ?? 1;
    const meta = BLOCK_META[lastBlock];
    const collected = CORE_BLOCKS.filter((b) => b <= lastBlock);
    return (
      <div className="motivator quiz-enter">
        <div className="facet-unlock" aria-hidden>✓</div>
        <p className="facet-unlock-label">
          Facette {meta.num} von 05 gesichert
        </p>
        <h2>{meta.name}</h2>
        <p style={{ color: 'var(--ink-soft)' }}>{MOTIVATORS[lastBlock] ?? 'Weiter geht’s!'}</p>
        <div className="facet-preview" style={{ justifyContent: 'center' }}>
          {CORE_BLOCKS.map((b) => (
            <span key={b} className={`facet-chip ${collected.includes(b) ? 'collected' : ''}`}>
              <span className="idx" aria-hidden>{collected.includes(b) ? '✓' : BLOCK_META[b].num}</span>{' '}
              {BLOCK_META[b].name}
            </span>
          ))}
        </div>
        <div style={{ maxWidth: 320, margin: '20px auto 0' }}>
          <button
            className="btn"
            autoFocus
            onClick={() => {
              questionShownAt.current = Date.now();
              setState((prev) => ({ ...prev, phase: 'questions' }));
            }}
          >
            Nächste Facette →
          </button>
        </div>
      </div>
    );
  }

  // ---------- Wellbeing opt-in ----------
  if (state.phase === 'wellbeing-optin') {
    return (
      <div className="card quiz-enter">
        <p className="facet-unlock-label">Alle fünf Facetten gesichert</p>
        <h2 style={{ marginTop: 4 }}>Optional: Dein Wohlbefinden</h2>
        <p>{WELLBEING_INTRO}</p>
        <button
          className="btn"
          onClick={() => {
            questionShownAt.current = Date.now();
            setState((prev) => ({ ...prev, wellbeing: 'accepted', phase: 'questions' }));
          }}
        >
          Fragen beantworten (16 Fragen, ~2 Min.)
        </button>
        <button
          className="link-quiet"
          onClick={() => setState((prev) => ({ ...prev, wellbeing: 'skipped', phase: 'finishing' }))}
        >
          Überspringen und zum Ergebnis
        </button>
      </div>
    );
  }

  // ---------- Finishing ----------
  if (state.phase === 'finishing' || !currentItem) {
    return (
      <div className="motivator quiz-enter">
        <div className="facet-unlock pulse" aria-hidden>…</div>
        <h2>Dein Profil wird berechnet</h2>
        {error ? (
          <>
            <p role="alert" style={{ color: 'var(--danger)' }}>{error}</p>
            <div style={{ maxWidth: 320, margin: '16px auto' }}>
              <button className="btn" onClick={() => void finish()}>Erneut versuchen</button>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  // ---------- Question ----------
  const options = currentItem.responseFormat === 'phq4' ? PHQ4_OPTIONS : LIKERT_OPTIONS;
  const isWellbeing = currentItem.module === 'wellbeing';
  const blocks = state.wellbeing === 'accepted' ? [...CORE_BLOCKS, 6] : CORE_BLOCKS;

  return (
    <div>
      {resumed && state.index > 0 ? (
        <p className="resume-note" role="status">
          Willkommen zurück — dein Fortschritt wurde wiederhergestellt. ✓
        </p>
      ) : null}

      <div className="facet-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
        {blocks.map((b) => {
          const bp = blockProgress.get(b);
          const pct = bp ? Math.round((bp.done / bp.total) * 100) : 0;
          return (
            <div key={b} className={`facet-segment ${b === currentBlock ? 'active' : ''}`}>
              <div className="facet-segment-fill" style={{ width: `${pct}%` }} />
            </div>
          );
        })}
      </div>
      <div className="progress-meta">
        <span className="facet-name">
          {BLOCK_META[currentBlock]?.num} · {BLOCK_META[currentBlock]?.name}
        </span>
        <span>
          {state.index + 1}/{flow.length} · ~{remainingMin} Min.
        </span>
      </div>

      <div className="quiz-enter" key={currentItem.id}>
        {isWellbeing ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginTop: 16 }}>
            Wie oft warst du in den letzten zwei Wochen beeinträchtigt durch:
          </p>
        ) : null}
        <p className="question-text">{currentItem.textDe}</p>
        <LikertScale
          name={currentItem.id}
          options={options}
          value={state.answers[currentItem.id]?.value}
          onSelect={answer}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {state.index > 0 ? (
          <button
            className="link-quiet"
            onClick={() => {
              questionShownAt.current = Date.now();
              setState((prev) => ({ ...prev, index: Math.max(0, prev.index - 1), phase: 'questions' }));
            }}
          >
            ← Zurück
          </button>
        ) : (
          <span />
        )}
        <span className="autosave-hint" aria-hidden>
          automatisch gespeichert
        </span>
      </div>
    </div>
  );
}
