-- Quick fix for formations display issue
-- This script assigns existing formations to all current partners

-- Step 1: Get the current logged-in user's partner record and assign formations to them
-- Run this in Supabase SQL Editor while logged in to your dashboard

-- First, let's check what we have
SELECT 'Current formations status:' as info;
SELECT id, company_name, status, partner_id FROM formations;

SELECT 'Current partners:' as info;
SELECT id, email, company_name FROM partners;

-- Step 2: Assign all formations without partner_id to the first partner (for testing)
-- If you want to assign to a specific partner, replace the WHERE clause
DO $$
DECLARE
  first_partner_id UUID;
BEGIN
  -- Get the first partner's ID
  SELECT id INTO first_partner_id FROM partners ORDER BY created_at LIMIT 1;
  
  IF first_partner_id IS NOT NULL THEN
    -- Update all formations without a partner_id
    UPDATE formations 
    SET partner_id = first_partner_id 
    WHERE partner_id IS NULL;
    
    RAISE NOTICE 'Updated formations with partner_id: %', first_partner_id;
  ELSE
    RAISE NOTICE 'No partners found in the database';
  END IF;
END $$;

-- Verify the fix
SELECT 'Updated formations:' as info;
SELECT id, company_name, status, partner_id FROM formations;
