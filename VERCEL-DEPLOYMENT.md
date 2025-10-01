# Vercel Deployment Guide for Letsy Dashboard

## Current Status
✅ Code pushed to GitHub: https://github.com/anthony-letsy/Letsy-dashboard
❌ Deployment failing due to missing environment variables

## Fix the Deployment Error

The error `@supabase/ssr: Your project's URL and API key are required` means the Supabase environment variables aren't set in Vercel.

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project**:
   - Visit https://vercel.com/dashboard
   - Find your `Letsy-dashboard` project
   - Click on it to open

2. **Navigate to Settings**:
   - Click "Settings" tab at the top
   - Click "Environment Variables" in the left sidebar

3. **Add Environment Variables**:
   
   **Add Variable 1:**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://fotjabrectcyayjakmys.supabase.co`
   - Environments: Check all boxes (Production, Preview, Development)
   - Click "Save"

   **Add Variable 2:**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdGphYnJlY3RjeWF5amFrbXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ1NDksImV4cCI6MjA3Mzk2MDU0OX0.BuL1rCjjVxYauN7fdpHg2y5QrhWfNlWHYQlBoObnPwI`
   - Environments: Check all boxes (Production, Preview, Development)
   - Click "Save"

4. **Redeploy**:
   - Go to "Deployments" tab
   - Click on the failed deployment
   - Click "Redeploy" button
   - OR go to main project page and click "Redeploy"

### Option 2: Via Vercel CLI

If you prefer using the command line:

```bash
# First, link your local project to Vercel
vercel link

# When prompted:
# - Select your scope (Anthony Akinmoyewa's projects)
# - Choose "Link to existing project? No"
# - Enter project name: Letsy-dashboard
# - Enter directory: ./ (just press Enter)

# Then add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://fotjabrectcyayjakmys.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdGphYnJlY3RjeWF5amFrbXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODQ1NDksImV4cCI6MjA3Mzk2MDU0OX0.BuL1rCjjVxYauN7fdpHg2y5QrhWfNlWHYQlBoObnPwI

# Also add for preview and development environments
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

# Finally, deploy
vercel --prod
```

## After Successful Deployment

Once deployment succeeds, you need to:

### 1. Run Database Migrations

Go to your Supabase SQL Editor and run these migrations:

**Migration 1: API Key Hashing**
```sql
-- Ensure id column has default UUID generation
ALTER TABLE api_keys ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add key_hash column
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS key_hash TEXT;

-- Create an index on key_hash for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- Update RLS policy for service role access
DROP POLICY IF EXISTS "Service role can read api_keys for authentication" ON api_keys;
CREATE POLICY "Service role can read api_keys for authentication" ON api_keys
  FOR SELECT USING (true);
```

**Migration 2: Formations Partner Linking**
```sql
-- Add partner_id column
ALTER TABLE formations ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES partners(id) ON DELETE CASCADE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_formations_partner_id ON formations(partner_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Authenticated users can view formations" ON formations;
DROP POLICY IF EXISTS "Partners can view own formations" ON formations;

CREATE POLICY "Partners can view own formations" ON formations
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert own formations" ON formations
  FOR INSERT WITH CHECK (partner_id = auth.uid());
```

### 2. Update Supabase Site URL

In your Supabase dashboard:
1. Go to Authentication > URL Configuration
2. Add your Vercel deployment URL to "Site URL"
3. Add your Vercel deployment URL to "Redirect URLs"

Format: `https://your-project-name.vercel.app`

### 3. Test the Deployment

1. Visit your Vercel deployment URL
2. Try signing up for a new account
3. Generate an API key
4. Check that formations are filtered by partner

## Troubleshooting

### Build Still Failing?
- Double-check environment variables are set for all environments (Production, Preview, Development)
- Make sure there are no typos in the variable names (they're case-sensitive)
- Click "Redeploy" to trigger a new build

### Authentication Not Working?
- Verify Site URL and Redirect URLs in Supabase include your Vercel domain
- Check that environment variables match your Supabase project

### API Keys Not Generating?
- Run the database migrations in Supabase SQL Editor
- Check browser console for errors

## Next Steps

After deployment is successful:

1. ✅ Test all features
2. ✅ Set up custom domain (optional)
3. ✅ Configure production Supabase project (if needed)
4. ✅ Implement API authentication (see API-AUTHENTICATION.md)
5. ✅ Set up monitoring and analytics (optional)

## Resources

- **GitHub Repository**: https://github.com/anthony-letsy/Letsy-dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **API Authentication Guide**: See API-AUTHENTICATION.md
- **Implementation Details**: See IMPLEMENTATION-SUMMARY.md
