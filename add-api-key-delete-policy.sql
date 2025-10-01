-- Add DELETE policy for api_keys table
-- This allows users to delete their own API keys

CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (partner_id = auth.uid());
