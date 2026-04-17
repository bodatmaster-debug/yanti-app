# 🚀 Yanti App - Supabase Setup Checklist

## Quick Start

Follow these steps in order to get Supabase fully set up for your Yanti App.

---

## Phase 1: Database Setup (5-10 minutes)

- [ ] **Verify Supabase Connection**
  - Check you have `NEXT_PUBLIC_SUPABASE_URL` in env
  - Check you have `NEXT_PUBLIC_SUPABASE_ANON_KEY` in env
  - Check you have `SUPABASE_SERVICE_ROLE_KEY` in env

- [ ] **Run SQL Migrations**
  
  Choose ONE method below:
  
  **Option A: Supabase SQL Editor (Easiest)**
  1. Open [Supabase Dashboard](https://supabase.com/dashboard)
  2. Select your project → SQL Editor
  3. Create 4 new queries and paste SQL from:
     - `/scripts/01_auth_setup.sql`
     - `/scripts/02_schema_setup.sql`
     - `/scripts/03_rls_policies.sql`
     - `/scripts/04_seed_data.sql`
  4. Run each query in order
  
  **Option B: Command Line (Fast)**
  ```bash
  cd /vercel/share/v0-project
  python3 scripts/run-migrations.py
  ```
  
  **Option C: psql**
  ```bash
  psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/01_auth_setup.sql
  psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/02_schema_setup.sql
  psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/03_rls_policies.sql
  psql postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@... < scripts/04_seed_data.sql
  ```

- [ ] **Verify Tables Created**
  - Go to Supabase Dashboard → Tables
  - Confirm you see:
    - `users` (extends auth.users)
    - `letters` (main documents)
    - `letter_counters` (auto-increment sequences)
    - `audit_logs` (change tracking)

- [ ] **Check RLS is Enabled**
  - Go to Supabase Dashboard → SQL Editor
  - Run: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';`
  - All should show `true` for rowsecurity

---

## Phase 2: Create Test Users (3-5 minutes)

- [ ] **Create Auth Users in Supabase**
  1. Go to Supabase Dashboard → Authentication → Users
  2. Click "Add User"
  3. Create these test accounts:
     ```
     Email: admin@yanti.test
     Password: Test123!@#
     
     Email: manager@yanti.test
     Password: Test123!@#
     
     Email: user@yanti.test
     Password: Test123!@#
     ```

- [ ] **Get User IDs**
  - After creating users, copy their UUIDs from the dashboard
  - You'll need these for the next step

- [ ] **Insert User Profiles** (if using seed data)
  - Edit `/scripts/04_seed_data.sql`
  - Replace the example UUIDs with real ones from step above
  - Uncomment the INSERT statements
  - Run in SQL Editor

---

## Phase 3: Application Code Integration (20-30 minutes)

### 3A: Set Up Client Library

- [ ] **Create `/src/lib/supabase.ts`**
  - Use template from `scripts/INTEGRATION_GUIDE.md`
  - This exports the Supabase client for use throughout app

### 3B: Create Auth Context

- [ ] **Create `/src/contexts/AuthContext.tsx`**
  - Replace Firebase auth with Supabase auth
  - Use template from `scripts/INTEGRATION_GUIDE.md`
  - Provides `useAuth()` hook for components

### 3C: Create Data Query Functions

- [ ] **Create `/src/lib/queries/letters.ts`**
  - Create functions: `getLetters()`, `createLetter()`, `updateLetter()`, `deleteLetter()`
  - Use template from `scripts/INTEGRATION_GUIDE.md`

### 3D: Update Components

- [ ] **Update `/src/app/layout.tsx`**
  - Wrap with `<AuthProvider>`

- [ ] **Update `/src/app/login/page.tsx`**
  - Replace Firebase auth with Supabase auth
  - Use `useAuth()` hook for sign in

- [ ] **Update `/src/components/letters/LetterForm.tsx`**
  - Replace Firebase calls with `createLetter()`
  - Auto-generate letter numbers with `getNextLetterNumber()`

- [ ] **Update `/src/components/letters/LetterList.tsx`**
  - Replace Firebase queries with `getLetters()`
  - Display results in UI

### 3E: Remove Old Firebase Code

- [ ] **Delete Firebase files**
  - Remove any `firebase.ts` or Firebase config files
  - Remove Firebase imports from components
  - Remove Firebase from package.json if possible

- [ ] **Search & Replace**
  - Find all `import { useUser } from '@/firebase'`
  - Replace with `import { useAuth } from '@/contexts/AuthContext'`
  - Find all `getFirebaseLetters()`
  - Replace with `getLetters()`

---

## Phase 4: Testing (5-10 minutes)

### Test Authentication
- [ ] **Sign up flow**
  - Fill out registration form
  - New user should appear in Supabase > Authentication > Users
  - Should be able to sign in immediately

- [ ] **Sign in flow**
  - Sign in with test user
  - Should redirect to dashboard
  - Session persists on page reload
  - Can sign out successfully

### Test Data Access (RLS)
- [ ] **User isolation**
  1. Sign in as `user@yanti.test`
  2. Create a letter
  3. Sign out and sign in as `manager@yanti.test`
  4. Manager SHOULD see the letter (manager role)
  5. Sign in as a different regular user
  6. Regular user should NOT see the first user's letter

- [ ] **Admin access**
  1. Sign in as `admin@yanti.test`
  2. Should be able to see ALL letters
  3. Should be able to see all users in admin panel

### Test Operations
- [ ] **Create letter**
  - Form submits successfully
  - Letter appears in list
  - Letter number is auto-generated correctly

- [ ] **Update letter**
  - Update status from "baru" to "proses"
  - Changes save to database
  - Audit log recorded in `audit_logs` table

- [ ] **Delete letter**
  - Delete button soft-deletes (sets `deleted_at`)
  - Letter no longer visible in list
  - Letter still in database with `deleted_at` timestamp

---

## Phase 5: Production Hardening (Optional)

- [ ] **Review RLS Policies**
  - Go to Supabase Dashboard → Authentication → Policies
  - Review each policy is correct for your business logic
  - Test edge cases

- [ ] **Set Up Backups**
  - Supabase Dashboard → Settings → Database Backups
  - Enable automated backups

- [ ] **Configure Custom Domains** (if needed)
  - Supabase Dashboard → Settings → Custom Domains

- [ ] **Set Up Monitoring**
  - Supabase Dashboard → Logs
  - Watch for errors/unusual activity

- [ ] **Environment Secrets**
  - Store `SUPABASE_SERVICE_ROLE_KEY` securely
  - Never commit to git
  - Add to `.gitignore` if using `.env.local`

---

## Troubleshooting

### Database Issues
**"Table does not exist"**
- Run migrations again, ensuring they complete without errors
- Check Supabase Dashboard > Tables section

**"RLS policy violation"**
- User may not be authenticated
- Check user role in `users` table
- Verify policy logic in `03_rls_policies.sql`

### Auth Issues
**"Session not persisting"**
- Check `AuthContext` wrapper in `layout.tsx`
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Clear browser cookies and try again

**"Cannot sign in"**
- Verify user exists in Supabase > Authentication > Users
- Check password is correct
- Verify user is_active in users table

### Data Issues
**"Cannot create letter"**
- Ensure `created_by_id` is set to current user's ID
- Check user exists in `public.users` table
- Verify user `is_active` is true

**"Letters not loading"**
- Check RLS policy allows SELECT on letters
- Verify user has created letters or is assigned letters
- Check admin/manager role if applicable

---

## Need Help?

📚 **Documentation**
- Database Setup: `/scripts/DATABASE_SETUP.md`
- Integration Guide: `/scripts/INTEGRATION_GUIDE.md`
- Supabase Docs: https://supabase.com/docs

🐛 **Debugging**
- Check Supabase Dashboard > Logs > API
- Check browser DevTools > Console for errors
- Run test queries in SQL Editor

💬 **Support**
- Supabase Support: https://supabase.com/support
- Documentation: https://supabase.com/docs/guides

---

## Completed!

Once all checkboxes are checked, your Yanti App is fully integrated with Supabase! 🎉

Next: Deploy to Vercel and test in production
