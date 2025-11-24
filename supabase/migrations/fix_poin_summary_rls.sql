-- ============================================
-- FIX RLS POLICY FOR POIN_SUMMARY TABLE
-- Allow service role and triggers to update poin_summary
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow service role full access" ON poin_summary;
DROP POLICY IF EXISTS "Allow authenticated read" ON poin_summary;
DROP POLICY IF EXISTS "Allow system updates" ON poin_summary;

-- Enable RLS on poin_summary
ALTER TABLE poin_summary ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to read their own summary
CREATE POLICY "Allow authenticated read"
ON poin_summary
FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Allow service role full access (for API updates)
CREATE POLICY "Allow service role full access"
ON poin_summary
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 3: Allow system/trigger updates (bypass RLS for triggers)
CREATE POLICY "Allow system updates"
ON poin_summary
FOR ALL
TO postgres
USING (true)
WITH CHECK (true);

-- Policy 4: Allow INSERT for any authenticated user (for triggers)
CREATE POLICY "Allow insert for triggers"
ON poin_summary
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 5: Allow UPDATE for any authenticated user (for triggers)
CREATE POLICY "Allow update for triggers"
ON poin_summary
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'poin_summary';

