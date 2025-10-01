-- Add partner_id to formations table to link formations to specific partners
-- This allows partners to only see their own formations

-- Add partner_id column
ALTER TABLE formations ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES partners(id) ON DELETE CASCADE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_formations_partner_id ON formations(partner_id);

-- Update RLS policies for formations table
DROP POLICY IF EXISTS "Authenticated users can view formations" ON formations;
DROP POLICY IF EXISTS "Partners can view own formations" ON formations;

-- Partners can only view their own formations
CREATE POLICY "Partners can view own formations" ON formations
  FOR SELECT USING (partner_id = auth.uid());

-- Partners can insert their own formations
CREATE POLICY "Partners can insert own formations" ON formations
  FOR INSERT WITH CHECK (partner_id = auth.uid());

-- Note: Existing formations in the database don't have a partner_id yet.
-- You may want to assign them to a specific partner or delete them.
-- Example to assign to a specific partner:
-- UPDATE formations SET partner_id = 'your-partner-uuid-here' WHERE partner_id IS NULL;
