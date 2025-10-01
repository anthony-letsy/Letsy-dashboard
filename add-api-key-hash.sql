-- Add key_hash column to api_keys table for secure API authentication
-- This allows the API to verify keys without storing plain text keys

-- Ensure id column has default UUID generation (in case it's missing)
ALTER TABLE api_keys ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add key_hash column
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS key_hash TEXT;

-- Create an index on key_hash for faster lookups during API authentication
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- Update the RLS policy to allow service role access for API authentication
-- This policy allows the API (using service role key) to read api_keys for authentication
DROP POLICY IF EXISTS "Service role can read api_keys for authentication" ON api_keys;
CREATE POLICY "Service role can read api_keys for authentication" ON api_keys
  FOR SELECT USING (true);

-- Note: The 'key' column will be removed in a future migration once all keys are migrated
-- For now, we'll keep both columns during the transition period
