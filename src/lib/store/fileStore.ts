// Local development store: a single JSON file under .data/. NOT for production —
// production uses the Supabase adapter (RLS, EU region). Same interface, so the
// app code is identical in both modes.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import type {
  ConsentRow,
  ConsentType,
  MatchRow,
  ResponseRow,
  ResultRow,
  SessionRow,
  Store,
} from './types';

interface FileData {
  sessions: Record<string, SessionRow>;
  responses: Record<string, Record<string, ResponseRow>>; // sessionId -> itemId -> row
  results: Record<string, ResultRow>; // resultId -> row
  resultBySession: Record<string, string>;
  shareTokens: Record<string, { resultId: string; scope: string; expiresAt: string | null }>;
  consents: ConsentRow[];
  emails: Record<string, { emailEncrypted: string; doubleOptInAt: string | null; confirmToken: string | null }>;
  emailBySession: Record<string, string>; // sessionId -> emailHash
  matches: Record<string, MatchRow>;
}

const EMPTY: FileData = {
  sessions: {},
  responses: {},
  results: {},
  resultBySession: {},
  shareTokens: {},
  consents: [],
  emails: {},
  emailBySession: {},
  matches: {},
};

const FILE = path.join(process.cwd(), '.data', 'store.json');
const TOKEN_TTL_DAYS = 90;

let queue: Promise<unknown> = Promise.resolve();
/** Serialize all mutations through a promise chain (single-process dev server). */
function locked<T>(fn: (d: FileData) => Promise<T> | T): Promise<T> {
  const run = queue.then(async () => {
    let data: FileData;
    try {
      data = JSON.parse(await fs.readFile(FILE, 'utf8')) as FileData;
    } catch {
      data = structuredClone(EMPTY);
    }
    const out = await fn(data);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data));
    await fs.rename(tmp, FILE);
    return out;
  });
  queue = run.catch(() => undefined);
  return run;
}

export class FileStore implements Store {
  async createSession(): Promise<SessionRow> {
    return locked((d) => {
      const row: SessionRow = {
        id: randomUUID(),
        startedAt: new Date().toISOString(),
        completedAt: null,
        status: 'in_progress',
        wellbeingConsent: false,
      };
      d.sessions[row.id] = row;
      return row;
    });
  }

  async getSession(id: string): Promise<SessionRow | null> {
    return locked((d) => d.sessions[id] ?? null);
  }

  async setWellbeingConsent(sessionId: string, granted: boolean): Promise<void> {
    await locked((d) => {
      const s = d.sessions[sessionId];
      if (s) s.wellbeingConsent = granted;
    });
  }

  async saveResponses(sessionId: string, responses: ResponseRow[]): Promise<number> {
    return locked((d) => {
      if (!d.sessions[sessionId]) return 0;
      const bucket = (d.responses[sessionId] ??= {});
      for (const r of responses) bucket[r.itemId] = r;
      return responses.length;
    });
  }

  async getResponses(sessionId: string): Promise<ResponseRow[]> {
    return locked((d) => Object.values(d.responses[sessionId] ?? {}));
  }

  async completeSession(
    sessionId: string,
    result: Omit<ResultRow, 'id' | 'createdAt'>,
  ): Promise<{ token: string; existing: boolean }> {
    return locked((d) => {
      const existingResultId = d.resultBySession[sessionId];
      if (existingResultId) {
        const token = Object.entries(d.shareTokens).find(
          ([, v]) => v.resultId === existingResultId && v.scope === 'result',
        )?.[0];
        if (token) return { token, existing: true };
      }
      const row: ResultRow = { ...result, id: randomUUID(), createdAt: new Date().toISOString() };
      d.results[row.id] = row;
      d.resultBySession[sessionId] = row.id;
      const session = d.sessions[sessionId];
      if (session) {
        session.completedAt = row.createdAt;
        session.status = 'completed';
      }
      const token = randomBytes(16).toString('hex');
      d.shareTokens[token] = {
        resultId: row.id,
        scope: 'result',
        expiresAt: new Date(Date.now() + TOKEN_TTL_DAYS * 86400_000).toISOString(),
      };
      return { token, existing: false };
    });
  }

  async getResultByToken(token: string): Promise<{ result: ResultRow; expired: boolean } | null> {
    return locked((d) => {
      const t = d.shareTokens[token];
      if (!t) return null;
      const result = d.results[t.resultId];
      if (!result) return null;
      const expired = !!t.expiresAt && new Date(t.expiresAt).getTime() < Date.now();
      return { result, expired };
    });
  }

  async saveConsents(rows: Omit<ConsentRow, 'createdAt' | 'revokedAt'>[]): Promise<void> {
    await locked((d) => {
      const now = new Date().toISOString();
      for (const r of rows) d.consents.push({ ...r, createdAt: now, revokedAt: null });
    });
  }

  async hasActiveConsent(sessionId: string, type: ConsentType): Promise<boolean> {
    return locked((d) => {
      // Latest row for this session+type wins (audit trail keeps history).
      const rows = d.consents.filter((c) => c.sessionId === sessionId && c.consentType === type);
      const latest = rows[rows.length - 1];
      return !!latest && latest.granted && !latest.revokedAt;
    });
  }

  async linkEmail(sessionId: string, emailHash: string, emailEncrypted: string): Promise<void> {
    await locked((d) => {
      d.emails[emailHash] ??= { emailEncrypted, doubleOptInAt: null, confirmToken: null };
      d.emailBySession[sessionId] = emailHash;
    });
  }

  async setDoubleOptInToken(emailHash: string, confirmToken: string): Promise<void> {
    await locked((d) => {
      const e = d.emails[emailHash];
      if (e) e.confirmToken = confirmToken;
    });
  }

  async confirmDoubleOptIn(confirmToken: string): Promise<boolean> {
    return locked((d) => {
      for (const e of Object.values(d.emails)) {
        if (e.confirmToken === confirmToken) {
          e.doubleOptInAt = new Date().toISOString();
          e.confirmToken = null;
          return true;
        }
      }
      return false;
    });
  }

  async createMatch(resultA: string, resultB: string, computed: unknown): Promise<MatchRow> {
    return locked((d) => {
      const row: MatchRow = {
        id: randomUUID(),
        resultA,
        resultB,
        computed,
        createdAt: new Date().toISOString(),
      };
      d.matches[row.id] = row;
      return row;
    });
  }

  async deleteByToken(token: string): Promise<boolean> {
    return locked((d) => {
      const t = d.shareTokens[token];
      if (!t) return false;
      const result = d.results[t.resultId];
      if (!result) return false;
      const sessionId = result.sessionId;
      delete d.sessions[sessionId];
      delete d.responses[sessionId];
      delete d.resultBySession[sessionId];
      delete d.results[t.resultId];
      for (const [tok, v] of Object.entries(d.shareTokens)) {
        if (v.resultId === t.resultId) delete d.shareTokens[tok];
      }
      d.consents = d.consents.filter((c) => c.sessionId !== sessionId);
      const emailHash = d.emailBySession[sessionId];
      delete d.emailBySession[sessionId];
      if (emailHash && !Object.values(d.emailBySession).includes(emailHash)) {
        delete d.emails[emailHash];
      }
      for (const [id, m] of Object.entries(d.matches)) {
        if (m.resultA === t.resultId || m.resultB === t.resultId) delete d.matches[id];
      }
      return true;
    });
  }

  async deleteByEmailHash(emailHash: string): Promise<boolean> {
    return locked(async (d) => {
      if (!d.emails[emailHash]) return false;
      const sessionIds = Object.entries(d.emailBySession)
        .filter(([, h]) => h === emailHash)
        .map(([sid]) => sid);
      for (const sid of sessionIds) {
        const resultId = d.resultBySession[sid];
        delete d.sessions[sid];
        delete d.responses[sid];
        delete d.resultBySession[sid];
        delete d.emailBySession[sid];
        if (resultId) {
          delete d.results[resultId];
          for (const [tok, v] of Object.entries(d.shareTokens)) {
            if (v.resultId === resultId) delete d.shareTokens[tok];
          }
          for (const [id, m] of Object.entries(d.matches)) {
            if (m.resultA === resultId || m.resultB === resultId) delete d.matches[id];
          }
        }
        d.consents = d.consents.filter((c) => c.sessionId !== sid);
      }
      delete d.emails[emailHash];
      return true;
    });
  }
}
