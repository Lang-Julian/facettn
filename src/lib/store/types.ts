import type { ValidityFlags } from '@/lib/engine/types';

export type ConsentType = 'a' | 'b' | 'c' | 'd';

export interface SessionRow {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  wellbeingConsent: boolean;
}

export interface ResponseRow {
  itemId: string;
  value: number;
  responseTimeMs: number;
}

export interface ResultRow {
  id: string;
  sessionId: string;
  scores: Record<string, number>;
  percentiles: Record<string, number>;
  bands: Record<string, string>;
  validity: ValidityFlags;
  crisis: boolean;
  archetypeId: string;
  createdAt: string;
}

export interface ConsentRow {
  sessionId: string;
  consentType: ConsentType;
  granted: boolean;
  textVersion: string;
  ipHash: string | null;
  createdAt: string;
  revokedAt: string | null;
}

export interface MatchRow {
  id: string;
  resultA: string;
  resultB: string;
  computed: unknown;
  createdAt: string;
}

export interface Store {
  createSession(): Promise<SessionRow>;
  getSession(id: string): Promise<SessionRow | null>;
  setWellbeingConsent(sessionId: string, granted: boolean): Promise<void>;
  saveResponses(sessionId: string, responses: ResponseRow[]): Promise<number>;
  getResponses(sessionId: string): Promise<ResponseRow[]>;
  /** Idempotent: if the session already has a result, returns the existing token. */
  completeSession(
    sessionId: string,
    result: Omit<ResultRow, 'id' | 'createdAt'>,
  ): Promise<{ token: string; existing: boolean }>;
  getResultByToken(token: string): Promise<{ result: ResultRow; expired: boolean } | null>;
  saveConsents(rows: Omit<ConsentRow, 'createdAt' | 'revokedAt'>[]): Promise<void>;
  hasActiveConsent(sessionId: string, type: ConsentType): Promise<boolean>;
  /** Stores email (hashed for dedup + encrypted at rest) and links it to the session. */
  linkEmail(sessionId: string, emailHash: string, emailEncrypted: string): Promise<void>;
  confirmDoubleOptIn(confirmToken: string): Promise<boolean>;
  setDoubleOptInToken(emailHash: string, confirmToken: string): Promise<void>;
  createMatch(resultA: string, resultB: string, computed: unknown): Promise<MatchRow>;
  /** GDPR deletion by share token (cascades session, responses, result, tokens). */
  deleteByToken(token: string): Promise<boolean>;
  deleteByEmailHash(emailHash: string): Promise<boolean>;
}
