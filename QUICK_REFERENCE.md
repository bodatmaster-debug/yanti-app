# 🚀 Yanti App Supabase - Quick Reference Card

## Execution Methods (Pick ONE)

### 🟢 Easiest: SQL Editor (5 min, No Setup)
```
1. https://supabase.com/dashboard
2. Your Project → SQL Editor
3. New Query → Copy/Paste /scripts/01_auth_setup.sql → Run
4. New Query → Copy/Paste /scripts/02_schema_setup.sql → Run
5. New Query → Copy/Paste /scripts/03_rls_policies.sql → Run
6. New Query → Copy/Paste /scripts/04_seed_data.sql → Run
7. Done! ✅
```

### 🟡 Python (3 min, Requires: psql)
```bash
cd /vercel/share/v0-project
python3 scripts/run-migrations.py
```

### 🟡 Node.js (3 min, Requires: psql)
```bash
cd /vercel/share/v0-project
node scripts/run-migrations.js
```

### 🟡 Manual psql (5 min, Requires: psql, connection string)
```bash
psql [CONNECTION_STRING] < scripts/01_auth_setup.sql
psql [CONNECTION_STRING] < scripts/02_schema_setup.sql
psql [CONNECTION_STRING] < scripts/03_rls_policies.sql
psql [CONNECTION_STRING] < scripts/04_seed_data.sql
```

Get connection string: Supabase Dashboard → Settings → Database

---

## Post-Migration Checklist

- [ ] Tables created (Supabase Dashboard > Tables)
- [ ] Create 3 test users in Authentication > Users:
  - admin@yanti.test / Test123!@#
  - manager@yanti.test / Test123!@#
  - user@yanti.test / Test123!@#
- [ ] Copy user IDs for seed data (if using)

---

## Integration Checklist

### Code Files to Create

```typescript
// 1. /src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(url, anonKey)

// 2. /src/contexts/AuthContext.tsx  
export function useAuth() { ... }
export function AuthProvider({ children }) { ... }

// 3. /src/lib/queries/letters.ts
export async function getLetters() { ... }
export async function createLetter(data) { ... }
export async function updateLetter(id, data) { ... }
export async function deleteLetter(id) { ... }
```

### Components to Update

```typescript
// In layout.tsx
<AuthProvider>
  {children}
</AuthProvider>

// In login page
const { signIn } = useAuth()
await signIn(email, password)

// In letter form
await createLetter({...})

// In letter list
const letters = await getLetters()
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

Get from: Supabase Dashboard > Settings > API

---

## Database Quick Facts

| Item | Details |
|------|---------|
| **Tables** | users, letters, letter_counters, audit_logs |
| **Auth** | Supabase managed + extended profile table |
| **User Isolation** | Row Level Security (RLS) enforced |
| **Audit Trail** | Every change logged in audit_logs |
| **Soft Delete** | deleted_at timestamp (recoverable) |
| **Letter Number** | Auto-generated: SRT/001/01/2024 |
| **Roles** | admin, manager, user |
| **Status** | baru, proses, selesai, arsip |
| **Classification** | umum, penting, rahasia |
| **Priority** | rendah, normal, tinggi |

---

## User Permissions (RLS)

```
REGULAR USER can:
✓ View own profile
✓ View own letters
✓ View assigned letters
✓ Create letters
✓ Update own letters
✓ Soft-delete own letters
✗ See other users
✗ Manage users

MANAGER can:
✓ View all letters
✓ View all users
✓ View audit logs
✓ Create/update letters
✗ Delete users

ADMIN can:
✓ Everything (full access)
✓ Hard-delete letters
✓ Manage all users
✓ See audit logs
```

---

## Common Patterns

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### Sign In
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

### Sign Up
```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name } }
})
```

### Fetch Data (Respects RLS)
```typescript
const { data } = await supabase
  .from('letters')
  .select('*')
  .order('created_at', { ascending: false })
```

### Create Data
```typescript
const { data, error } = await supabase
  .from('letters')
  .insert({ ...letterData, created_by_id: user.id })
  .select()
  .single()
```

### Update Data
```typescript
const { data, error } = await supabase
  .from('letters')
  .update({ status: 'selesai' })
  .eq('id', letterId)
  .select()
```

### Soft Delete
```typescript
await supabase
  .from('letters')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', letterId)
```

---

## Troubleshooting Quick Links

| Problem | Check |
|---------|-------|
| Migration fails | SQL syntax error? Try SQL Editor first |
| Tables not exist | Did migrations run? Check Supabase UI |
| RLS not working | Is RLS enabled? Verify on table settings |
| Cannot sign in | User exists in Authentication? Correct password? |
| Cannot see letters | User role correct? Is user active? |
| Session not persist | AuthContext wrapping app? Check browser storage |

---

## File Reference

```
Project Root
├── scripts/
│   ├── 01_auth_setup.sql          ← Run migrations
│   ├── 02_schema_setup.sql        ← Run these
│   ├── 03_rls_policies.sql        ← In order
│   ├── 04_seed_data.sql           ← (Optional)
│   ├── run-migrations.py          ← Or use these
│   ├── run-migrations.js          ← Automation tools
│   ├── README.md                  ← Full overview
│   ├── DATABASE_SETUP.md          ← Migration guide
│   ├── INTEGRATION_GUIDE.md       ← Code examples
│   ├── SCHEMA_REFERENCE.md        ← Database docs
│   └── SETUP_CHECKLIST.md         ← Detailed checklist
├── src/
│   ├── lib/
│   │   └── supabase.ts            ← Create this
│   └── contexts/
│       └── AuthContext.tsx        ← Create this
└── SUPABASE_SETUP_SUMMARY.md      ← This document
```

---

## Next Steps

1. **[5 min]** Run migrations (pick a method above)
2. **[3 min]** Create test users in Supabase Dashboard
3. **[30 min]** Create code files from Integration Checklist
4. **[10 min]** Test sign in, permissions, data access
5. **[5 min]** Deploy and verify in production

---

## Resources

- 📖 Supabase Docs: https://supabase.com/docs
- 🔐 RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
- 💻 Next.js + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- 🐘 PostgreSQL Docs: https://www.postgresql.org/docs/

---

**Time to complete:** ~45 minutes from start to deployed  
**Difficulty:** Easy (just follow the checklist)  
**Support:** All docs in `/scripts` folder

Good luck! 🎉
