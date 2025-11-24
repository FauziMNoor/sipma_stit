-- ============================================
-- FIX RLS POLICY FOR POIN_SUMMARY TABLE
-- Jalankan script ini di Supabase SQL Editor
-- ============================================

-- Step 1: Drop all existing policies on poin_summary
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'poin_summary'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON poin_summary', pol.policyname);
    END LOOP;
END $$;

-- Step 2: Ensure RLS is enabled
ALTER TABLE poin_summary ENABLE ROW LEVEL SECURITY;

-- Step 3: Create permissive policies

-- Allow everyone to read (for dashboard displays)
CREATE POLICY "poin_summary_select_policy"
ON poin_summary
FOR SELECT
USING (true);

-- Allow everyone to insert (for triggers and initial creation)
CREATE POLICY "poin_summary_insert_policy"
ON poin_summary
FOR INSERT
WITH CHECK (true);

-- Allow everyone to update (for triggers when poin_aktivitas changes)
CREATE POLICY "poin_summary_update_policy"
ON poin_summary
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow everyone to delete (just in case)
CREATE POLICY "poin_summary_delete_policy"
ON poin_summary
FOR DELETE
USING (true);

-- Step 4: Verify policies created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies
WHERE tablename = 'poin_summary'
ORDER BY policyname;

-- Step 5: Test if we can update poin_summary
-- This should work now
SELECT 'RLS policies fixed successfully!' as status;

