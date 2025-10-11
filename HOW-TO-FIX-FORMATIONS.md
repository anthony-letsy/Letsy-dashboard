# How to Fix the Formations Tab - Step by Step

## The Problem
Your formations tab is empty because existing formations don't have a `partner_id` assigned, so the security policy filters them out.

## The Solution - Follow These Steps

### Step 1: Open Supabase
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click on **"New query"** button (top right)

### Step 3: Run the Fix Script
1. Open the file `RUN-THIS-IN-SUPABASE.sql` in VS Code
2. **Copy the entire contents** of that file (Cmd+A then Cmd+C)
3. **Paste it** into the Supabase SQL Editor
4. Click the **"Run"** button (or press Cmd+Enter)

### Step 4: Check the Results
After running the script, you should see several result tables:
- **Step 1**: Shows your current formations
- **Step 2**: Shows your partners
- **Step 3**: A notice saying how many formations were updated
- **Step 4**: Shows formations with a ✅ status indicating they now have a partner_id
- **Step 5**: Shows count of formations per partner

### Step 5: Refresh Your Dashboard
1. Go back to your Letsy dashboard in the browser
2. Navigate to the **Formations** tab
3. Refresh the page (Cmd+R or F5)
4. You should now see your formations!

## What If It Still Doesn't Work?

If you still don't see formations after following these steps:

### Check 1: Verify formations exist in database
Run this query in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM formations;
```
If this returns 0, you need to create some test formations first.

### Check 2: Verify your user has a partner record
Run this query in Supabase SQL Editor:
```sql
SELECT * FROM partners WHERE id = auth.uid();
```
If this returns no rows, your user account doesn't have a partner record.

### Check 3: Check browser console for errors
1. Open Developer Tools (F12 or Cmd+Option+I)
2. Go to the Console tab
3. Look for any error messages in red
4. Share those errors with me

## Need Help?
If you're still having issues after following these steps, please let me know:
1. What you see after running the SQL script
2. Any error messages
3. What shows up in the browser console
