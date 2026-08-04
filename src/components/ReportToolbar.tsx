'use client';

// Report controls. "Expand all" exists because a collapsed accordion cannot be
// printed — browsers hide closed <details> content at the rendering level, so the
// PDF path has to open them first. Both actions are also plain conveniences for a
// long report.

import { useState } from 'react';

export default function ReportToolbar() {
  const [allOpen, setAllOpen] = useState(false);

  function setAll(open: boolean) {
    document.querySelectorAll<HTMLDetailsElement>('details.dim').forEach((d) => {
      d.open = open;
    });
    setAllOpen(open);
  }

  function printReport() {
    setAll(true);
    // Let layout settle before handing off to the print renderer.
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  }

  return (
    <div className="report-toolbar no-print">
      <button className="toolbar-btn" onClick={() => setAll(!allOpen)}>
        {allOpen ? 'Alle Abschnitte zuklappen' : 'Alle Abschnitte aufklappen'}
      </button>
      <button className="toolbar-btn" onClick={printReport}>
        Als PDF speichern
      </button>
    </div>
  );
}
