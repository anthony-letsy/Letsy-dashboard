-- Comprehensive Fix for API Keys Table
-- Run this in Supabase SQL Editor

-- 1. First, check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'api_keys'
) as table_exists;

-- 2. Drop and recreate the api_keys table to ensure it's correct
DROP TABLE IF EXISTS api_keys CASCADE;

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

-- 3. Create indexes
CREATE INDEX idx_api_keys_partner_id ON api_keys(partner_id);
CREATE INDEX idx_api_keys_revoked ON api_keys(revoked);

-- 4. Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can insert own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON api_keys;

-- 6. Create RLS policies
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own API keys" ON api_keys
  FOR INSERT WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (partner_id = auth.uid());

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (partner_id = auth.uid());

-- 7. Grant permissions
GRANT ALL ON api_keys TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 8. Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- 9. Verify the table was created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'api_keys' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Verify RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'api_keys';
