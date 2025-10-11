-- Check the exact column names in the companies table
SELECT 'Companies table columns:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'companies'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check sample data to see actual column values
SELECT 'Sample companies data with all columns:' as info;
SELECT * FROM companies LIMIT 3;

-- Check specifically what columns exist
SELECT 'Column names list:' as info;
SELECT array_agg(column_name ORDER BY ordinal_position) as all_columns
FROM information_schema.columns
WHERE table_name = 'companies'
  AND table_schema = 'public';
