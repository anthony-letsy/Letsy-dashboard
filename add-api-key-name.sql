-- Add name field to api_keys table
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing keys to have a default name
UPDATE api_keys 
SET name = 'API Key ' || SUBSTRING(key FROM 1 FOR 8) || '...'
WHERE name IS NULL;

-- Make name NOT NULL after setting defaults
ALTER TABLE api_keys ALTER COLUMN name SET NOT NULL;
