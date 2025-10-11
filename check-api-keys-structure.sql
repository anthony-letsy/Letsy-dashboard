-- Check api_keys table structure and sample data
SELECT 'API Keys table structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'api_keys'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check sample api_keys data
SELECT 'Sample API keys data:' as info;
SELECT 
    id,
    name,
    created_at,
    revoked,
    partner_id
FROM api_keys
LIMIT 3;
