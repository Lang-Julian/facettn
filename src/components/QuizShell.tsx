'use client';

// The questionnaire. Everything here happens on the device: answers live in React
// state and localStorage, the result is encoded into a URL fragment at the end.
// There is no network call in this component — by design, not by omission.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITEMS, LIKERT_OPTIONS, PHQ4_OPTIONS } from '@/lib/seed/items';
import {
  BLOCK_META,
  DISCLAIMER_PRE_TEST,
  MOTIVATORS,
  PRIVACY_PROMISE,
  WELLBEING_INTRO,
} from '@/lib/content/copy';
import { encodePayload } from '@/lib/share/payload';
import LikertScale from './LikertScale';

const STORAGE_KEY = 'facettn:quiz:v2';

interface QuizState {
  answers: Record<string, number>;
  index: number;
  wellbeing: 'pending' | 'accepted' | 'skipped';
  phase: 'intro' | 'questions' | 'motivator' | 'wellbeing-optin';
}

const CORE_FLOW = ITEMS.filter((i) => i.module === 'core');
const WELLBEING_FLOW = ITEMS.filter((i) => i.module === 'wellbeing');
const CORE_BLOCKS = [1, 2, 3, 4, 5, 6];
const SECONDS_PER_ITEM = 7;

const initialState: QuizState = {
  answers: {},
  index: 0,
  wellbeing: 'pending',
  phase: 'intro',
};

export default function QuizShell() {
  const router = useRouter();
  const [state, setState] = useState<QuizState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [resumed, setResumed] = useState(false);
  const questionShownAt = useRef<number>(Date.now());
  // Focus moves to the question when a new one renders. Without this, keyboard and
  // screen-reader users stay parked on the old control and never hear the new item.
  const questionRef = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as QuizState;
        if (stored.phase !== 'intro' && Object.keys(stored.answers ?? {}).length > 0) {
          setState(stored);
          setResumed(true);
        }
      }
    } catch {
      /* corrupted or unavailable storage — start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked — the quiz still works, just without resume */
    }
  }, [state, hydrated]);

  const flow = useMemo(
    () => (state.wellbeing === 'accepted' ? [...CORE_FLOW, ...WELLBEING_FLOW] : CORE_FLOW),
    [state.wellbeing],
  );
  const currentItem = flow[state.index];
  const progress = Math.min(100, Math.round((state.index / flow.length) * 100));
  const remainingMin = Math.max(1, Math.ceil(((flow.length - state.index) * SECONDS_PER_ITEM) / 60));
  const currentBlock = currentItem?.block ?? 6;

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

  const finish = useCallback(
    (answers: Record<string, number>) => {
      const payload = encodePayload(answers);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      router.push(`/ergebnis#${payload}`);
    },
    [router],
  );

  function answer(value: number) {
    if (!currentItem) return;
    const answers = { ...state.answers, [currentItem.id]: value };

    const nextIndex = state.index + 1;
    const nextItem = flow[nextIndex];
    const coreDone = nextIndex >= CORE_FLOW.length && state.wellbeing !== 'accepted';
    const allDone = nextIndex >= flow.length;

    if (allDone || (coreDone && state.wellbeing === 'skipped')) {
      finish(answers);
      return;
    }
    if (coreDone && state.wellbeing === 'pending') {
      setState({ ...state, answers, index: nextIndex, phase: 'wellbeing-optin' });
      return;
    }
    if (nextItem && nextItem.block !== currentItem.block) {
      setState({ ...state, answers, index: nextIndex, phase: 'motivator' });
      questionShownAt.current = Date.now();
      return;
    }
    setState({ ...state, answers, index: nextIndex, phase: 'questions' });
    questionShownAt.current = Date.now();
    shouldFocus.current = true;
  }

  useEffect(() => {
    if (state.phase === 'questions' && shouldFocus.current && questionRef.current) {
      shouldFocus.current = false;
      questionRef.current.focus();
    }
  });

  if (!hydrated) return null;

  // ---------- Intro ----------
  if (state.phase === 'intro') {
    const totalMin = Math.round((CORE_FLOW.length * SECONDS_PER_ITEM) / 60);
    return (
      <div className="quiz-enter">
        <div className="card">
          <span className="kicker">Bevor es losgeht</span>
          <h1 style={{ marginTop: 10 }}>{CORE_FLOW.length} Fragen, etwa {totalMin} Minuten</h1>
          <p>{DISCLAIMER_PRE_TEST}</p>
          <p style={{ color: 'var(--ink-soft)' }}>
            Der Test ist bewusst lang. Kurztests mit zwanzig Fragen können Facetten nicht
            voneinander trennen — und genau dort liegt das Interessante.
          </p>
          <div className="facet-preview">
            {CORE_BLOCKS.map((b) => (
              <span key={b} className="facet-chip">
                <span className="idx">{BLOCK_META[b].num}</span> {BLOCK_META[b].name}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
            Dein Fortschritt wird lokal gesichert — du kannst jederzeit pausieren und später
            weitermachen, auch nach einem Neustart des Browsers.
          </p>
          <button className="btn" onClick={() => { questionShownAt.current = Date.now(); setState((p) => ({ ...p, phase: 'questions' })); }}>
            Test starten
          </button>
        </div>

        <div className="card promise">
          <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>{PRIVACY_PROMISE.headline}</h2>
          <ul className="promise-list">
            {PRIVACY_PROMISE.points.map((p) => (
              <li key={p.slice(0, 24)}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // ---------- Block completed ----------
  if (state.phase === 'motivator') {
    const lastBlock = flow[state.index - 1]?.block ?? 1;
    const meta = BLOCK_META[lastBlock];
    const collected = CORE_BLOCKS.filter((b) => b <= lastBlock);
    return (
      <div className="motivator quiz-enter">
        <div className="facet-unlock" aria-hidden>✓</div>
        <p className="facet-unlock-label">
          Abschnitt {meta.num} von 06
        </p>
        <h2>{meta.name}</h2>
        <p style={{ color: 'var(--ink-soft)' }}>{MOTIVATORS[lastBlock]}</p>
        <div className="facet-preview" style={{ justifyContent: 'center' }}>
          {CORE_BLOCKS.map((b) => (
            <span key={b} className={`facet-chip ${collected.includes(b) ? 'collected' : ''}`}>
              <span className="idx" aria-hidden>{collected.includes(b) ? '✓' : BLOCK_META[b].num}</span>{' '}
              {BLOCK_META[b].name}
            </span>
          ))}
        </div>
        <div style={{ maxWidth: 320, margin: '24px auto 0' }}>
          <button
            className="btn"
            autoFocus
            onClick={() => {
              questionShownAt.current = Date.now();
              setState((prev) => ({ ...prev, phase: 'questions' }));
            }}
          >
            Weiter
          </button>
        </div>
      </div>
    );
  }

  // ---------- Optional wellbeing module ----------
  if (state.phase === 'wellbeing-optin') {
    return (
      <div className="card quiz-enter">
        <p className="facet-unlock-label">Hauptteil abgeschlossen</p>
        <h2 style={{ marginTop: 4 }}>Optional: dein Wohlbefinden</h2>
        <p>{WELLBEING_INTRO}</p>
        <button
          className="btn"
          onClick={() => {
            questionShownAt.current = Date.now();
            setState((prev) => ({ ...prev, wellbeing: 'accepted', phase: 'questions' }));
          }}
        >
          Auch diese Fragen beantworten
        </button>
        <div style={{ textAlign: 'center' }}>
          <button
            className="link-quiet"
            onClick={() => finish(state.answers)}
          >
            Überspringen und Ergebnis ansehen
          </button>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  // ---------- Question ----------
  const options = currentItem.responseFormat === 'phq4' ? PHQ4_OPTIONS : LIKERT_OPTIONS;
  const isWellbeing = currentItem.module === 'wellbeing';
  const blocks = state.wellbeing === 'accepted' ? [...CORE_BLOCKS, 7] : CORE_BLOCKS;

  return (
    <div>
      {resumed && state.index > 0 ? (
        <p className="resume-note" role="status">
          Willkommen zurück — dein Fortschritt wurde wiederhergestellt.
        </p>
      ) : null}

      <div
        className="facet-track"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Fortschritt"
      >
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
      <div className="progress-meta" aria-live="polite" aria-atomic="true">
        <span className="facet-name">
          {BLOCK_META[currentBlock]?.num} · {BLOCK_META[currentBlock]?.name}
        </span>
        <span>
          {state.index + 1}/{flow.length} · ~{remainingMin} Min.
        </span>
      </div>

      <div className="quiz-enter" key={currentItem.id}>
        {isWellbeing ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginTop: 18 }}>
            Wie oft hast du dich in den letzten zwei Wochen beeinträchtigt gefühlt durch:
          </p>
        ) : null}
        <h2 className="question-text" tabIndex={-1} ref={questionRef}>
          {currentItem.textDe}
        </h2>
        <LikertScale
          name={currentItem.id}
          question={currentItem.textDe}
          options={options}
          value={state.answers[currentItem.id]}
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
          lokal gespeichert
        </span>
      </div>
    </div>
  );
}
