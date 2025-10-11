-- ============================================
-- DATABASE INVESTIGATION SCRIPT
-- Run this in Supabase SQL Editor to understand your schema
-- ============================================

-- Check if both tables exist
SELECT 'Checking which tables exist...' as step;

SELECT 
    table_name,
    CASE 
        WHEN table_name = 'formations' THEN '✅ FORMATIONS table exists'
        WHEN table_name = 'companies' THEN '✅ COMPANIES table exists'
        ELSE table_name
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('formations', 'companies', 'partners', 'api_keys')
ORDER BY table_name;

-- Check formations table structure
SELECT 'FORMATIONS table structure:' as step;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'formations'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check companies table structure (if it exists)
SELECT 'COMPANIES table structure:' as step;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'companies'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Count records in formations
SELECT 'Count of formations:' as step;
SELECT 
    COUNT(*) as total_formations,
    COUNT(CASE WHEN partner_id IS NOT NULL THEN 1 END) as with_partner_id,
    COUNT(CASE WHEN partner_id IS NULL THEN 1 END) as without_partner_id
FROM formations;

-- Sample formations data
SELECT 'Sample FORMATIONS data:' as step;
SELECT * FROM formations LIMIT 5;

-- Count records in companies (if table exists)
SELECT 'Count of companies:' as step;
SELECT COUNT(*) as total_companies FROM companies;

-- Sample companies data (if table exists)
SELECT 'Sample COMPANIES data:' as step;
SELECT * FROM companies LIMIT 5;

-- Check RLS policies on formations
SELECT 'FORMATIONS RLS policies:' as step;
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
WHERE tablename = 'formations';

-- Check RLS policies on companies (if exists)
SELECT 'COMPANIES RLS policies:' as step;
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
WHERE tablename = 'companies';

-- Check your current user and partner record
SELECT 'Your current user info:' as step;
SELECT 
    auth.uid() as your_user_id,
    auth.email() as your_email;

SELECT 'Your partner record:' as step;
SELECT * FROM partners WHERE id = auth.uid();

-- Check if formations are linked to your partner
SELECT 'Your formations (if any):' as step;
SELECT * FROM formations WHERE partner_id = auth.uid();

-- Check if companies are linked to your partner (if companies table has partner_id)
SELECT 'Your companies (if any):' as step;
SELECT * FROM companies WHERE partner_id = auth.uid();
