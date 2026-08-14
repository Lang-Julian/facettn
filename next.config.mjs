/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Content-Security-Policy',
    // Every directive is self-only. This header is part of the privacy claim: a
    // reviewer can read it and see that no third-party origin is permitted at all,
    // so "no tracking" is enforced by the browser rather than merely asserted.
    // Never whitelist an external host here without changing /transparenz too.
    value: [
      "default-src 'self'",
      // 'unsafe-inline' covers Next.js's inline style and bootstrap tags.
      // 'unsafe-eval' is dev-only — React Fast Refresh needs it; production stays strict.
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "font-src 'self'",
      "form-action 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

// A fully static export: no server, no runtime, just files. That is the strongest
// form of the privacy claim — there is no backend that *could* receive anything,
// and anyone can self-host the result by copying a folder.
//
// BASE_PATH covers hosting under a sub-path (e.g. GitHub Pages at /facettn); leave
// it unset for a custom domain at the root.
const basePath = process.env.BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  // Hand-built URLs (share links) need the base path at runtime; <Link> gets it
  // automatically, plain strings do not. See src/lib/urls.ts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Static hosts serve /pfad/ as /pfad/index.html.
  trailingSlash: true,
  images: { unoptimized: true },
  // No need to advertise the framework and its version to scanners.
  poweredByHeader: false,
  // NOTE: a static export cannot send headers — the CSP and friends below are only
  // applied by `next start`. On a static host they must be configured there
  // (_headers on Netlify/Cloudflare, a meta tag fallback, or the web server).
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
