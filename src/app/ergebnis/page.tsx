import type { Metadata } from 'next';
import ResultView from '@/components/ResultView';

// The result lives in the URL fragment, which never reaches the server — so this
// page is a static shell that hydrates itself from the client. That is also why it
// is marked noindex: there is no server-side content to index, and a result URL
// should never end up in a search engine.
export const metadata: Metadata = {
  title: 'Dein Ergebnis',
  robots: { index: false, follow: false },
};

export default function ErgebnisPage() {
  return (
    <main>
      <ResultView />
    </main>
  );
}
