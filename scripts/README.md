# 📚 Yanti App - Database Migration & Integration Scripts

This folder contains all the SQL migrations and documentation needed to set up Supabase for the Yanti App.

## 📁 What's Inside

### SQL Migration Files (Run these first)

1. **`01_auth_setup.sql`** (2.6 KB)
   - Enables UUID extension
   - Creates `users` table extending Supabase Auth
   - Sets up automatic user profile creation trigger
   - Creates timestamp update trigger

2. **`02_schema_setup.sql`** (5.3 KB)
   - Creates `letters` table (main documents)
   - Creates `letter_counters` table (auto-incrementing sequences)
   - Creates `audit_logs` table (change tracking)
   - Adds comprehensive indexes for performance
   - Sets up audit logging trigger

3. **`03_rls_policies.sql`** (5.0 KB)
   - Implements Row Level Security for all tables
   - Enforces user data isolation (users see only their own data)
   - Enables manager/admin access to all records
   - Soft delete enforcement for regular users

4. **`04_seed_data.sql`** (2.0 KB)
   - Optional test data templates (commented out)
   - Shows example of inserting test users
   - Example letter creation for testing

### Automation Scripts

5. **`run-migrations.py`** (3.1 KB)
   - Python script to run all SQL migrations at once
   - Requires: psql command-line tool
   - Usage: `python3 run-migrations.py`

6. **`run-migrations.js`** (2.0 KB)
   - Node.js version of the migration runner
   - Requires: psql command-line tool
   - Usage: `node run-migrations.js`

### Documentation

7. **`DATABASE_SETUP.md`** (7.5 KB) - **START HERE**
   - Overview of each migration file
   - Step-by-step instructions to run migrations
   - 4 different methods to execute (SQL Editor, psql, Python, Node)
   - Environment variables setup
   - Troubleshooting guide

8. **`INTEGRATION_GUIDE.md`** (13 KB)
   - How to integrate Supabase into your React app
   - Code templates for AuthContext
   - Data query functions for letters
   - Component examples (LetterForm, LetterList)
   - Updated login page example
   - Testing instructions

9. **`SCHEMA_REFERENCE.md`** (15 KB)
   - Complete database schema documentation
   - Entity relationship diagram
   - Detailed table definitions
   - RLS policies explained
   - Common SQL queries
   - Performance considerations

10. **`SETUP_CHECKLIST.md`** (7.6 KB)
    - Interactive checklist to follow
    - 5 phases: Database, Users, Code, Testing, Production
    - Copy-paste environment variables
    - Testing procedures
    - Troubleshooting quick reference

11. **`README.md`** (This file)
    - Guide to all scripts and documentation

---

## 🚀 Quick Start (5 minutes)

### Option 1: Using Supabase Dashboard (Easiest - No Setup Required)

```
1. Go to https://supabase.com/dashboard
2. Open your project > SQL Editor
3. Copy-paste each SQL file (01, 02, 03, 04) and run
4. Done! Your database is set up.
```

### Option 2: Using Python (Requires psql installed)

```bash
cd /vercel/share/v0-project
python3 scripts/run-migrations.py
```

### Option 3: Using Node.js (Requires psql installed)

```bash
cd /vercel/share/v0-project
npm run migrate  # if script is added to package.json
# OR
node scripts/run-migrations.js
```

### Option 4: Manual psql (Most Control)

```bash
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/01_auth_setup.sql
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/02_schema_setup.sql
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/03_rls_policies.sql
psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/04_seed_data.sql
```

---

## 📖 Reading Guide

### For Database Administrators
1. Read: `DATABASE_SETUP.md` - Understand what migrations do
2. Choose: Pick execution method
3. Run: Execute all 4 SQL files in order
4. Verify: Check Supabase Dashboard for tables

### For Backend Developers
1. Read: `SCHEMA_REFERENCE.md` - Understand data model
2. Read: `INTEGRATION_GUIDE.md` - See code examples
3. Implement: Create `lib/supabase.ts` client
4. Implement: Create `contexts/AuthContext.tsx`
5. Integrate: Update components to use Supabase queries

### For Frontend Developers
1. Read: `INTEGRATION_GUIDE.md` - See React patterns
2. Copy: Use component templates provided
3. Test: Follow testing section in `SETUP_CHECKLIST.md`

### For DevOps / Infrastructure
1. Read: `DATABASE_SETUP.md` - Deployment options
2. Review: `SCHEMA_REFERENCE.md` - Performance indexes
3. Configure: Set up backups and monitoring in Supabase Dashboard

### Everyone
- Reference: `SETUP_CHECKLIST.md` - Keep handy during setup
- Troubleshoot: Last section of each doc has common issues

---

## 🔐 Security Features Built In

✅ **Row Level Security (RLS)**
- Users can only see their own letters
- Managers see all letters
- Admins have full access
- Enforced at database level (cannot be bypassed)

✅ **Audit Logging**
- Every change is logged with who/what/when
- Stored in `audit_logs` table
- Useful for compliance and debugging

✅ **Soft Deletes**
- Letters deleted by regular users aren't permanently removed
- `deleted_at` timestamp marks deletion
- Data recoverable if needed
- Admins can hard-delete if necessary

✅ **Role-Based Access Control**
- Three roles: admin, manager, user
- Different permissions for each role
- Enforced via RLS policies

✅ **Automatic Audit Trail**
- Triggers capture old/new values as JSON
- Know exactly what changed and when
- Track who made each change

---

## 📊 Database Schema Summary

```
USERS
├── Authenticated users from Supabase Auth
├── Extended with profile info (name, role, dept)
└── RLS: Users see only themselves + admins see all

LETTERS (Main Document Table)
├── Incoming mail/documents
├── Status: baru → proses → selesai → arsip
├── Classification: umum, penting, rahasia
├── Priority: rendah, normal, tinggi
├── Soft delete: deleted_at timestamp
└── RLS: Users see only own + assigned + managers see all

LETTER_COUNTERS (Auto-Increment Management)
├── Manages SRT/001/01/2024 format
├── One counter per month
├── Tracks sequence for each year/month
└── RLS: All users can view, limited create/update

AUDIT_LOGS (Change Tracking)
├── Immutable audit trail
├── Captures before/after state as JSON
├── Tracks who made each change
└── RLS: All users can view
```

---

## ✅ Pre-Flight Checklist

Before running migrations, verify:

- [ ] You have Supabase project created
- [ ] You have `NEXT_PUBLIC_SUPABASE_URL` environment variable
- [ ] You have `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable
- [ ] You have `SUPABASE_SERVICE_ROLE_KEY` environment variable (for admin operations)
- [ ] You're using PostgreSQL 14+ (Supabase default is fine)
- [ ] You have psql installed (if using Python/Node runners)

---

## 🆘 Troubleshooting

### Migration Fails
1. Check Supabase project is active
2. Verify connection string is correct
3. Try running in Supabase SQL Editor first (easier debugging)
4. Check SQL syntax with `psql` locally

### Tables Don't Appear
1. Verify migrations ran without errors
2. Go to Supabase Dashboard > Tables section
3. Refresh browser if needed
4. Check you're in correct project

### RLS Not Working
1. Verify RLS is enabled: Dashboard > Tables > Table Settings
2. Check user is authenticated (not anonymous)
3. Review RLS policies in Documentation > Policies
4. Test with authenticated session

### Connection Issues
- Wrong connection string? Check Dashboard > Settings > Database
- Can't connect with psql? Install: `brew install postgresql` (Mac)
- Database timeout? Check if Supabase project is in pause state

---

## 📚 External Resources

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Next.js + Supabase**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

---

## 📝 File Structure

```
scripts/
├── 01_auth_setup.sql           ← Run first
├── 02_schema_setup.sql         ← Run second
├── 03_rls_policies.sql         ← Run third
├── 04_seed_data.sql            ← Run fourth (optional)
├── run-migrations.py           ← Automation script
├── run-migrations.js           ← Automation script
├── DATABASE_SETUP.md           ← Start here
├── INTEGRATION_GUIDE.md        ← Code examples
├── SCHEMA_REFERENCE.md         ← Database docs
├── SETUP_CHECKLIST.md          ← Step-by-step
└── README.md                   ← This file
```

---

## 🎯 Next Steps

1. **Setup Database**: Run migrations using one of the 4 methods
2. **Create Test Users**: Go to Supabase Dashboard > Authentication > Add Users
3. **Integrate Code**: Follow `INTEGRATION_GUIDE.md`
4. **Test**: Follow `SETUP_CHECKLIST.md` testing section
5. **Deploy**: Push to GitHub, deploy to Vercel

---

## 💡 Pro Tips

- **Keep it organized**: Run all migrations at once, don't skip any
- **Test locally**: Try migrations locally before deploying
- **Backup first**: Supabase auto-backs up, but good practice anyway
- **Monitor logs**: Check Supabase Dashboard > Logs for any issues
- **Version your migrations**: If you modify, create new files (v2, v3, etc.)

---

## 📞 Support

- 💬 **Questions?** Check `SETUP_CHECKLIST.md` troubleshooting section
- 📚 **Need examples?** See `INTEGRATION_GUIDE.md`
- 🔍 **Schema questions?** Check `SCHEMA_REFERENCE.md`
- 🆘 **Still stuck?** Check Supabase docs at supabase.com/docs

---

**Version**: 1.0  
**Last Updated**: April 2024  
**Supabase Compatible**: Latest  
**PostgreSQL Version**: 14+  

---

Ready to build? Start with `DATABASE_SETUP.md` 🚀
