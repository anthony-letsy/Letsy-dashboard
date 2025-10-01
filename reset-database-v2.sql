-- Complete Database Reset Script for Letsy Partner Dashboard (v2)
-- This version fixes the RLS policy issue during signup
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing policies first (to avoid FK constraint issues)
DROP POLICY IF EXISTS "Users can view own partner profile" ON partners;
DROP POLICY IF EXISTS "Users can update own partner profile" ON partners;
DROP POLICY IF EXISTS "Users can insert own partner profile" ON partners;
DROP POLICY IF EXISTS "Service role can insert partner profiles" ON partners;
DROP POLICY IF EXISTS "Users can view own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can insert own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON api_keys;
DROP POLICY IF EXISTS "Authenticated users can view formations" ON formations;

-- Step 2: Drop all tables in the correct order (respecting foreign keys)
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS formations CASCADE;

-- Step 3: Create partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create api_keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

-- Step 5: Create formations table
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create indexes for better performance
CREATE INDEX idx_api_keys_partner_id ON api_keys(partner_id);
CREATE INDEX idx_api_keys_revoked ON api_keys(revoked);
CREATE INDEX idx_formations_status ON formations(status);
CREATE INDEX idx_formations_created_at ON formations(created_at DESC);

-- Step 7: Insert sample formations data for testing
INSERT INTO formations (company_name, status, created_at) VALUES
  ('Acme Corporation', 'verified', NOW() - INTERVAL '2 days'),
  ('Tech Innovations Ltd', 'pending', NOW() - INTERVAL '1 day'),
  ('Global Solutions Inc', 'verified', NOW() - INTERVAL '3 days'),
  ('StartupCo', 'failed', NOW() - INTERVAL '5 days'),
  ('Enterprise Systems', 'pending', NOW() - INTERVAL '1 hour'),
  ('Digital Ventures', 'verified', NOW() - INTERVAL '1 week'),
  ('Future Tech LLC', 'pending', NOW() - INTERVAL '3 hours'),
  ('Innovation Labs', 'verified', NOW() - INTERVAL '2 weeks'),
  ('Smart Solutions', 'failed', NOW() - INTERVAL '4 days'),
  ('NextGen Company', 'pending', NOW() - INTERVAL '6 hours');

-- Step 8: Enable Row Level Security (RLS) for security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies for partners table
-- Allow users to view their own profile
CREATE POLICY "Users can view own partner profile" ON partners
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own partner profile" ON partners
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile during signup
-- This policy allows inserts where the user's auth.uid() matches the id being inserted,
-- OR where the inserting user's JWT role is 'authenticated' and they're creating a record with their own ID
CREATE POLICY "Users can insert own partner profile" ON partners
  FOR INSERT WITH CHECK (
    id IN (SELECT id FROM auth.users WHERE id = auth.uid())
  );

-- Step 10: Create RLS policies for api_keys table
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own API keys" ON api_keys
  FOR INSERT WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (partner_id = auth.uid());

-- Step 11: Create RLS policies for formations table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view formations" ON formations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 12: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON partners TO authenticated;
GRANT ALL ON api_keys TO authenticated;
GRANT SELECT ON formations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 13: Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Step 14: Verify the partners table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'partners' 
AND table_schema = 'public'
ORDER BY ordinal_position;
