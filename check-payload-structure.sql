-- Check the actual content of the payload field in companies table
SELECT 'Sample companies with payload content:' as info;
SELECT 
    id,
    status,
    payload,
    created_at
FROM companies
LIMIT 3;

-- If payload is JSONB, we can check its keys
SELECT 'Payload keys (if JSONB):' as info;
SELECT DISTINCT jsonb_object_keys(payload) as payload_keys
FROM companies
WHERE payload IS NOT NULL;
