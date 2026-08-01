'use client';

// Accessible Likert input: native radios in a fieldset (arrow keys switch options,
// tab switches groups). NO auto-advance on keyboard focus — an explicit "Weiter"
// button appears once a value is chosen, so keyboard/screenreader users are never
// pushed forward by mere focus movement. Pointer taps advance directly (mobile UX)
// after a brief confirmation flash. Intensity dots make the scale readable at a glance.

import { useRef, useState } from 'react';

interface Option {
  value: number;
  label: string;
}

export default function LikertScale({
  name,
  options,
  value,
  onSelect,
}: {
  name: string;
  options: Option[];
  value?: number;
  onSelect: (value: number) => void;
}) {
  const [selected, setSelected] = useState<number | undefined>(value);
  const [confirming, setConfirming] = useState(false);
  const byPointer = useRef(false);
  const maxValue = Math.max(...options.map((o) => o.value));
  const minValue = Math.min(...options.map((o) => o.value));

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
      // Brief flash so the selection is visible before advancing.
      setTimeout(() => onSelect(v), 220);
    }
  }

  return (
    <div>
      <fieldset className="likert" disabled={confirming}>
        <legend>Antwort auswählen</legend>
        {options.map((o) => {
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
              <span
                aria-hidden
                className="likert-dot"
                style={{ '--fill': intensity } as React.CSSProperties}
              />
              {o.label}
            </label>
          );
        })}
      </fieldset>
      {selected !== undefined && !confirming ? (
        <button className="btn" style={{ marginTop: 16 }} onClick={() => onSelect(selected)}>
          Weiter
        </button>
      ) : null}
    </div>
  );
}
