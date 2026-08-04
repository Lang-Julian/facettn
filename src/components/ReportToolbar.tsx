// Report controls. Purely presentational: the open/closed state of the sections
// lives in ResultView, because reaching into a sibling's DOM to flip <details open>
// does not survive React re-render.

export default function ReportToolbar({
  allOpen,
  onToggleAll,
  onPrint,
}: {
  allOpen: boolean;
  onToggleAll: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="report-toolbar no-print">
      <button className="toolbar-btn" onClick={onToggleAll} aria-expanded={allOpen}>
        {allOpen ? 'Alle Abschnitte zuklappen' : 'Alle Abschnitte aufklappen'}
      </button>
      <button className="toolbar-btn" onClick={onPrint}>
        Als PDF speichern
      </button>
    </div>
  );
}
