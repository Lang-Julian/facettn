'use client';

// Forced-choice control for the love-style pairs.
//
// Preferences need a trade-off, not agreement: on a Likert scale nearly everyone
// endorses "kind words mean a lot to me", which flattens the profile. Here the two
// options compete, so answering costs a decision.
//
// Keyboard: 1 and 2 pick, arrow keys move between the radios, and the group is a
// real fieldset whose legend carries the question.

import { useEffect, useRef, useState } from 'react';

export default function ChoiceScale({
  name,
  question,
  optionA,
  optionB,
  value,
  onSelect,
}: {
  name: string;
  question: string;
  optionA: string;
  optionB: string;
  value?: number;
  onSelect: (value: number) => void;
}) {
  const [selected, setSelected] = useState<number | undefined>(value);
  const [confirming, setConfirming] = useState(false);
  const byPointer = useRef(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement && el.type !== 'radio') return;
      if (el instanceof HTMLTextAreaElement) return;
      if (e.key !== '1' && e.key !== '2') return;
      e.preventDefault();
      const v = Number(e.key);
      setSelected(v);
      setConfirming(true);
      setTimeout(() => onSelect(v), 140);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSelect]);

  function choose(v: number) {
    setSelected(v);
    if (byPointer.current) {
      byPointer.current = false;
      setConfirming(true);
      try {
        navigator.vibrate?.(10);
      } catch {
        /* not available */
      }
      setTimeout(() => onSelect(v), 200);
    }
  }

  return (
    <div>
      <fieldset className="likert choice" disabled={confirming}>
        <legend className="sr-only">{question}</legend>
        {[
          { v: 1, label: optionA },
          { v: 2, label: optionB },
        ].map((o, i) => (
          <label
            key={o.v}
            className={`likert-option choice-option ${selected === o.v && confirming ? 'confirmed' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={o.v}
              checked={selected === o.v}
              onPointerDown={() => (byPointer.current = true)}
              onChange={() => choose(o.v)}
            />
            <span aria-hidden className="likert-dot" style={{ '--fill': 1 } as React.CSSProperties} />
            <span className="likert-label">{o.label}</span>
            <kbd className="likert-key" aria-hidden>
              {i + 1}
            </kbd>
          </label>
        ))}
      </fieldset>

      <p className="kbd-hint" aria-hidden>
        Beides zählt — entscheide, was <em>mehr</em> fehlen würde. Tasten <kbd>1</kbd> und <kbd>2</kbd>.
      </p>

      {selected !== undefined && !confirming ? (
        <button className="btn" style={{ marginTop: 8 }} onClick={() => onSelect(selected)}>
          Weiter
        </button>
      ) : null}
    </div>
  );
}
