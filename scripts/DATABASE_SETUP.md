# Yanti App - Database Setup Guide

## Overview

This directory contains SQL migration scripts to set up a secure PostgreSQL database schema in Supabase. The migrations follow best practices for authentication, authorization, and data integrity.

## Migration Files

### 1. `01_auth_setup.sql` 
- Enables UUID extension for ID generation
- Creates `users` table that extends Supabase's `auth.users` table
- Adds fields for: full_name, role, department, phone, avatar, status
- Sets up automatic triggers to create user profiles when new auth users sign up
- Implements timestamp tracking (created_at, updated_at)

**What it does:** Links application user profiles to Supabase Auth

### 2. `02_schema_setup.sql`
- Creates `letters` table (main domain model) with fields for:
  - Document metadata (number, date, sender, subject)
  - Workflow state (status, classification, priority)
  - Relationships (created_by, assigned_to)
  - Audit trail (created_at, updated_at, deleted_at for soft deletes)
- Creates `letter_counters` table for auto-incrementing letter numbers
- Creates `audit_logs` table for tracking all changes
- Adds comprehensive indexes for performance
- Sets up triggers for automatic timestamp updates and audit logging

**What it does:** Establishes the core data model with relationships and performance indexes

### 3. `03_rls_policies.sql`
- Implements Row Level Security (RLS) for secure multi-tenant access
- **Users table policies:**
  - Users can see their own profile
  - Admins can see all users
  - Users can only update their own profile
  - Admins can update any profile
- **Letters table policies:**
  - Users see only: letters they created + letters assigned to them
  - Managers/Admins see all letters
  - Create policy checks user is active
  - Delete policy implements soft delete for users, hard delete for admins
- **Counters table policies:**
  - All users can view counters
  - Users can only create/update counters they own
- **Audit logs table policies:**
  - All users can view audit logs
  - Logs are created automatically via triggers

**What it does:** Enforces secure access control - users can only access their own data

### 4. `04_seed_data.sql`
- Contains commented-out example SQL for test data
- Shows how to insert test users, counters, and letters
- Instructions for uncommenting and using with real auth user IDs

**What it does:** Provides templates for development/testing data

## How to Run Migrations

### Option A: Using Supabase SQL Editor (Easiest - No Setup Needed)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Go to **SQL Editor** 
4. Click **New Query**
5. Copy-paste the SQL from each file in order:
   - First: `01_auth_setup.sql`
   - Second: `02_schema_setup.sql`
   - Third: `03_rls_policies.sql`
   - Fourth: `04_seed_data.sql` (optional, mainly for reference)
6. Run each query

### Option B: Using psql Command Line

```bash
# Install psql if needed
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql-client
# Windows: choco install postgresql

# Get your Supabase connection string from Dashboard > Database > Connection
# Format: postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Run all migrations:
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres < scripts/01_auth_setup.sql
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres < scripts/02_schema_setup.sql
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres < scripts/03_rls_policies.sql
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres < scripts/04_seed_data.sql
```

### Option C: Using Python Script (Requires psql installed)

```bash
# Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env
cd /vercel/share/v0-project
python3 scripts/run-migrations.py
```

### Option D: Using Node.js (Requires psql installed)

```bash
cd /vercel/share/v0-project
node scripts/run-migrations.js
```

## Environment Variables Required

For automation scripts (Option C & D), you need:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (from Settings > API)

**⚠️ WARNING:** Keep the Service Role Key secret! Never commit it to git.

## Database Schema Summary

```
auth.users (managed by Supabase)
    ↓
public.users (your extension table)
    ├─ Relationships to:
    │  ├─ public.letters (created_by_id, assigned_to_id)
    │  ├─ public.letter_counters (created_by_id)
    │  └─ public.audit_logs (changed_by_id)
    │
public.letters (main document table)
    ├─ Soft deletes via deleted_at field
    ├─ Auto audit logging via trigger
    └─ RLS restricts to: own creations + assignments + admin/manager access
    
public.letter_counters (sequence management)
    └─ RLS restricts to: creator + view-all access
    
public.audit_logs (change tracking)
    └─ Auto-populated by triggers, viewable by all authenticated users
```

## Security Features

✅ **Row Level Security (RLS)** - Users can only access their own data
✅ **Audit Logging** - All changes tracked with who/what/when
✅ **Soft Deletes** - Letters can be restored via deleted_at timestamp
✅ **Role-Based Access** - admin/manager/user roles with different permissions
✅ **Automatic Timestamps** - created_at/updated_at managed by triggers
✅ **Foreign Key Constraints** - Referential integrity enforced
✅ **Indexes** - Optimized queries for common filters

## Next Steps

1. **Create Auth Users** in Supabase Dashboard:
   - Go to Authentication > Users > Add User
   - Create admin, manager, and regular user accounts
   - Copy their UUIDs for the seed data

2. **Insert Test Data** (if needed):
   - Uncomment the INSERT statements in `04_seed_data.sql`
   - Replace the example UUIDs with real user IDs from step 1
   - Run the updated script

3. **Integrate with Application Code**:
   - Create a Supabase client utility (`lib/supabase.ts`)
   - Create data access functions (`lib/queries/`)
   - Update React components to use Supabase queries
   - See `INTEGRATION_GUIDE.md` for detailed code examples

4. **Test RLS Policies**:
   - Verify users can only see their own letters
   - Verify managers can see all letters
   - Check audit logs are created on changes

## Troubleshooting

### "table already exists" error
- This is okay! The `if not exists` clause prevents duplication
- If you need to reset, drop tables manually: `DROP TABLE public.letters CASCADE;`

### "auth.users" table not found
- Make sure you're using Supabase's built-in authentication
- Don't manually create auth.users - it's managed by Supabase

### RLS policies not working
- Verify RLS is enabled: `ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;`
- Check policies exist: `SELECT * FROM pg_policies WHERE tablename='letters';`
- Test with authenticated user (not anon)

### Connection refused / Cannot connect
- Verify Supabase project is active
- Check connection string includes correct project ref
- Ensure psql is installed: `psql --version`

## Support

For issues with:
- **SQL Syntax** - Check PostgreSQL 15 documentation
- **Supabase Auth** - See https://supabase.com/docs/guides/auth
- **RLS Policies** - See https://supabase.com/docs/guides/auth/row-level-security

---

**Version:** 1.0  
**Created:** 2024  
**Database:** PostgreSQL 15+  
**Supabase Version:** Latest
