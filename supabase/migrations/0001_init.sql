-- Facettn schema (Dev-Spec §2). Region: eu-central-1 (Frankfurt).
-- HARD RULE: RLS enabled on EVERY public table before any feature code ships.
-- Verify with:  select tablename from pg_tables where schemaname='public' and not rowsecurity;  -- must be empty

create extension if not exists pgcrypto;

-- ---------- Reference data (read-only for clients) ----------
create table scales (
  id                text primary key,
  name_de           text not null,
  dimension_group   text not null,
  reverse_default   boolean default false,
  norm_source       text
);

create table items (
  id                     text primary key,
  position               int  not null,
  text_de                text not null,
  block                  int  not null,
  is_attention_check     boolean default false,
  is_social_desirability boolean default false,
  module                 text not null default 'core' check (module in ('core','wellbeing')),
  response_format        text not null default 'likert5' check (response_format in ('likert5','phq4')),
  reverse                boolean default false
);

create table item_scale_loadings (
  item_id   text  references items(id)  on delete cascade,
  scale_id  text  references scales(id) on delete cascade,
  weight    numeric(3,2) not null check (weight between 0 and 1),
  direction smallint     not null check (direction in (-1,1)),
  primary key (item_id, scale_id)
);

-- ---------- Session & responses (pseudonymous) ----------
create table test_sessions (
  id                 uuid primary key default gen_random_uuid(),
  auth_uid           uuid,
  device_fingerprint text,
  started_at         timestamptz default now(),
  completed_at       timestamptz,
  status             text default 'in_progress' check (status in ('in_progress','completed','abandoned')),
  wellbeing_consent  boolean default false,
  purge_after        timestamptz default (now() + interval '30 days')
);

create table responses (
  id               bigint generated always as identity primary key,
  session_id       uuid references test_sessions(id) on delete cascade,
  item_id          text references items(id),
  value            smallint not null check (value between 0 and 5),
  response_time_ms int,
  answered_at      timestamptz default now(),
  unique (session_id, item_id)
);

-- ---------- Results ----------
create table archetypes (
  id             text primary key,
  name_de        text not null,
  name_en        text not null,
  description_de text,
  strengths      jsonb,
  growth_areas   jsonb,
  priority       int  not null
);

create table results (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid references test_sessions(id) on delete cascade,
  scores         jsonb not null,
  percentiles    jsonb not null,
  bands          jsonb not null,
  validity_flags jsonb not null,
  crisis         boolean default false,
  archetype_id   text references archetypes(id),
  created_at     timestamptz default now(),
  unique (session_id)
);

create table norms (
  id               bigint generated always as identity primary key,
  scale_id         text references scales(id),
  population       text not null,
  norm_mean        numeric,
  norm_sd          numeric,
  percentile_table jsonb,
  source           text
);

-- ---------- Users / e-mail (separated from sessions) ----------
create table app_users (
  id               uuid primary key default gen_random_uuid(),
  email_hash       text unique,
  email_encrypted  text,
  doi_token        text,
  double_opt_in_at timestamptz,
  created_at       timestamptz default now()
);

create table session_user_link (
  session_id uuid references test_sessions(id) on delete cascade,
  user_id    uuid references app_users(id)     on delete cascade,
  linked_at  timestamptz default now(),
  primary key (session_id)
);

-- ---------- Consents (audit-proof) ----------
create table consents (
  id           bigint generated always as identity primary key,
  session_id   uuid references test_sessions(id) on delete cascade,
  user_id      uuid references app_users(id),
  consent_type text not null check (consent_type in ('a','b','c','d')),
  granted      boolean not null,
  text_version text not null,
  ip_hash      text,
  created_at   timestamptz default now(),
  revoked_at   timestamptz
);

-- ---------- Share & match ----------
create table share_tokens (
  token      text primary key default encode(gen_random_bytes(16),'hex'),
  result_id  uuid references results(id) on delete cascade,
  scope      text not null default 'result' check (scope in ('result','compare')),
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table matches (
  id              uuid primary key default gen_random_uuid(),
  result_a        uuid   references results(id) on delete cascade,
  result_b        uuid   references results(id) on delete cascade,
  consent_a       bigint references consents(id),
  consent_b       bigint references consents(id),
  computed_result jsonb,
  created_at      timestamptz default now()
);

-- ---------- Indexes ----------
create index idx_responses_session on responses(session_id);
create index idx_loadings_scale    on item_scale_loadings(scale_id);
create index idx_loadings_item     on item_scale_loadings(item_id);
create index idx_norms_scale       on norms(scale_id, population);
create index idx_share_result      on share_tokens(result_id);
create index idx_consents_session  on consents(session_id);
create index idx_sessions_purge    on test_sessions(purge_after) where completed_at is null;
create index idx_users_doi         on app_users(doi_token) where doi_token is not null;

-- ---------- RLS: enabled on EVERY table ----------
-- App access pattern: all reads/writes go through Next.js API routes using the
-- service role (which bypasses RLS). Client-side Supabase access is not used in v1,
-- so tables default to deny-all; reference data gets an explicit read policy in case
-- client-side reads are added later. If anonymous sign-in + direct client access is
-- introduced, add the (select auth.uid()) = auth_uid policies from the Dev-Spec.

alter table scales              enable row level security;
alter table items               enable row level security;
alter table item_scale_loadings enable row level security;  -- NO read policy: weights are business IP
alter table archetypes          enable row level security;
alter table norms               enable row level security;  -- NO read policy
alter table test_sessions       enable row level security;
alter table responses           enable row level security;
alter table results             enable row level security;  -- deny-all: token-validated API only
alter table share_tokens        enable row level security;
alter table matches             enable row level security;
alter table consents            enable row level security;
alter table app_users           enable row level security;
alter table session_user_link   enable row level security;

create policy "scales_read"     on scales     for select using (true);
create policy "items_read"      on items      for select using (true);
create policy "archetypes_read" on archetypes for select using (true);

-- Optional client policies (only if direct client access with anonymous sign-in is enabled):
-- create policy "own_session_select" on test_sessions for select using ((select auth.uid()) = auth_uid);
-- create policy "own_session_insert" on test_sessions for insert with check ((select auth.uid()) = auth_uid);
-- create policy "own_session_update" on test_sessions for update
--   using ((select auth.uid()) = auth_uid) with check ((select auth.uid()) = auth_uid);
-- create policy "own_responses" on responses for all
--   using (exists (select 1 from test_sessions s where s.id = responses.session_id and s.auth_uid = (select auth.uid())))
--   with check (exists (select 1 from test_sessions s where s.id = responses.session_id and s.auth_uid = (select auth.uid())));

-- ---------- Retention: purge abandoned anonymous sessions after 30 days ----------
-- Requires pg_cron (enabled by default on Supabase):
-- select cron.schedule('purge-abandoned-sessions', '15 3 * * *',
--   $$delete from test_sessions where completed_at is null and purge_after < now()$$);
