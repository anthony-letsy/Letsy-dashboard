-- Quick Schema Cache Reload
-- Run this in Supabase SQL Editor after running database-setup.sql

-- Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the partners table exists and has the correct columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'partners' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'partners';

-- Verify grants
SELECT 
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'partners'
AND table_schema = 'public';
