-- Check what's inside the company field of the payload
SELECT 'Company field structure:' as info;
SELECT 
    payload->'company' as company_data
FROM companies
LIMIT 1;

-- Check all keys inside the company object
SELECT 'Keys inside company object:' as info;
SELECT DISTINCT jsonb_object_keys(payload->'company') as company_keys
FROM companies
WHERE payload->'company' IS NOT NULL
LIMIT 10;
