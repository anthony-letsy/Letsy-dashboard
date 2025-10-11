-- Reload Schema Cache for API Keys Table
-- Run this in Supabase SQL Editor to fix "Could not find the table 'public.api_keys' in the schema cache"

-- Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify api_keys table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'api_keys' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies on api_keys
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'api_keys';

-- Verify grants
SELECT 
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'api_keys'
AND table_schema = 'public';
