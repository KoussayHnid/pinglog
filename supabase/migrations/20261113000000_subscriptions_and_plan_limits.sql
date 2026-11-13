create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due')),
  lemon_squeezy_customer_id text,
  lemon_squeezy_subscription_id text unique,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_owner" on public.subscriptions;
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

drop trigger if exists trg_create_free_subscription on auth.users;
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
      raise exception using
        errcode = '23514',
        message = 'PRO_CUSTOM_BRANDING_REQUIRED';
    end if;

    if tg_op = 'UPDATE' and new.accent_color is distinct from old.accent_color then
      raise exception using
        errcode = '23514',
        message = 'PRO_CUSTOM_BRANDING_REQUIRED';
    end if;

    if tg_op = 'INSERT' and (
      select count(*) from public.projects p where p.user_id = new.user_id
    ) >= 1 then
      raise exception using
        errcode = '23514',
        message = 'FREE_PROJECT_LIMIT';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_project_plan_limits on public.projects;
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
    raise exception using
      errcode = '23503',
      message = 'PROJECT_NOT_FOUND';
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
    raise exception using
      errcode = '23514',
      message = 'FREE_CHANGELOG_LIMIT';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_changelog_plan_limits on public.changelogs;
create trigger trg_enforce_changelog_plan_limits
  before insert on public.changelogs
  for each row execute function public.enforce_changelog_plan_limits();
