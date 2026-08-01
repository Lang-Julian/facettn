import type { Metadata } from 'next';
import CompareView from '@/components/CompareView';

export const metadata: Metadata = { title: 'Profile vergleichen', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function ComparePage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;
  return (
    <main>
      <CompareView ownToken={token} />
    </main>
  );
}
