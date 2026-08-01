import type { Store } from './types';
import { FileStore } from './fileStore';
import { SupabaseStore } from './supabaseStore';

let store: Store | null = null;

/**
 * Supabase (eu-central-1) when configured, local file store otherwise.
 *
 * The file store writes to `.data/` on local disk. On serverless platforms the
 * filesystem is read-only (except an ephemeral, per-instance /tmp), so falling
 * back to it there would silently drop sessions and 404 result links. Fail loudly
 * instead — a missing database must be a deploy error, not a data-loss bug.
 */
export function getStore(): Store {
  if (store) return store;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    store = new SupabaseStore(url, key);
    return store;
  }
  const serverless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (serverless) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required on serverless hosting — ' +
        'the local file store cannot persist there.',
    );
  }
  store = new FileStore();
  return store;
}
