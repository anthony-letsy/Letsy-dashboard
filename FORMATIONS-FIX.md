# Formations Tab Fix

## Problem
The formations tab is not showing any formations data.

## Root Cause
The issue occurs because:

1. The original `database-setup.sql` created the `formations` table WITHOUT a `partner_id` column
2. Sample formation data was inserted without `partner_id` values
3. Later, `add-partner-to-formations.sql` was run which:
   - Added the `partner_id` column to the formations table
   - Changed the RLS (Row Level Security) policy to: `partner_id = auth.uid()`
4. Since existing formations have `NULL` for `partner_id`, they don't match any user's `auth.uid()`, so they are filtered out by the RLS policy

## Solution

You need to assign `partner_id` values to existing formations. Choose one of these approaches:

### Option 1: Quick Fix (Recommended for Testing)
Run the `fix-formations-quick.sql` script in your Supabase SQL Editor:

```bash
# Copy the content from fix-formations-quick.sql and run it in Supabase
```

This will:
- Show you the current state of formations and partners
- Assign all formations without a `partner_id` to the first partner in your database
- Verify the fix was applied

### Option 2: Manual Assignment
If you want to assign formations to a specific partner:

1. Get your partner UUID from Supabase:
```sql
SELECT id, email, company_name FROM partners;
```

2. Update formations with your partner UUID:
```sql
UPDATE formations 
SET partner_id = 'YOUR_PARTNER_UUID_HERE' 
WHERE partner_id IS NULL;
```

### Option 3: Delete and Recreate
If the existing data is just test data, you can delete it and create new formations:

```sql
-- Delete old formations
DELETE FROM formations WHERE partner_id IS NULL;

-- Insert new sample data with your partner_id
INSERT INTO formations (company_name, status, partner_id) VALUES
  ('Acme Corporation', 'verified', 'YOUR_PARTNER_UUID_HERE'),
  ('Tech Innovations Ltd', 'pending', 'YOUR_PARTNER_UUID_HERE'),
  ('Global Solutions Inc', 'verified', 'YOUR_PARTNER_UUID_HERE');
```

## Verification

After applying the fix, verify it worked:

1. Run this query in Supabase:
```sql
SELECT id, company_name, status, partner_id 
FROM formations 
WHERE partner_id IS NOT NULL;
```

2. Refresh your dashboard and check the Formations tab

## Prevention

For future formations:
- Always include `partner_id` when inserting new formations
- The RLS policy will enforce this: `CREATE POLICY "Partners can insert own formations" ON formations FOR INSERT WITH CHECK (partner_id = auth.uid());`

## Technical Details

**Current RLS Policy:**
```sql
CREATE POLICY "Partners can view own formations" ON formations
  FOR SELECT USING (partner_id = auth.uid());
```

This policy ensures users only see formations where `partner_id` matches their user ID. Formations with `NULL` partner_id won't be visible to anyone.
