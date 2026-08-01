// Production store: Supabase Postgres (eu-central-1). Uses the SERVER-ONLY service
// role key — it bypasses RLS deliberately for scoring; client-facing reads happen
// only through our token-validated API routes, never directly.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import type {
  ConsentRow,
  ConsentType,
  MatchRow,
  ResponseRow,
  ResultRow,
  SessionRow,
  Store,
} from './types';

const TOKEN_TTL_DAYS = 90;

export class SupabaseStore implements Store {
  private db: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.db = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  }

  async createSession(): Promise<SessionRow> {
    const { data, error } = await this.db
      .from('test_sessions')
      .insert({})
      .select('id, started_at, completed_at, status, wellbeing_consent')
      .single();
    if (error) throw error;
    return mapSession(data);
  }

  async getSession(id: string): Promise<SessionRow | null> {
    const { data } = await this.db
      .from('test_sessions')
      .select('id, started_at, completed_at, status, wellbeing_consent')
      .eq('id', id)
      .maybeSingle();
    return data ? mapSession(data) : null;
  }

  async setWellbeingConsent(sessionId: string, granted: boolean): Promise<void> {
    await this.db.from('test_sessions').update({ wellbeing_consent: granted }).eq('id', sessionId);
  }

  async saveResponses(sessionId: string, responses: ResponseRow[]): Promise<number> {
    const rows = responses.map((r) => ({
      session_id: sessionId,
      item_id: r.itemId,
      value: r.value,
      response_time_ms: r.responseTimeMs,
    }));
    const { error } = await this.db
      .from('responses')
      .upsert(rows, { onConflict: 'session_id,item_id' });
    if (error) throw error;
    return rows.length;
  }

  async getResponses(sessionId: string): Promise<ResponseRow[]> {
    const { data, error } = await this.db
      .from('responses')
      .select('item_id, value, response_time_ms')
      .eq('session_id', sessionId);
    if (error) throw error;
    return (data ?? []).map((r) => ({
      itemId: r.item_id,
      value: r.value,
      responseTimeMs: r.response_time_ms ?? 0,
    }));
  }

  async completeSession(
    sessionId: string,
    result: Omit<ResultRow, 'id' | 'createdAt'>,
  ): Promise<{ token: string; existing: boolean }> {
    const { data: existing } = await this.db
      .from('results')
      .select('id')
      .eq('session_id', sessionId)
      .maybeSingle();
    if (existing) {
      const { data: tok } = await this.db
        .from('share_tokens')
        .select('token')
        .eq('result_id', existing.id)
        .eq('scope', 'result')
        .maybeSingle();
      if (tok) return { token: tok.token, existing: true };
    }
    const { data: inserted, error } = await this.db
      .from('results')
      .insert({
        session_id: sessionId,
        scores: result.scores,
        percentiles: result.percentiles,
        bands: result.bands,
        validity_flags: result.validity,
        crisis: result.crisis,
        archetype_id: result.archetypeId,
      })
      .select('id')
      .single();
    if (error) throw error;
    await this.db
      .from('test_sessions')
      .update({ completed_at: new Date().toISOString(), status: 'completed' })
      .eq('id', sessionId);
    const token = randomBytes(16).toString('hex');
    await this.db.from('share_tokens').insert({
      token,
      result_id: inserted.id,
      scope: 'result',
      expires_at: new Date(Date.now() + TOKEN_TTL_DAYS * 86400_000).toISOString(),
    });
    return { token, existing: false };
  }

  async getResultByToken(token: string): Promise<{ result: ResultRow; expired: boolean } | null> {
    const { data: t } = await this.db
      .from('share_tokens')
      .select('result_id, expires_at')
      .eq('token', token)
      .maybeSingle();
    if (!t) return null;
    const { data: r } = await this.db
      .from('results')
      .select('id, session_id, scores, percentiles, bands, validity_flags, crisis, archetype_id, created_at')
      .eq('id', t.result_id)
      .maybeSingle();
    if (!r) return null;
    return {
      result: {
        id: r.id,
        sessionId: r.session_id,
        scores: r.scores,
        percentiles: r.percentiles,
        bands: r.bands,
        validity: r.validity_flags,
        crisis: r.crisis,
        archetypeId: r.archetype_id,
        createdAt: r.created_at,
      },
      expired: !!t.expires_at && new Date(t.expires_at).getTime() < Date.now(),
    };
  }

  async saveConsents(rows: Omit<ConsentRow, 'createdAt' | 'revokedAt'>[]): Promise<void> {
    const { error } = await this.db.from('consents').insert(
      rows.map((r) => ({
        session_id: r.sessionId,
        consent_type: r.consentType,
        granted: r.granted,
        text_version: r.textVersion,
        ip_hash: r.ipHash,
      })),
    );
    if (error) throw error;
  }

  async hasActiveConsent(sessionId: string, type: ConsentType): Promise<boolean> {
    const { data } = await this.db
      .from('consents')
      .select('granted, revoked_at')
      .eq('session_id', sessionId)
      .eq('consent_type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return !!data && data.granted && !data.revoked_at;
  }

  async linkEmail(sessionId: string, emailHash: string, emailEncrypted: string): Promise<void> {
    const { data: user, error } = await this.db
      .from('app_users')
      .upsert({ email_hash: emailHash, email_encrypted: emailEncrypted }, { onConflict: 'email_hash' })
      .select('id')
      .single();
    if (error) throw error;
    await this.db
      .from('session_user_link')
      .upsert({ session_id: sessionId, user_id: user.id }, { onConflict: 'session_id' });
  }

  async setDoubleOptInToken(emailHash: string, confirmToken: string): Promise<void> {
    await this.db.from('app_users').update({ doi_token: confirmToken }).eq('email_hash', emailHash);
  }

  async confirmDoubleOptIn(confirmToken: string): Promise<boolean> {
    const { data } = await this.db
      .from('app_users')
      .update({ double_opt_in_at: new Date().toISOString(), doi_token: null })
      .eq('doi_token', confirmToken)
      .select('id');
    return !!data && data.length > 0;
  }

  async createMatch(resultA: string, resultB: string, computed: unknown): Promise<MatchRow> {
    const { data, error } = await this.db
      .from('matches')
      .insert({ result_a: resultA, result_b: resultB, computed_result: computed })
      .select('id, created_at')
      .single();
    if (error) throw error;
    return { id: data.id, resultA, resultB, computed, createdAt: data.created_at };
  }

  async deleteByToken(token: string): Promise<boolean> {
    const found = await this.getResultByToken(token);
    if (!found) return false;
    // ON DELETE CASCADE on the schema removes responses/results/tokens/links.
    const { error } = await this.db.from('test_sessions').delete().eq('id', found.result.sessionId);
    return !error;
  }

  async deleteByEmailHash(emailHash: string): Promise<boolean> {
    const { data: user } = await this.db
      .from('app_users')
      .select('id')
      .eq('email_hash', emailHash)
      .maybeSingle();
    if (!user) return false;
    const { data: links } = await this.db
      .from('session_user_link')
      .select('session_id')
      .eq('user_id', user.id);
    for (const l of links ?? []) {
      await this.db.from('test_sessions').delete().eq('id', l.session_id);
    }
    await this.db.from('app_users').delete().eq('id', user.id);
    return true;
  }
}

function mapSession(data: Record<string, unknown>): SessionRow {
  return {
    id: data.id as string,
    startedAt: data.started_at as string,
    completedAt: (data.completed_at as string) ?? null,
    status: data.status as SessionRow['status'],
    wellbeingConsent: !!data.wellbeing_consent,
  };
}
