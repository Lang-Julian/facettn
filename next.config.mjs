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

const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
