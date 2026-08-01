// SEO pages: one indexable page per archetype (16P playbook). Statically generated.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARCHETYPES, ARCHETYPE_BY_ID } from '@/lib/seed/archetypes';

export function generateStaticParams() {
  return ARCHETYPES.map((a) => ({ slug: a.id }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const a = ARCHETYPE_BY_ID.get(slug);
  if (!a) return {};
  return {
    title: `${a.nameDe} (${a.nameEn})`,
    description: a.descriptionDe,
  };
}

export default async function ArchetypePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const a = ARCHETYPE_BY_ID.get(slug);
  if (!a) notFound();

  return (
    <main>
      <section className="archetype-hero">
        <span className="kicker">Archetyp</span>
        <h1>{a.nameDe}</h1>
        <div className="en">{a.nameEn}</div>
        <p className="hook">{a.descriptionDe}</p>
        <div className="rule-sm" aria-hidden />
      </section>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Typische Stärken</h2>
        <ul className="pill-list">
          {a.strengths.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <h3>Wachstumsfelder</h3>
        <ul>
          {a.growthAreas.map((g) => <li key={g}>{g}</li>)}
        </ul>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
          Archetypen sind eine Kommunikationsebene über kontinuierlichen Persönlichkeits-Werten —
          keine Diagnose und keine Schublade.
        </p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Welcher Archetyp bist du?</h2>
        <Link className="btn" href="/test">Test starten — ca. 8 Minuten</Link>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Alle Archetypen</h2>
        <ul className="pill-list">
          {ARCHETYPES.filter((x) => x.id !== a.id).map((x) => (
            <li key={x.id}>
              <Link href={`/archetyp/${x.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {x.nameDe}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
