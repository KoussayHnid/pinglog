-- ============================================================
-- PingLog – Supabase PostgreSQL Schema + RLS
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. TABLES
-- ============================================================

-- projects
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  domain        text,
  api_key       text not null unique default encode(gen_random_bytes(24), 'hex'),
  accent_color  text not null default '#4f46e5',
  created_at    timestamptz not null default now()
);

-- changelogs
create table if not exists public.changelogs (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  title        text not null,
  content      text not null,
  category     text not null check (category in ('New', 'Improvement', 'Fix')),
  published_at timestamptz default now()
);

-- feedback_items
create table if not exists public.feedback_items (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'Under Review'
                check (status in ('Under Review', 'Planned', 'In Progress', 'Completed')),
  votes_count integer not null default 0,
  created_at  timestamptz not null default now()
);

-- votes
create table if not exists public.votes (
  id                uuid primary key default gen_random_uuid(),
  feedback_id       uuid not null references public.feedback_items(id) on delete cascade,
  voter_fingerprint text not null,
  created_at        timestamptz not null default now(),
  constraint votes_unique_vote unique (feedback_id, voter_fingerprint)
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

create index if not exists idx_projects_user_id      on public.projects(user_id);
create index if not exists idx_projects_api_key      on public.projects(api_key);
create index if not exists idx_changelogs_project_id on public.changelogs(project_id);
create index if not exists idx_changelogs_published  on public.changelogs(published_at desc);
create index if not exists idx_feedback_project_id   on public.feedback_items(project_id);
create index if not exists idx_feedback_status       on public.feedback_items(status);
create index if not exists idx_votes_feedback_id     on public.votes(feedback_id);

-- ============================================================
-- 3. FUNCTION – auto-increment votes_count
-- ============================================================

create or replace function public.handle_vote_insert()
returns trigger language plpgsql security definer as $$
begin
  update public.feedback_items
  set    votes_count = votes_count + 1
  where  id = NEW.feedback_id;
  return NEW;
end;
$$;

create or replace function public.handle_vote_delete()
returns trigger language plpgsql security definer as $$
begin
  update public.feedback_items
  set    votes_count = greatest(votes_count - 1, 0)
  where  id = OLD.feedback_id;
  return OLD;
end;
$$;

create or replace trigger trg_vote_insert
  after insert on public.votes
  for each row execute function public.handle_vote_insert();

create or replace trigger trg_vote_delete
  after delete on public.votes
  for each row execute function public.handle_vote_delete();

-- ============================================================
-- 4. HELPER FUNCTION – resolve project from api_key
--    Used in RLS policies to allow public read access via
--    the X-Api-Key header sent as a Postgres setting.
-- ============================================================

create or replace function public.requesting_project_id()
returns uuid language sql stable as $$
  select id
  from   public.projects
  where  api_key = current_setting('request.headers', true)::json->>'x-api-key'
  limit  1;
$$;

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

alter table public.projects      enable row level security;
alter table public.changelogs    enable row level security;
alter table public.feedback_items enable row level security;
alter table public.votes         enable row level security;

-- ----------------------------------------------------------------
-- projects: owner-only CRUD
-- ----------------------------------------------------------------

create policy "projects_select_owner"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "projects_insert_owner"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "projects_update_owner"
  on public.projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "projects_delete_owner"
  on public.projects for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- changelogs: public read via api_key | owner write
-- ----------------------------------------------------------------

-- Public SELECT: any request carrying a valid X-Api-Key header
create policy "changelogs_select_public"
  on public.changelogs for select
  using (
    project_id = public.requesting_project_id()
    or exists (
      select 1 from public.projects p
      where p.id = changelogs.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "changelogs_insert_owner"
  on public.changelogs for insert
  with check (
    exists (
      select 1 from public.projects p
      where p.id = changelogs.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "changelogs_update_owner"
  on public.changelogs for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = changelogs.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "changelogs_delete_owner"
  on public.changelogs for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = changelogs.project_id
        and p.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- feedback_items: public read via api_key | public insert (suggestion)
--                 | owner update/delete
-- ----------------------------------------------------------------

create policy "feedback_select_public"
  on public.feedback_items for select
  using (
    project_id = public.requesting_project_id()
    or exists (
      select 1 from public.projects p
      where p.id = feedback_items.project_id
        and p.user_id = auth.uid()
    )
  );

-- Anyone with a valid api_key can submit a feedback suggestion
create policy "feedback_insert_public"
  on public.feedback_items for insert
  with check (
    project_id = public.requesting_project_id()
    or exists (
      select 1 from public.projects p
      where p.id = feedback_items.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "feedback_update_owner"
  on public.feedback_items for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = feedback_items.project_id
        and p.user_id = auth.uid()
    )
  );

create policy "feedback_delete_owner"
  on public.feedback_items for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = feedback_items.project_id
        and p.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- votes: public read + public insert (anti-spam via unique constraint)
--        | owner delete
-- ----------------------------------------------------------------

create policy "votes_select_public"
  on public.votes for select
  using (
    exists (
      select 1
      from   public.feedback_items fi
      join   public.projects p on p.id = fi.project_id
      where  fi.id = votes.feedback_id
        and  (p.id = public.requesting_project_id() or p.user_id = auth.uid())
    )
  );

-- Public INSERT: voter_fingerprint + unique constraint prevents spam
create policy "votes_insert_public"
  on public.votes for insert
  with check (
    exists (
      select 1
      from   public.feedback_items fi
      join   public.projects p on p.id = fi.project_id
      where  fi.id = votes.feedback_id
        and  (p.id = public.requesting_project_id() or p.user_id = auth.uid())
    )
  );

create policy "votes_delete_owner"
  on public.votes for delete
  using (
    exists (
      select 1
      from   public.feedback_items fi
      join   public.projects p on p.id = fi.project_id
      where  fi.id = votes.feedback_id
        and  p.user_id = auth.uid()
    )
  );

-- ============================================================
-- ============================================================
-- 6. SUBSCRIPTIONS, PLAN LIMITS, AND CUSTOM BRANDING
-- ============================================================

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due')),
  lemon_squeezy_customer_id text,
  lemon_squeezy_subscription_id text unique,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_owner"
  on public.subscriptions for select
  using (auth.uid() = user_id);

insert into public.subscriptions (user_id)
select id from auth.users
on conflict (user_id) do nothing;

create or replace function public.create_free_subscription_for_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger trg_create_free_subscription
  after insert on auth.users
  for each row execute function public.create_free_subscription_for_user();

alter table public.projects
  alter column accent_color set default '#4f46e5';

create or replace function public.enforce_project_plan_limits()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

  if not exists (
    select 1
    from public.subscriptions s
    where s.user_id = new.user_id
      and s.plan = 'pro'
      and s.status = 'active'
  ) then
    if tg_op = 'INSERT' and new.accent_color is distinct from '#4f46e5' then
      raise exception using errcode = '23514', message = 'PRO_CUSTOM_BRANDING_REQUIRED';
    end if;

    if tg_op = 'UPDATE' and new.accent_color is distinct from old.accent_color then
      raise exception using errcode = '23514', message = 'PRO_CUSTOM_BRANDING_REQUIRED';
    end if;

    if tg_op = 'INSERT' and (
      select count(*) from public.projects p where p.user_id = new.user_id
    ) >= 1 then
      raise exception using errcode = '23514', message = 'FREE_PROJECT_LIMIT';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_enforce_project_plan_limits
  before insert or update of accent_color on public.projects
  for each row execute function public.enforce_project_plan_limits();

create or replace function public.enforce_changelog_plan_limits()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  project_owner uuid;
begin
  select p.user_id into project_owner
  from public.projects p
  where p.id = new.project_id
  for update;

  if project_owner is null then
    raise exception using errcode = '23503', message = 'PROJECT_NOT_FOUND';
  end if;

  if not exists (
    select 1
    from public.subscriptions s
    where s.user_id = project_owner
      and s.plan = 'pro'
      and s.status = 'active'
  ) and (
    select count(*) from public.changelogs c where c.project_id = new.project_id
  ) >= 10 then
    raise exception using errcode = '23514', message = 'FREE_CHANGELOG_LIMIT';
  end if;

  return new;
end;
$$;

create trigger trg_enforce_changelog_plan_limits
  before insert on public.changelogs
  for each row execute function public.enforce_changelog_plan_limits();

-- ============================================================
-- END OF SCHEMA
-- ============================================================
