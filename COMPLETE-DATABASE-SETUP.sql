-- COMPLETE DATABASE SETUP FOR LETSY DASHBOARD
-- Run this ENTIRE script in Supabase SQL Editor
-- This will set up all tables, policies, and permissions from scratch

-- ============================================
-- 1. DROP EXISTING TABLES (if any)
-- ============================================
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS formations CASCADE;
DROP TABLE IF EXISTS partners CASCADE;

-- ============================================
-- 2. CREATE PARTNERS TABLE
-- ============================================
CREATE TABLE partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. CREATE API_KEYS TABLE
-- ============================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  key_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 4. CREATE FORMATIONS TABLE
-- ============================================
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. CREATE INDEXES
-- ============================================
CREATE INDEX idx_api_keys_partner_id ON api_keys(partner_id);
CREATE INDEX idx_api_keys_revoked ON api_keys(revoked);
CREATE INDEX idx_formations_status ON formations(status);
CREATE INDEX idx_formations_created_at ON formations(created_at DESC);

-- ============================================
-- 6. INSERT SAMPLE DATA
-- ============================================
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
  ('NextGen Company', 'pending', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. CREATE RLS POLICIES FOR PARTNERS
-- ============================================
CREATE POLICY "Users can view own partner profile" ON partners
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own partner profile" ON partners
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own partner profile" ON partners
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 9. CREATE RLS POLICIES FOR API_KEYS
-- ============================================
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own API keys" ON api_keys
  FOR INSERT WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (partner_id = auth.uid());

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (partner_id = auth.uid());

-- ============================================
-- 10. CREATE RLS POLICIES FOR FORMATIONS
-- ============================================
CREATE POLICY "Authenticated users can view formations" ON formations
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- 11. GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON partners TO authenticated;
GRANT ALL ON api_keys TO authenticated;
GRANT SELECT ON formations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- 12. RELOAD SCHEMA CACHE
-- ============================================
NOTIFY pgrst, 'reload schema';

-- ============================================
-- 13. VERIFY SETUP
-- ============================================
-- Check partners table
SELECT 'Partners table:' as info;
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'partners' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check api_keys table
SELECT 'API Keys table:' as info;
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'api_keys' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check formations table
SELECT 'Formations table:' as info;
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'formations' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show all policies
SELECT 'All RLS Policies:' as info;
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

SELECT '✅ Database setup complete!' as status;
