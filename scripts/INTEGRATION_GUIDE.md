# Yanti App - Supabase Integration Guide

## Overview

This guide shows how to integrate Supabase into the Yanti App. After running the database migrations, follow these steps to replace Firebase with Supabase.

## Step 1: Install Supabase Client

The project should already have `@supabase/supabase-js` installed. If not:

```bash
npm install @supabase/supabase-js
```

## Step 2: Create Supabase Client Library

Create `/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations requiring admin access
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceRoleKey)
```

## Step 3: Replace Firebase Auth with Supabase Auth

Replace `/src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already authenticated on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## Step 4: Create Data Query Functions

Create `/src/lib/queries/letters.ts`:

```typescript
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Letter = Database['public']['Tables']['letters']['Row']

// Get all letters visible to current user (respects RLS)
export async function getLetters() {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Letter[]
}

// Get single letter by ID
export async function getLetterById(id: string) {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Letter
}

// Create new letter
export async function createLetter(letter: Omit<Letter, 'id' | 'created_at' | 'updated_at'>) {
  const { data: userData } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('letters')
    .insert({
      ...letter,
      created_by_id: userData.user!.id,
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Letter
}

// Update letter
export async function updateLetter(id: string, updates: Partial<Letter>) {
  const { data, error } = await supabase
    .from('letters')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Letter
}

// Soft delete letter
export async function deleteLetter(id: string) {
  return updateLetter(id, {
    deleted_at: new Date().toISOString(),
  })
}

// Get letter counters
export async function getLetterCounters(year: number, month: number) {
  const { data, error } = await supabase
    .from('letter_counters')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Increment letter counter
export async function getNextLetterNumber(
  year: number,
  month: number,
  prefix: string = 'SRT'
) {
  const { data: userData } = await supabase.auth.getUser()
  
  // Get or create counter
  let counter = await getLetterCounters(year, month)
  
  if (!counter) {
    const { data, error } = await supabase
      .from('letter_counters')
      .insert({
        year,
        month,
        counter: 0,
        prefix,
        created_by_id: userData.user!.id,
      })
      .select()
      .single()
    
    if (error) throw error
    counter = data
  }
  
  // Increment counter
  const newCounter = counter.counter + 1
  await supabase
    .from('letter_counters')
    .update({ counter: newCounter })
    .eq('id', counter.id)
  
  // Format letter number: SRT/001/02/2024
  const paddedNumber = String(newCounter).padStart(3, '0')
  const paddedMonth = String(month).padStart(2, '0')
  return `${prefix}/${paddedNumber}/${paddedMonth}/${year}`
}
```

## Step 5: Update Components to Use Supabase

### Example: Update LetterForm.tsx

```typescript
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createLetter, getNextLetterNumber } from '@/lib/queries/letters'

export function LetterForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    sender: '',
    subject: '',
    content: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('User not authenticated')

      // Get auto-generated letter number
      const now = new Date()
      const letterNumber = await getNextLetterNumber(
        now.getFullYear(),
        now.getMonth() + 1
      )

      // Create letter in database
      await createLetter({
        number: letterNumber,
        date_received: new Date().toISOString().split('T')[0],
        sender: formData.sender,
        subject: formData.subject,
        content: formData.content,
        status: 'baru',
        classification: 'umum',
        priority: 'normal',
        created_by_id: user.id,
      })

      setFormData({ sender: '', subject: '', content: '' })
      // Show success message or redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields here */}
    </form>
  )
}
```

### Example: Update LetterList.tsx

```typescript
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getLetters } from '@/lib/queries/letters'
import type { Database } from '@/lib/database.types'

type Letter = Database['public']['Tables']['letters']['Row']

export function LetterList() {
  const { user } = useAuth()
  const [letters, setLetters] = useState<Letter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadLetters = async () => {
      try {
        const data = await getLetters()
        setLetters(data)
      } catch (err) {
        console.error('Failed to load letters:', err)
      } finally {
        setLoading(false)
      }
    }

    loadLetters()
  }, [user])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {letters.map(letter => (
        <div key={letter.id}>
          <h3>{letter.number}</h3>
          <p>{letter.subject}</p>
          <p>From: {letter.sender}</p>
        </div>
      ))}
    </div>
  )
}
```

## Step 6: Update Layout with AuthProvider

In `/src/app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

## Step 7: Update Login Page

In `/src/app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

## Step 8: Setup TypeScript Types (Optional but Recommended)

Generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

This creates type definitions for all your tables and functions.

## Environment Variables

Make sure these are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from: Supabase Dashboard > Settings > API

## Testing

### Test Auth Flow:
1. Go to login page
2. Sign in with a test user
3. Should redirect to dashboard
4. User session persists on page reload

### Test Data Access:
1. Create a letter as User A
2. Sign out and sign in as User B
3. User B should NOT see User A's letter (RLS policy working)

### Test Admin Access:
1. Sign in as admin user
2. Should be able to see all letters

## Next Steps

- [ ] Replace all Firebase imports with Supabase
- [ ] Update all data fetching to use new query functions
- [ ] Test RLS policies with different user roles
- [ ] Add error handling and loading states
- [ ] Implement real-time subscriptions if needed
- [ ] Add offline support with localStorage cache

## Common Issues

**"RLS policy with check violation"**
- Ensure user is authenticated
- Check user's role in database
- Verify RLS policies are correct

**"Auth session not persisting"**
- Clear browser cookies/localStorage
- Check `AuthProvider` wraps entire app
- Verify auth state change listener is working

**"Cannot insert data"**
- Check `created_by_id` is set to current user's ID
- Ensure user exists in public.users table
- Verify user is_active is true

---

For more help: https://supabase.com/docs
