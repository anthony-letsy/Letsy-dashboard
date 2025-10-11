-- Create Partner Records for Existing Users
-- Run this in Supabase SQL Editor

-- This script creates partner records for any users who signed up before the partners table was created

-- Insert partner records for existing users who don't have one yet
INSERT INTO partners (id, email, company_name, created_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'company_name', 'My Company') as company_name,
    au.created_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM partners p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Create a trigger to automatically create partner records for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.partners (id, email, company_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company'),
    NEW.created_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify partner records
SELECT 
    'Total users:' as info,
    COUNT(*) as count
FROM auth.users;

SELECT 
    'Total partners:' as info,
    COUNT(*) as count
FROM partners;

SELECT 
    'Partners created:' as info,
    p.id,
    p.email,
    p.company_name,
    p.created_at
FROM partners p
ORDER BY p.created_at DESC;

SELECT '✅ Partner records created and trigger set up!' as status;
