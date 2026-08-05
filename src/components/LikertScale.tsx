'use client';

// The answer control. Accessibility is the whole design here, not a layer on top:
// a 125-item questionnaire is only usable by keyboard and screen-reader users if
// answering costs one keystroke.
//
// - Native radios inside a fieldset, so arrow keys move between options and the
//   group is announced as a group. The legend carries the QUESTION text, because
//   a screen reader reads the legend with every option — "Antwort auswählen" would
//   force the user to re-read the question separately for all 125 items.
// - Number keys 1–5 pick and advance directly. This is the fastest path for
//   keyboard users and for anyone with limited motor control.
// - Pointer taps advance after a short confirmation flash. Keyboard selection does
//   NOT auto-advance: moving through options with arrow keys must be explorable
//   without committing, so an explicit "Weiter" button is always reachable.

import { useEffect, useRef, useState } from 'react';

interface Option {
  value: number;
  label: string;
}

export default function LikertScale({
  name,
  question,
  options,
  value,
  onSelect,
}: {
  name: string;
  question: string;
  options: Option[];
  value?: number;
  onSelect: (value: number) => void;
}) {
  const [selected, setSelected] = useState<number | undefined>(value);
  const [confirming, setConfirming] = useState(false);
  const byPointer = useRef(false);
  const groupRef = useRef<HTMLFieldSetElement>(null);

  const maxValue = Math.max(...options.map((o) => o.value));
  const minValue = Math.min(...options.map((o) => o.value));

  // Number-key shortcuts. Ignored while a text field has focus so the compare
  // page's input keeps working.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement && el.type !== 'radio') return;
      if (el instanceof HTMLTextAreaElement) return;

      const n = Number(e.key);
      if (!Number.isInteger(n)) return;
      const option = options.find((o, i) => o.value === n || i + 1 === n);
      if (!option) return;
      e.preventDefault();
      setSelected(option.value);
      setConfirming(true);
      setTimeout(() => onSelect(option.value), 140);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [options, onSelect]);

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
      <fieldset className="likert" ref={groupRef} disabled={confirming}>
        <legend className="sr-only">{question}</legend>
        {options.map((o, i) => {
          const intensity = (o.value - minValue) / Math.max(1, maxValue - minValue);
          return (
            <label
              key={o.value}
              className={`likert-option ${selected === o.value && confirming ? 'confirmed' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected === o.value}
                onPointerDown={() => (byPointer.current = true)}
                onChange={() => choose(o.value)}
              />
              <span aria-hidden className="likert-dot" style={{ '--fill': intensity } as React.CSSProperties} />
              <span className="likert-label">{o.label}</span>
              <kbd className="likert-key" aria-hidden>
                {i + 1}
              </kbd>
            </label>
          );
        })}
      </fieldset>

      <p className="kbd-hint" aria-hidden>
        Tipp: Tasten <kbd>1</kbd>–<kbd>{options.length}</kbd> antworten direkt.
      </p>

      {selected !== undefined && !confirming ? (
        <button className="btn" style={{ marginTop: 8 }} onClick={() => onSelect(selected)}>
          Weiter
        </button>
      ) : null}
    </div>
  );
}
