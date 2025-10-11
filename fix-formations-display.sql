-- Fix formations display issue by ensuring existing formations have partner_id values
-- This script will help populate partner_id for existing formations

-- Option 1: If you want to assign all existing formations (without partner_id) to a specific partner
-- Replace 'YOUR_PARTNER_UUID_HERE' with an actual partner UUID from your partners table
-- UPDATE formations SET partner_id = 'YOUR_PARTNER_UUID_HERE' WHERE partner_id IS NULL;

-- Option 2: Delete existing formations without partner_id and create new sample data with partner_id
-- This is useful if the old data is just test data
DELETE FROM formations WHERE partner_id IS NULL;

-- Option 3: Get the first partner's UUID and assign all formations to them (for testing)
-- Uncomment the following to use this approach:
-- DO $$
-- DECLARE
--   first_partner_id UUID;
-- BEGIN
--   SELECT id INTO first_partner_id FROM partners LIMIT 1;
--   IF first_partner_id IS NOT NULL THEN
--     UPDATE formations SET partner_id = first_partner_id WHERE partner_id IS NULL;
--   END IF;
-- END $$;

-- Option 4: Insert new sample formations with the current user's partner_id
-- Note: Run this after running one of the options above, or manually replace the partner_id
-- INSERT INTO formations (company_name, status, created_at, partner_id) VALUES
--   ('Acme Corporation', 'verified', NOW() - INTERVAL '2 days', auth.uid()),
--   ('Tech Innovations Ltd', 'pending', NOW() - INTERVAL '1 day', auth.uid()),
--   ('Global Solutions Inc', 'verified', NOW() - INTERVAL '3 days', auth.uid()),
--   ('StartupCo', 'failed', NOW() - INTERVAL '5 days', auth.uid()),
--   ('Enterprise Systems', 'pending', NOW() - INTERVAL '1 hour', auth.uid())
-- ON CONFLICT DO NOTHING;

-- Recommended: Use this query to check which formations exist and their partner_id status
SELECT 
  id,
  company_name,
  status,
  partner_id,
  created_at,
  CASE 
    WHEN partner_id IS NULL THEN 'Missing partner_id'
    ELSE 'Has partner_id'
  END as partner_status
FROM formations
ORDER BY created_at DESC;
