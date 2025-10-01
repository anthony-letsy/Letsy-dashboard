-- Fix Signup with Database Trigger
-- This creates a trigger that automatically creates a partner profile when a user signs up
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing INSERT policy (we'll use a trigger instead for signup)
DROP POLICY IF EXISTS "Users can insert own partner profile" ON partners;

-- Step 2: Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.partners (id, email, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Unnamed Company')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create a trigger that fires when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Create a more permissive INSERT policy for manual operations (admin/service role)
CREATE POLICY "Service can insert partner profiles" ON partners
  FOR INSERT 
  WITH CHECK (true);

-- Step 5: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON partners TO service_role;

-- Step 6: Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Step 7: Verify the trigger was created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
