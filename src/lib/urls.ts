// URL construction that survives a base path.
//
// Next's <Link> prepends the configured basePath automatically; hand-built strings
// do not. That asymmetry produced a real bug: on GitHub Pages the site lives under
// /facettn, but share links were assembled from window.location.origin and pointed
// at /ergebnis instead of /facettn/ergebnis/ — every generated link 404'd, and it
// was invisible locally where the base path is empty.
//
// Anything that builds a URL by hand must go through here.

/** Injected by next.config.mjs from the same BASE_PATH used for the build. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * A site-relative path including the base path. `trailingSlash: true` means static
 * hosts serve /pfad/ — the slash is enforced here so links do not rely on a
 * host-specific redirect to work.
 */
export function sitePath(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withSlash = clean.endsWith('/') ? clean : `${clean}/`;
  return `${BASE_PATH}${withSlash}`;
}

/** An absolute URL for sharing. Empty origin during server rendering. */
export function siteUrl(path: string, fragment?: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${sitePath(path)}${fragment ? `#${fragment}` : ''}`;
}
