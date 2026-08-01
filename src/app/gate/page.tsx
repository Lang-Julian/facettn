import type { Metadata } from 'next';
import { Suspense } from 'react';
import EmailGate from '@/components/EmailGate';

export const metadata: Metadata = { title: 'Dein Ergebnis ist bereit' };
export const dynamic = 'force-dynamic';

export default function GatePage() {
  return (
    <main>
      <Suspense fallback={null}>
        <EmailGate />
      </Suspense>
    </main>
  );
}
