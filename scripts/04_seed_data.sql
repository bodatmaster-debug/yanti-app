-- ============================================================================
-- YANTI APP - Seed Data (Optional)
-- ============================================================================
-- Add test data for development and testing

-- Note: In production, use the Supabase dashboard or API to create real users
-- This script creates test users for development purposes

-- Test user IDs (replace with real UUIDs from auth.users table)
-- You can get these from Supabase dashboard > Authentication > Users

-- Example: Insert test user profiles (after real auth users are created)
-- Uncomment and modify these values when you have real auth user IDs

-- insert into public.users (id, email, full_name, role, department)
-- values 
--   ('11111111-1111-1111-1111-111111111111'::uuid, 'admin@yanti.app', 'Admin User', 'admin', 'Management'),
--   ('22222222-2222-2222-2222-222222222222'::uuid, 'manager@yanti.app', 'Manager User', 'manager', 'Operations'),
--   ('33333333-3333-3333-3333-333333333333'::uuid, 'user@yanti.app', 'Regular User', 'user', 'Incoming Mail');

-- insert into public.letter_counters (year, month, counter, prefix, created_by_id)
-- values
--   (2024, 1, 0, 'SRT', '11111111-1111-1111-1111-111111111111'::uuid),
--   (2024, 2, 0, 'SRT', '11111111-1111-1111-1111-111111111111'::uuid),
--   (2024, 3, 0, 'SRT', '11111111-1111-1111-1111-111111111111'::uuid);

-- Example letters (uncomment after users exist):
-- insert into public.letters (
--   number, date_received, sender, subject, status, 
--   classification, priority, created_by_id
-- )
-- values
--   ('SRT/001/I/2024', now()::date, 'PT Example Company', 'Permintaan Quotation', 'baru', 'umum', 'normal', '22222222-2222-2222-2222-222222222222'::uuid),
--   ('SRT/002/I/2024', now()::date, 'Dinas Keuangan', 'Laporan Fiskal', 'proses', 'penting', 'tinggi', '22222222-2222-2222-2222-222222222222'::uuid);

select 'Seed data setup completed! (commented out - uncomment when auth users exist)' as status;
