import type { Metadata } from 'next';
import QuizShell from '@/components/QuizShell';

export const metadata: Metadata = { title: 'Der Test' };

export default function TestPage() {
  return (
    <main>
      <QuizShell />
    </main>
  );
}
