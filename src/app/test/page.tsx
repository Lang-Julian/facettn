import type { Metadata } from 'next';
import QuizShell from '@/components/QuizShell';

export const metadata: Metadata = { title: 'Dein Test' };
export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <main>
      <QuizShell />
    </main>
  );
}
