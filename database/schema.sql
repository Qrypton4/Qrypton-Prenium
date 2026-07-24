-- Qrypton — schéma PostgreSQL (Supabase)
-- L'authentification est gérée par Supabase Auth (table intégrée auth.users).
-- "profiles" ne fait qu'étendre auth.users avec des données propres à Qrypton.

create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Crée automatiquement un profil à chaque inscription (Supabase Auth)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,          -- 'opr-edge', 'dax-edge', ...
  name text not null,                 -- 'OPR Edge™'
  stripe_price_id text not null,
  active boolean default true
);

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id),
  stripe_subscription_id text unique not null,
  status text not null,               -- active | past_due | canceled | trialing
  plan text not null default 'monthly', -- 'monthly' | 'six_months' | 'twelve_months' (voir lib/plans.ts)
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now()
);

create table licenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  subscription_id uuid references subscriptions(id),
  product_id uuid references products(id),
  license_key text unique not null,
  status text not null default 'active',   -- active | suspended | revoked
  mt5_account_login text,
  mt5_broker text,
  -- Date de fin de licence réelle, calculée via lib/plans.ts::computeLicenseEndDate()
  -- pour les offres 6 et 12 mois : tient compte de la pause saisonnière
  -- août/septembre (mois non actifs, décalés) et des mois bonus de l'offre 12 mois.
  -- Reste NULL pour l'offre mensuelle (le renouvellement Stripe gère seul la durée).
  active_license_until timestamptz,
  activated_at timestamptz,
  last_verified_at timestamptz,
  reset_count int default 0,
  created_at timestamptz default now()
);

create table license_checks (
  id bigserial primary key,
  license_id uuid references licenses(id) on delete cascade,
  mt5_account_login text,
  ip_address text,
  result text not null,               -- valid | invalid | mismatch
  checked_at timestamptz default now()
);

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_invoice_id text unique not null,
  amount_paid integer not null,       -- en centimes
  pdf_url text,
  issued_at timestamptz default now()
);

-- index utiles
create index idx_licenses_key on licenses(license_key);
create index idx_checks_license on license_checks(license_id, checked_at desc);
create index idx_subscriptions_user on subscriptions(user_id);

-- Suivi de performance réelle (compte officiel Qrypton, affiché publiquement)
create table live_trades (
  id bigserial primary key,
  license_id uuid references licenses(id),   -- licence du compte officiel utilisé pour le track record public
  mt5_account_login text not null,
  symbol text not null,
  direction text not null,            -- 'buy' | 'sell'
  open_time timestamptz not null,
  close_time timestamptz not null,
  lot_size numeric,
  profit numeric not null,            -- résultat en devise du compte (€)
  r_multiple numeric,                 -- ex. 3.0 ou -1.0
  balance_after numeric,              -- solde du compte après ce trade (sert à tracer la courbe de capital)
  created_at timestamptz default now()
);

create index idx_live_trades_license on live_trades(license_id, close_time desc);

-- Une licence marquée comme track record public (une seule normalement)
alter table licenses add column is_public_track_record boolean default false;

-- Challenge Prop Firm — configuration statique (ne change pas trade par trade)
create table prop_challenges (
  id uuid primary key default uuid_generate_v4(),
  license_id uuid references licenses(id) on delete cascade,
  broker_name text not null,
  platform text not null default 'MetaTrader 5',
  robot_name text not null default 'Qrypton',
  account_size numeric not null,
  start_date date not null,
  status text not null default 'in_progress', -- in_progress | passed | failed
  is_public boolean default true, -- affiché sur /challenge-prop-firm
  created_at timestamptz default now()
);

create index idx_prop_challenges_license on prop_challenges(license_id);

-- Instantanés de compte (balance/équité en temps réel), envoyés par le robot toutes les X minutes
create table account_snapshots (
  id bigserial primary key,
  license_id uuid references licenses(id) on delete cascade,
  balance numeric not null,
  equity numeric not null,
  floating_pl numeric,
  open_positions_count int,
  captured_at timestamptz default now()
);

create index idx_snapshots_license on account_snapshots(license_id, captured_at desc);

-- Système d'emails automatiques
-- Journal de tous les emails envoyés — sert à éviter les doublons (ex: ne jamais
-- renvoyer deux fois l'email de bienvenue) et donne un historique consultable.
create table email_log (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  email_type text not null, -- 'welcome' | 'payment_confirmation' | 'renewal_upcoming' |
                             -- 'renewal_confirmed' | 'payment_failed' | 'abandoned_24h' |
                             -- 'abandoned_3d' | 'cancellation' | 'checkin_7d'
  sent_at timestamptz default now()
);

create index idx_email_log_user_type on email_log(user_id, email_type);

-- Suivi des passages en page de paiement non finalisés, pour les relances automatiques
create table checkout_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_session_id text,
  created_at timestamptz default now(),
  completed_at timestamptz, -- rempli par le webhook Stripe si le paiement aboutit
  reminder_24h_sent_at timestamptz,
  reminder_3d_sent_at timestamptz
);

create index idx_checkout_attempts_pending on checkout_attempts(created_at) where completed_at is null;



