-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.subscriptions (
  clerk_user_id text primary key,
  email text,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'free'
    check (status in ('free', 'active', 'canceled', 'past_due')),
  free_analysis_used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

create index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id);

create index if not exists subscriptions_email_idx
  on public.subscriptions (email);

-- Server-only access: enable RLS and do not add public policies.
-- The Next.js API uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
alter table public.subscriptions enable row level security;
