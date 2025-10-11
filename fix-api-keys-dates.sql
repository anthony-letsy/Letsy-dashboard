-- Fix API keys created_at column

-- Step 1: Update existing NULL created_at values to current timestamp
UPDATE api_keys 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- Step 2: Ensure the column has a default value for future inserts
ALTER TABLE api_keys 
ALTER COLUMN created_at SET DEFAULT NOW();

-- Step 3: Make created_at NOT NULL to prevent this issue in future
ALTER TABLE api_keys 
ALTER COLUMN created_at SET NOT NULL;

-- Verify the fix
SELECT 'Updated API keys:' as info;
SELECT id, name, created_at, revoked FROM api_keys ORDER BY created_at DESC;
