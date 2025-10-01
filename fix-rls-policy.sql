-- Fix RLS Policy for Partner Signup
-- Run this in your Supabase SQL Editor
-- This script only updates the INSERT policy for the partners table

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own partner profile" ON partners;

-- Create a simpler INSERT policy
-- Allow users to insert their own partner profile during signup
CREATE POLICY "Users can insert own partner profile" ON partners
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the policy was created
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'partners' AND cmd = 'INSERT';
