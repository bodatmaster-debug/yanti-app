-- ============================================================================
-- YANTI APP - Row Level Security (RLS) Policies
-- ============================================================================
-- Implements secure access control so users can only see their own data

-- ============================================================================
-- RLS Policies for users table
-- ============================================================================

-- Allow users to see their own profile
create policy "Users can view own profile"
  on public.users for select
  to authenticated
  using (auth.uid() = id);

-- Allow users to see other users in their organization (admin only can see all)
create policy "Admins can view all users"
  on public.users for select
  to authenticated
  using (
    auth.uid() = id or 
    (select role from public.users where id = auth.uid()) = 'admin'
  );

-- Allow users to update their own profile
create policy "Users can update own profile"
  on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow admins to update any user profile
create policy "Admins can update all users"
  on public.users for update
  to authenticated
  using ((select role from public.users where id = auth.uid()) = 'admin')
  with check ((select role from public.users where id = auth.uid()) = 'admin');

-- ============================================================================
-- RLS Policies for letters table
-- ============================================================================

-- Allow users to view letters they created
create policy "Users can view own letters"
  on public.letters for select
  to authenticated
  using (created_by_id = auth.uid());

-- Allow users to view letters assigned to them
create policy "Users can view assigned letters"
  on public.letters for select
  to authenticated
  using (assigned_to_id = auth.uid());

-- Allow admins and managers to view all letters
create policy "Admins and managers can view all letters"
  on public.letters for select
  to authenticated
  using (
    (select role from public.users where id = auth.uid()) in ('admin', 'manager')
  );

-- Allow authenticated users to insert letters
create policy "Users can create letters"
  on public.letters for insert
  to authenticated
  with check (
    auth.uid() = created_by_id and
    (select is_active from public.users where id = auth.uid()) = true
  );

-- Allow users to update letters they created or are assigned to
create policy "Users can update own letters"
  on public.letters for update
  to authenticated
  using (
    created_by_id = auth.uid() or
    assigned_to_id = auth.uid()
  )
  with check (
    (select is_active from public.users where id = auth.uid()) = true
  );

-- Allow admins to update any letter
create policy "Admins can update all letters"
  on public.letters for update
  to authenticated
  using (
    (select role from public.users where id = auth.uid()) = 'admin'
  )
  with check (
    (select role from public.users where id = auth.uid()) = 'admin'
  );

-- Allow users to soft delete letters they created
create policy "Users can delete own letters"
  on public.letters for delete
  to authenticated
  using (
    created_by_id = auth.uid() and
    deleted_at is null
  );

-- Allow admins to hard delete any letter
create policy "Admins can delete all letters"
  on public.letters for delete
  to authenticated
  using (
    (select role from public.users where id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- RLS Policies for letter_counters table
-- ============================================================================

-- Allow all authenticated users to view counters
create policy "Users can view letter counters"
  on public.letter_counters for select
  to authenticated
  using (true);

-- Allow authenticated users to insert counters
create policy "Users can create letter counters"
  on public.letter_counters for insert
  to authenticated
  with check (
    auth.uid() = created_by_id and
    (select is_active from public.users where id = auth.uid()) = true
  );

-- Allow users to update counters they created
create policy "Users can update own counters"
  on public.letter_counters for update
  to authenticated
  using (created_by_id = auth.uid())
  with check (created_by_id = auth.uid());

-- ============================================================================
-- RLS Policies for audit_logs table
-- ============================================================================

-- Allow all authenticated users to view audit logs
create policy "Users can view audit logs"
  on public.audit_logs for select
  to authenticated
  using (true);

-- Allow authenticated users to insert audit logs (via trigger only)
create policy "Users can create audit logs"
  on public.audit_logs for insert
  to authenticated
  with check (
    (select is_active from public.users where id = auth.uid()) = true
  );

select 'RLS policies configured successfully!' as status;
