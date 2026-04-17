# Yanti App - Database Schema Reference

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE POSTGRESQL                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────┐
                    │   auth.users (Managed)   │ (Built-in Supabase Auth)
                    │──────────────────────────│
                    │ id (UUID) - PRIMARY KEY  │
                    │ email                    │
                    │ raw_user_meta_data       │
                    └────────────┬─────────────┘
                                 │ ONE-TO-ONE (Foreign Key)
                                 │
                    ┌────────────▼─────────────┐
                    │   public.users           │ (Your extension table)
                    │──────────────────────────│
                    │ id (UUID) - PK/FK        │────────────┐
                    │ email (UNIQUE)           │            │
                    │ full_name                │            │
                    │ role (admin|manager|user)│            │
                    │ department               │            │
                    │ phone                    │            │
                    │ avatar_url               │            │
                    │ is_active                │            │
                    │ created_at               │            │
                    │ updated_at               │            │
                    │ RLS: ENABLED ✓           │            │
                    └────────────┬──────────────┘            │
                                 │                           │
                 ┌───────────────┼───────────────┐           │
                 │               │               │           │
                 │ (created_by)  │(assigned_to)  │           │
                 │ (created_by)  │(changed_by)   │           │
                 │               │               │           │
        ┌────────▼────────────┐ ┌▼─────────────────────┐    │
        │  public.letters     │ │public.letter_counters│    │
        │─────────────────────│ │──────────────────────│    │
        │ id (UUID) - PK      │ │ id (UUID) - PK       │    │
        │ number (UNIQUE)     │ │ year (INT)           │    │
        │ date_received (DATE)│ │ month (INT 1-12)     │    │
        │ sender              │ │ counter              │    │
        │ sender_address      │ │ prefix (DEFAULT 'SRT')    │
        │ phone_number        │ │ created_by_id ◄─────┘    │
        │ email               │ │ created_at           │
        │ subject             │ │ updated_at           │
        │ content             │ │ RLS: ENABLED ✓       │
        │ classification*     │ │ UNIQUE(year, month)  │
        │ status*             │ └──────────────────────┘
        │ priority*           │
        │ received_by_id ──►──┐
        │ assigned_to_id ─┐   │
        │ attachments[]   │   │
        │ notes           │   │
        │ created_by_id ──┘   │
        │ created_at      │   │
        │ updated_at      │   │
        │ deleted_at      │◄──┴─ Soft Delete (not hard-deleted)
        │ RLS: ENABLED ✓  │
        └────────┬────────┘
                 │
                 │ (records all changes via trigger)
                 │
        ┌────────▼──────────────────┐
        │  public.audit_logs        │
        │───────────────────────────│
        │ id (UUID) - PK            │
        │ table_name (VARCHAR)      │
        │ operation (INSERT/UPDATE) │
        │ record_id (UUID)          │
        │ old_values (JSONB)        │
        │ new_values (JSONB)        │
        │ changed_by_id ────────────┼─► references users.id
        │ reason (nullable)         │
        │ created_at                │
        │ RLS: ENABLED ✓            │
        └───────────────────────────┘

* Classification: umum | penting | rahasia
* Status: baru | proses | selesai | arsip
* Priority: rendah | normal | tinggi
```

---

## Table Definitions

### `public.users`

Extended user profile linked to Supabase Auth

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, FK(auth.users) | Auto-created from auth |
| email | TEXT | UNIQUE, NOT NULL | From auth.users |
| full_name | TEXT | | Display name |
| role | TEXT | DEFAULT 'user', CHECK IN (admin, manager, user) | Authorization role |
| department | TEXT | | Organization dept |
| phone | TEXT | | Contact number |
| avatar_url | TEXT | | Profile picture URL |
| is_active | BOOLEAN | DEFAULT true | Soft deactivation |
| created_at | TIMESTAMP | DEFAULT now() | UTC timezone |
| updated_at | TIMESTAMP | DEFAULT now() | Updated by trigger |

**Indexes:**
- `idx_users_email` on email
- `idx_users_role` on role

**Triggers:**
- `on_auth_user_created` - Auto-create user profile when auth user signs up
- `handle_updated_at` - Auto-update updated_at timestamp

---

### `public.letters`

Main document/letter table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| number | TEXT | UNIQUE, NOT NULL | Letter reference number |
| date_received | DATE | NOT NULL | When letter was received |
| sender | TEXT | NOT NULL | Organization/person name |
| sender_address | TEXT | | Full address |
| phone_number | TEXT | | Contact number |
| email | TEXT | | Contact email |
| subject | TEXT | NOT NULL | Letter subject line |
| content | TEXT | | Full letter content |
| classification | TEXT | DEFAULT 'umum', CHECK IN (umum, penting, rahasia) | Security level |
| status | TEXT | DEFAULT 'baru', CHECK IN (baru, proses, selesai, arsip) | Workflow state |
| priority | TEXT | DEFAULT 'normal', CHECK IN (rendah, normal, tinggi) | Priority level |
| received_by_id | UUID | FK(users.id), nullable | Who received it |
| assigned_to_id | UUID | FK(users.id), nullable | Who is processing it |
| attachments | TEXT[] | | Array of file names/URLs |
| notes | TEXT | | Internal comments |
| created_by_id | UUID | NOT NULL, FK(users.id) | Who created record |
| created_at | TIMESTAMP | DEFAULT now(), NOT NULL | UTC timezone |
| updated_at | TIMESTAMP | DEFAULT now() | Auto-updated |
| deleted_at | TIMESTAMP | DEFAULT null | NULL = active, timestamp = deleted |

**Indexes:**
- `idx_letters_number` on number
- `idx_letters_status` on status
- `idx_letters_classification` on classification
- `idx_letters_created_by` on created_by_id
- `idx_letters_assigned_to` on assigned_to_id
- `idx_letters_created_at` on created_at DESC
- `idx_letters_deleted_at` on deleted_at WHERE deleted_at IS NULL

**Triggers:**
- `handle_updated_at_letters` - Auto-update updated_at
- `log_letter_changes` - Log all INSERT/UPDATE/DELETE to audit_logs

**Soft Delete Strategy:**
- `deleted_at = NULL` → Letter is active
- `deleted_at = <timestamp>` → Letter is deleted but recoverable

---

### `public.letter_counters`

Manages auto-incrementing letter numbers by year/month

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| year | INTEGER | NOT NULL | Gregorian year (e.g., 2024) |
| month | INTEGER | NOT NULL, CHECK 1-12 | Month 1-12 |
| counter | INTEGER | DEFAULT 0 | Current sequence number |
| prefix | TEXT | DEFAULT 'SRT' | Letter number prefix |
| created_by_id | UUID | NOT NULL, FK(users.id) | Who created this counter |
| created_at | TIMESTAMP | DEFAULT now() | UTC timezone |
| updated_at | TIMESTAMP | DEFAULT now() | Auto-updated |
| **Constraint** | **UNIQUE(year, month)** | | Only one counter per month |

**Indexes:**
- `idx_letter_counters_year_month` on (year, month)

**Triggers:**
- `handle_updated_at_letter_counters` - Auto-update updated_at

**Auto-Incrementing Example:**
- Counter at (2024, 01) with counter=0, prefix='SRT'
- Next letter number: SRT/001/01/2024 (counter++ → 1)
- Format: `{prefix}/{paddedCounter}/{paddedMonth}/{year}`

---

### `public.audit_logs`

Immutable audit trail of all changes

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | Auto-generated |
| table_name | VARCHAR | NOT NULL | Which table was changed |
| operation | TEXT | NOT NULL, CHECK IN (INSERT, UPDATE, DELETE) | What operation |
| record_id | UUID | NOT NULL | ID of changed record |
| old_values | JSONB | | Previous state (NULL for INSERT) |
| new_values | JSONB | | New state (NULL for DELETE) |
| changed_by_id | UUID | FK(users.id), nullable | Who made change |
| reason | TEXT | nullable | Why change was made |
| created_at | TIMESTAMP | DEFAULT now() | UTC timezone, immutable |

**Indexes:**
- `idx_audit_logs_table_name` on table_name
- `idx_audit_logs_record_id` on record_id
- `idx_audit_logs_changed_by` on changed_by_id
- `idx_audit_logs_created_at` on created_at DESC

**Auto-Populated By:**
- Trigger `log_letter_changes` fires on every INSERT/UPDATE/DELETE to letters table
- Captures before/after state in JSONB format

---

## Row Level Security (RLS) Policies

### Users Table Policies

| Policy | Effect | Condition |
|--------|--------|-----------|
| "Users can view own profile" | SELECT | auth.uid() = users.id |
| "Admins can view all users" | SELECT | user.role = 'admin' |
| "Users can update own profile" | UPDATE | auth.uid() = users.id |
| "Admins can update all users" | UPDATE | user.role = 'admin' |

### Letters Table Policies

| Policy | Effect | Condition | Notes |
|--------|--------|-----------|-------|
| "Users can view own letters" | SELECT | created_by_id = auth.uid() | Can see own creations |
| "Users can view assigned letters" | SELECT | assigned_to_id = auth.uid() | Can see assigned work |
| "Admins and managers can view all" | SELECT | role IN ('admin', 'manager') | Full visibility |
| "Users can create letters" | INSERT | created_by_id = auth.uid() AND user.is_active = true | Must be active |
| "Users can update own letters" | UPDATE | (created_by_id = auth.uid() OR assigned_to_id = auth.uid()) AND user.is_active = true | Can update own/assigned |
| "Admins can update all letters" | UPDATE | role = 'admin' | Full edit access |
| "Users can delete own letters" | DELETE | created_by_id = auth.uid() AND deleted_at IS NULL | Soft delete only |
| "Admins can delete all letters" | DELETE | role = 'admin' | Hard delete access |

### Letter Counters Table Policies

| Policy | Effect | Condition |
|--------|--------|-----------|
| "Users can view letter counters" | SELECT | true (all authenticated users) |
| "Users can create letter counters" | INSERT | created_by_id = auth.uid() AND user.is_active = true |
| "Users can update own counters" | UPDATE | created_by_id = auth.uid() |

### Audit Logs Table Policies

| Policy | Effect | Condition |
|--------|--------|-----------|
| "Users can view audit logs" | SELECT | true (all authenticated users) |
| "Users can create audit logs" | INSERT | user.is_active = true (via triggers only) |

---

## Common Queries

### Get all active letters visible to user
```sql
SELECT * FROM public.letters 
WHERE deleted_at IS NULL
  AND (created_by_id = auth.uid() 
       OR assigned_to_id = auth.uid()
       OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'manager'))
ORDER BY created_at DESC;
```

### Get next letter number
```sql
-- Get or create counter for current month
SELECT * FROM public.letter_counters 
WHERE year = 2024 AND month = 1;

-- Increment and format
UPDATE public.letter_counters 
SET counter = counter + 1 
WHERE year = 2024 AND month = 1
RETURNING counter;
-- Format as: SRT/001/01/2024
```

### Get audit trail for a letter
```sql
SELECT * FROM public.audit_logs 
WHERE table_name = 'letters' 
  AND record_id = 'letter-uuid-here'
ORDER BY created_at DESC;
```

### Get users with admin role
```sql
SELECT * FROM public.users 
WHERE role = 'admin' AND is_active = true
ORDER BY full_name;
```

---

## Performance Considerations

✅ **Well-Indexed Queries:**
- Filtering by status: `idx_letters_status`
- Filtering by created_by: `idx_letters_created_by`
- Sorting by date: `idx_letters_created_at`
- Finding by number: `idx_letters_number`
- Soft delete checks: `idx_letters_deleted_at`

🔍 **Query Optimization Tips:**
1. Always filter by `deleted_at IS NULL` when querying letters
2. Use pagination for large result sets
3. Select specific columns instead of `SELECT *`
4. Consider caching frequent queries client-side
5. Monitor query performance in Supabase Dashboard > Logs

⚠️ **RLS Performance Note:**
- RLS policies add extra checks to every query
- Policies with subqueries (like role checks) impact performance
- Consider caching user role in application layer if needed

---

## Data Integrity Constraints

✓ **Foreign Key Constraints:**
- Users exist before letters can reference them
- Deleting user sets referencing letters to NULL (on delete set null for received_by)
- Deleting user prevents deletion if letters exist (on delete restrict for created_by)

✓ **Unique Constraints:**
- Letter numbers must be globally unique
- One counter per (year, month) combination
- Email is unique in users table

✓ **Check Constraints:**
- Classification ∈ {umum, penting, rahasia}
- Status ∈ {baru, proses, selesai, arsip}
- Priority ∈ {rendah, normal, tinggi}
- Month ∈ {1..12}
- Role ∈ {admin, manager, user}

---

## Related Documentation

- **Database Setup**: `DATABASE_SETUP.md` - How to run migrations
- **Integration Guide**: `INTEGRATION_GUIDE.md` - How to use in code
- **Setup Checklist**: `SETUP_CHECKLIST.md` - Step-by-step setup

