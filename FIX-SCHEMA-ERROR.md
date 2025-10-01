# Database Setup and Signup Fix

## Issues Fixed
1. ✅ PostgreSQL syntax error with `IF NOT EXISTS` in CREATE POLICY statements
2. ✅ Schema cache not recognizing the `company_name` column
3. ✅ RLS policy preventing partner profile creation during signup

## RECOMMENDED SOLUTION: Database Trigger Approach

The best solution uses a database trigger to automatically create partner profiles when users sign up. This bypasses RLS policy issues and ensures data consistency.

### Step 1: Run the Trigger Setup Script
1. Go to your Supabase Dashboard (https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Open the `fix-signup-with-trigger.sql` file from your project
5. Copy and paste the entire contents into the SQL Editor
6. Click **Run** to execute the script

**This script will:**
- Create a database function that handles new user signups
- Set up a trigger that automatically creates a partner profile when a user signs up
- Use the company name from the user's signup metadata
- Configure proper RLS policies for normal operations
- Reload the schema cache automatically

### Step 2: Verify the Trigger
After running the script, you should see output confirming the trigger was created:
- `trigger_name`: on_auth_user_created
- `event_object_table`: users
- The trigger fires AFTER INSERT on auth.users

### Step 3: Test Signup
1. The signup code has been updated to pass company_name as user metadata
2. Clear your browser cache or use incognito mode
3. Try creating a new user account
4. The partner profile will be created automatically by the database trigger
5. You should be redirected to the dashboard successfully

## How It Works

**Old Approach (Problematic):**
- Client calls `auth.signUp()` to create user
- Client tries to insert into `partners` table
- RLS policy blocks the insert (because the user session wasn't fully established yet)

**New Approach (Working):**
- Client calls `auth.signUp()` with company_name in user metadata
- Supabase creates the user in auth.users table
- Database trigger automatically fires
- Trigger creates partner profile using SECURITY DEFINER (bypasses RLS)
- Everything happens in one transaction, ensuring data consistency

## Files Modified
1. `fix-signup-with-trigger.sql` - Database trigger setup
2. `src/app/auth/signup/page.tsx` - Updated to use metadata approach
3. `database-setup.sql` - Fixed CREATE POLICY syntax errors

## Alternative Solution (If Reset Script Doesn't Work)

If the reset script doesn't work, try these alternative steps:

### Alternative Step 1: Manual Verification
Run this query in the SQL Editor to verify the partners table structure:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'partners' 
AND table_schema = 'public';
```

You should see:
- `id` (uuid)
- `email` (text)
- `company_name` (text)
- `created_at` (timestamp with time zone)

### Step 4: Check RLS Policies
Verify that Row Level Security policies are in place:
```sql
SELECT * FROM pg_policies WHERE tablename = 'partners';
```

### Step 5: Test the Signup Again
1. Clear your browser cache or use incognito mode
2. Try creating a new user account
3. Check the browser console for any additional error messages

## Additional Troubleshooting

### If the error persists:

1. **Check Supabase Project Status**: Ensure your Supabase project is running and not paused

2. **Verify Environment Variables**: Make sure your `.env.local` has correct values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Check Table Permissions**: Run this to ensure proper grants:
   ```sql
   GRANT ALL ON partners TO authenticated;
   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
   ```

4. **Manually Insert Test Data**: Try inserting a record manually to verify the table works:
   ```sql
   INSERT INTO partners (id, email, company_name)
   VALUES (gen_random_uuid(), 'test@example.com', 'Test Company');
   ```
   If this fails, the table structure has an issue.

5. **Re-create the Table**: If all else fails, drop and recreate:
   ```sql
   DROP TABLE IF EXISTS api_keys CASCADE;
   DROP TABLE IF EXISTS partners CASCADE;
   
   -- Then run the CREATE TABLE statements from database-setup.sql
   ```

## Prevention
- Always run SQL migrations in Supabase's SQL Editor
- After schema changes, reload the schema cache
- Wait a few seconds after running migrations before testing

## Need More Help?
If the issue persists after following these steps, check:
- Supabase project logs in the Dashboard
- Browser console for detailed error messages
- Network tab to see the exact API request/response
