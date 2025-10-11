-- ============================================
-- COPY AND PASTE THIS ENTIRE SCRIPT INTO SUPABASE SQL EDITOR
-- ============================================

-- Step 1: Check current state
SELECT 'Step 1: Checking formations...' as step;
SELECT id, company_name, status, partner_id FROM formations LIMIT 10;

-- Step 2: Check partners
SELECT 'Step 2: Checking partners...' as step;
SELECT id, email, company_name FROM partners;

-- Step 3: Assign all formations to the first partner
DO $$
DECLARE
  first_partner_id UUID;
  affected_rows INT;
BEGIN
  -- Get the first partner's ID
  SELECT id INTO first_partner_id FROM partners ORDER BY created_at LIMIT 1;
  
  IF first_partner_id IS NOT NULL THEN
    -- Update all formations without a partner_id
    UPDATE formations 
    SET partner_id = first_partner_id 
    WHERE partner_id IS NULL;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RAISE NOTICE 'Updated % formations with partner_id: %', affected_rows, first_partner_id;
  ELSE
    RAISE NOTICE 'ERROR: No partners found in the database!';
  END IF;
END $$;

-- Step 4: Verify the fix
SELECT 'Step 4: Verifying fix...' as step;
SELECT 
  id, 
  company_name, 
  status, 
  partner_id,
  CASE 
    WHEN partner_id IS NULL THEN '❌ MISSING'
    ELSE '✅ HAS PARTNER'
  END as status_check
FROM formations 
ORDER BY created_at DESC;

-- Step 5: Count formations by partner
SELECT 'Step 5: Count by partner...' as step;
SELECT 
  p.email,
  p.company_name,
  COUNT(f.id) as formation_count
FROM partners p
LEFT JOIN formations f ON f.partner_id = p.id
GROUP BY p.id, p.email, p.company_name;
