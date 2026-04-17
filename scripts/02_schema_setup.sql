-- ============================================================================
-- YANTI APP - Core Database Schema
-- ============================================================================
-- Creates tables for letters, counters, and audit logs with proper relationships

-- Create letters table (main domain model)
create table if not exists public.letters (
  id uuid primary key default uuid_generate_v4(),
  number text unique not null,
  date_received date not null,
  sender text not null,
  sender_address text,
  phone_number text,
  email text,
  subject text not null,
  content text,
  classification text default 'umum' check (classification in ('umum', 'penting', 'rahasia')),
  status text default 'baru' check (status in ('baru', 'proses', 'selesai', 'arsip')),
  priority text default 'normal' check (priority in ('rendah', 'normal', 'tinggi')),
  received_by_id uuid references public.users(id) on delete set null,
  assigned_to_id uuid references public.users(id) on delete set null,
  attachments text[],
  notes text,
  created_by_id uuid not null references public.users(id) on delete restrict,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deleted_at timestamp with time zone default null
);

-- Indexes for letters table
create index idx_letters_number on public.letters(number);
create index idx_letters_status on public.letters(status);
create index idx_letters_classification on public.letters(classification);
create index idx_letters_created_by on public.letters(created_by_id);
create index idx_letters_assigned_to on public.letters(assigned_to_id);
create index idx_letters_created_at on public.letters(created_at desc);
create index idx_letters_deleted_at on public.letters(deleted_at) where deleted_at is null;

-- Create letter_counters table for auto-incrementing letter numbers
create table if not exists public.letter_counters (
  id uuid primary key default uuid_generate_v4(),
  year integer not null,
  month integer not null check (month >= 1 and month <= 12),
  counter integer default 0,
  prefix text default 'SRT',
  created_by_id uuid not null references public.users(id) on delete restrict,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(year, month)
);

-- Indexes for letter_counters
create index idx_letter_counters_year_month on public.letter_counters(year, month);

-- Create audit_logs table for tracking changes
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  table_name text not null,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  record_id uuid not null,
  old_values jsonb,
  new_values jsonb,
  changed_by_id uuid references public.users(id) on delete set null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for audit_logs
create index idx_audit_logs_table_name on public.audit_logs(table_name);
create index idx_audit_logs_record_id on public.audit_logs(record_id);
create index idx_audit_logs_changed_by on public.audit_logs(changed_by_id);
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- Create triggers to update updated_at for letters and letter_counters
drop trigger if exists handle_updated_at_letters on public.letters;
create trigger handle_updated_at_letters
  before update on public.letters
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_updated_at_letter_counters on public.letter_counters;
create trigger handle_updated_at_letter_counters
  before update on public.letter_counters
  for each row execute procedure public.handle_updated_at();

-- Create trigger to log letter changes
create or replace function public.log_letter_changes()
returns trigger as $$
begin
  insert into public.audit_logs (
    table_name,
    operation,
    record_id,
    old_values,
    new_values,
    changed_by_id
  ) values (
    'letters',
    tg_op,
    coalesce(new.id, old.id),
    to_jsonb(old),
    to_jsonb(new),
    coalesce(new.created_by_id, old.created_by_id)
  );
  return coalesce(new, old);
end;
$$ language plpgsql;

drop trigger if exists log_letter_changes on public.letters;
create trigger log_letter_changes
  after insert or update or delete on public.letters
  for each row execute procedure public.log_letter_changes();

-- Enable RLS on all tables
alter table public.letters enable row level security;
alter table public.letter_counters enable row level security;
alter table public.audit_logs enable row level security;

-- Grant basic permissions (RLS policies will restrict further)
grant select, insert, update on public.letters to authenticated;
grant select, insert on public.letter_counters to authenticated;
grant select on public.audit_logs to authenticated;

-- Add comments to tables
comment on table public.letters is 'Main table storing incoming letters/documents';
comment on table public.letter_counters is 'Tracks letter number sequences by year and month';
comment on table public.audit_logs is 'Audit trail for all changes to letters and counters';

select 'Core schema created successfully!' as status;
