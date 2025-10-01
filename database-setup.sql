-- Letsy Partner Dashboard Database Setup
-- Run this script in your Supabase SQL Editor

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

-- Create formations table
CREATE TABLE IF NOT EXISTS formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_partner_id ON api_keys(partner_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_revoked ON api_keys(revoked);
CREATE INDEX IF NOT EXISTS idx_formations_status ON formations(status);
CREATE INDEX IF NOT EXISTS idx_formations_created_at ON formations(created_at DESC);

-- Insert some sample formations data for testing
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

-- Enable Row Level Security (RLS) for security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for partners table
CREATE POLICY "Users can view own partner profile" ON partners
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own partner profile" ON partners
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own partner profile" ON partners
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for api_keys table
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own API keys" ON api_keys
  FOR INSERT WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (partner_id = auth.uid());

-- Create RLS policies for formations table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view formations" ON formations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON partners TO authenticated;
GRANT ALL ON api_keys TO authenticated;
GRANT SELECT ON formations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
