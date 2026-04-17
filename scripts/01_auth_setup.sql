-- ============================================================================
-- YANTI APP - Auth & Users Setup
-- ============================================================================
-- This script configures Supabase Authentication and creates the users table
-- that extends the built-in auth.users table with application-specific fields

-- Enable UUID extension for generating unique IDs
create extension if not exists "uuid-ossp";

-- Create users table to extend auth.users with app-specific fields
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text default 'user' check (role in ('admin', 'user', 'manager')),
  department text,
  phone text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on email for faster lookups
create index idx_users_email on public.users(email);

-- Create index on role for admin queries
create index idx_users_role on public.users(role);

-- Add comment to users table
comment on table public.users is 'Extended user profile information linked to Supabase auth.users';

-- Create trigger to automatically insert user into users table when auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger for automatic user creation in users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create trigger to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_updated_at on public.users;
create trigger handle_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- Grant permissions (will be restricted by RLS in next migration)
alter table public.users enable row level security;

grant select, insert, update on public.users to authenticated;
grant select on public.users to anon;

-- Verify setup
select 'Auth setup completed successfully!' as status;
