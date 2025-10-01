# API Authentication with Hashed Keys

This document explains how to authenticate API requests using the hashed API keys stored in the Supabase database.

## Overview

The Letsy Dashboard generates API keys and stores them in two formats:
1. **Plain text** (`key` column) - Shown once to the user during generation
2. **Hashed** (`key_hash` column) - Used by the API to verify requests securely

## Database Schema

The `api_keys` table contains:
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partners(id),
  name TEXT NOT NULL,
  key TEXT NOT NULL,           -- Plain text (temporary, for compatibility)
  key_hash TEXT,                -- Bcrypt hash for secure verification
  created_at TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE
);
```

## How the Dashboard Works

1. User clicks "Generate new key" in the dashboard
2. Dashboard generates a random key: `letsy_xxxxxxxxxxxxxxxxxxxxx`
3. Dashboard hashes the key using bcrypt (10 rounds)
4. Dashboard stores both plain text and hash in database
5. Dashboard shows the plain text key to the user once
6. User copies the key and stores it securely

## How Your API Should Authenticate Requests

### Step 1: Extract the API Key from Request

```javascript
// Example: Extract from Authorization header
const apiKey = request.headers['authorization']?.replace('Bearer ', '');

// Or from a custom header
const apiKey = request.headers['x-api-key'];
```

### Step 2: Query Database for All Active Keys

```javascript
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase with SERVICE ROLE key (has bypass RLS)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Important: Use service role, not anon key
);

// Fetch all active (non-revoked) API key hashes
const { data: apiKeys, error } = await supabase
  .from('api_keys')
  .select('id, partner_id, key_hash, name, revoked')
  .eq('revoked', false);

if (error) {
  return { authenticated: false, error: 'Database error' };
}
```

### Step 3: Compare Provided Key Against Hashes

```javascript
// Check if the provided key matches any stored hash
let matchedKey = null;

for (const keyRecord of apiKeys) {
  if (keyRecord.key_hash) {
    const isMatch = await bcrypt.compare(apiKey, keyRecord.key_hash);
    if (isMatch) {
      matchedKey = keyRecord;
      break;
    }
  }
}

if (!matchedKey) {
  return { authenticated: false, error: 'Invalid API key' };
}

// Key is valid! You now have access to:
// - matchedKey.partner_id (to identify which partner is making the request)
// - matchedKey.id (the API key ID)
// - matchedKey.name (the key name)
```

## Complete Authentication Middleware Example

### Node.js/Express

```javascript
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function authenticateApiKey(req, res, next) {
  try {
    // Extract API key from header
    const apiKey = req.headers['authorization']?.replace('Bearer ', '') || 
                   req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Fetch all active keys
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('id, partner_id, key_hash, name')
      .eq('revoked', false);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }

    // Find matching key
    let matchedKey = null;
    for (const keyRecord of apiKeys) {
      if (keyRecord.key_hash) {
        const isMatch = await bcrypt.compare(apiKey, keyRecord.key_hash);
        if (isMatch) {
          matchedKey = keyRecord;
          break;
        }
      }
    }

    if (!matchedKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Add partner info to request for downstream handlers
    req.partner = {
      id: matchedKey.partner_id,
      apiKeyId: matchedKey.id,
      apiKeyName: matchedKey.name
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

// Use in your routes
app.get('/api/formations', authenticateApiKey, async (req, res) => {
  // req.partner.id is available here
  // You can use it to filter data, log usage, etc.
  const { data } = await supabase
    .from('formations')
    .select('*');
  
  res.json(data);
});
```

### Next.js API Route

```javascript
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Extract API key
    const apiKey = request.headers.get('authorization')?.replace('Bearer ', '') ||
                   request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      );
    }

    // Fetch active keys
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('id, partner_id, key_hash, name')
      .eq('revoked', false);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }

    // Verify key
    let matchedKey = null;
    for (const keyRecord of apiKeys) {
      if (keyRecord.key_hash) {
        const isMatch = await bcrypt.compare(apiKey, keyRecord.key_hash);
        if (isMatch) {
          matchedKey = keyRecord;
          break;
        }
      }
    }

    if (!matchedKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Key is valid - proceed with your API logic
    // matchedKey.partner_id identifies the partner
    
    // Example: Fetch formations
    const { data: formations } = await supabase
      .from('formations')
      .select('*');

    return NextResponse.json({ 
      success: true,
      partner_id: matchedKey.partner_id,
      data: formations 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Performance Optimization

Since bcrypt comparison is CPU-intensive, consider these optimizations:

### 1. Cache Valid Keys
```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function authenticateWithCache(apiKey) {
  const cached = cache.get(apiKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.partner;
  }

  // Verify and cache result
  const partner = await verifyApiKey(apiKey);
  if (partner) {
    cache.set(apiKey, { partner, timestamp: Date.now() });
  }
  
  return partner;
}
```

### 2. Use Database Indexes
The migration already includes an index on `key_hash` for faster lookups:
```sql
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
```

### 3. Filter by Key Prefix
```javascript
// If your keys always start with 'letsy_', you can optimize:
if (!apiKey.startsWith('letsy_')) {
  return { authenticated: false };
}
```

## Environment Variables Required

Your API needs these environment variables:

```bash
# .env or .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** Use the `service_role` key, NOT the `anon` key. The service role bypasses RLS policies and can read all API keys.

## Security Best Practices

1. ✅ **Always use HTTPS** - API keys should never be transmitted over HTTP
2. ✅ **Use bcrypt comparison** - Never compare hashes directly with `===`
3. ✅ **Check revoked status** - Always filter `WHERE revoked = false`
4. ✅ **Rate limiting** - Implement rate limiting per API key
5. ✅ **Logging** - Log all authentication attempts (without logging the key itself)
6. ✅ **Service role key security** - Keep the service role key secure, never expose it to clients

## Testing Your API

### Test with cURL
```bash
# Replace YOUR_API_KEY with actual key from dashboard
curl -H "Authorization: Bearer letsy_xxxxxxxxxxxxxxxxxxxxx" \
     https://your-api.com/api/formations
```

### Test with JavaScript
```javascript
const response = await fetch('https://your-api.com/api/formations', {
  headers: {
    'Authorization': 'Bearer letsy_xxxxxxxxxxxxxxxxxxxxx'
  }
});

const data = await response.json();
console.log(data);
```

## Migration Steps

To implement this authentication:

1. ✅ Run the database migration: `add-api-key-hash.sql`
2. ✅ Update dashboard to hash keys (already done)
3. ⚠️ **Implement authentication in your API** (use examples above)
4. ⚠️ Test thoroughly with valid and invalid keys
5. ⚠️ Monitor authentication failures in production

## Troubleshooting

### "Database error" when authenticating
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify the service role key has permissions to read the `api_keys` table

### "Invalid API key" for valid keys
- Verify the `key_hash` column exists in database
- Check that bcrypt is comparing correctly (await the Promise)
- Ensure the key wasn't revoked

### Slow authentication
- Implement caching (see Performance Optimization)
- Verify the `idx_api_keys_key_hash` index exists
- Consider reducing the number of active keys

## Questions?

For issues or questions about API authentication, check:
- Supabase service role documentation
- Bcrypt.js documentation
- This project's README.md
