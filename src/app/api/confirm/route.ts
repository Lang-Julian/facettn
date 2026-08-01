// GET /api/confirm?token=... — double-opt-in confirmation for marketing consent (c).

import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  if (!/^[a-f0-9]{32}$/.test(token)) {
    return NextResponse.redirect(new URL('/?doi=invalid', req.url));
  }
  const ok = await getStore().confirmDoubleOptIn(token);
  return NextResponse.redirect(new URL(ok ? '/?doi=confirmed' : '/?doi=invalid', req.url));
}
