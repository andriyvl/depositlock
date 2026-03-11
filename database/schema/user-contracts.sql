create extension if not exists pgcrypto;

create table if not exists public.user_contracts (
  id uuid primary key default gen_random_uuid(),
  user_address text not null,
  contract_address text not null,
  role text not null check (role in ('creator', 'depositor')),
  network_id text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists user_contracts_user_address_contract_address_idx
  on public.user_contracts (user_address, contract_address);

create index if not exists user_contracts_user_address_idx
  on public.user_contracts (user_address);

create index if not exists user_contracts_contract_address_idx
  on public.user_contracts (contract_address);
