import type { Metadata } from 'next';
import CompareView from '@/components/CompareView';

export const metadata: Metadata = {
  title: 'Profile vergleichen',
  robots: { index: false, follow: false },
};

export default function VergleichPage() {
  return (
    <main>
      <CompareView />
    </main>
  );
}
