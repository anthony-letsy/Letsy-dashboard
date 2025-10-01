# Letsy Partner Dashboard

A modern partner dashboard built with Next.js 14, Tailwind CSS, and Supabase authentication for managing API keys and company formations.

## Features

- **Authentication**: Secure sign up/login with Supabase Auth
- **API Key Management**: Generate, view, and revoke API keys with secure masking
- **Formations Overview**: View and filter company formations by status
- **Settings**: Update partner profile information
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Clean, professional interface inspired by Stripe/Linear

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Database Schema

The application expects the following Supabase tables:

### `partners` table
```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `api_keys` table
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  name TEXT NOT NULL,
  key TEXT NOT NULL,
  key_hash TEXT,  -- Bcrypt hash for secure API authentication
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);
```

### `formations` table
```sql
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'verified', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Authentication

The dashboard generates API keys that are stored securely with bcrypt hashing. When a partner generates an API key:

1. A random key is generated (e.g., `letsy_xxxxxxxxxxxxxxxxxxxxx`)
2. The key is hashed using bcrypt (10 rounds)
3. Both plain text and hash are stored in the database
4. The plain text key is shown to the user **once** during generation
5. Your API uses the hash to verify incoming requests

### For API Developers

If you're building an API that needs to authenticate using these keys:

📖 **See [API-AUTHENTICATION.md](./API-AUTHENTICATION.md) for complete implementation guide**

The guide includes:
- Step-by-step authentication flow
- Complete code examples (Node.js/Express & Next.js)
- Performance optimization tips
- Security best practices
- Troubleshooting guide

### Database Migration

To add API key hashing to your existing database, run:

```bash
# In Supabase SQL Editor, run:
add-api-key-hash.sql
```

This adds the `key_hash` column and necessary indexes for authentication.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd letsy-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Create the database tables using the SQL schema above
   - Get your project URL and anon key from the Supabase dashboard

4. **Set up the database**
   - Go to your Supabase dashboard: https://supabase.com/dashboard
   - Navigate to the SQL Editor
   - Run the `database-setup.sql` script to create the required tables and sample data
   - Run the `add-api-key-hash.sql` script to add API key hashing support
   - Run the `add-partner-to-formations.sql` script to link formations to partners
   - The environment variables are already configured in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Create a new account or sign in

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── api-keys/page.tsx
│   │   ├── formations/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── supabase.ts
│   ├── supabase-server.ts
│   └── utils.ts
└── middleware.ts
```

## Key Features

### Authentication
- Protected routes with middleware
- Automatic redirects for authenticated/unauthenticated users
- Session management with Supabase

### API Key Management
- Generate secure API keys with `letsy_` prefix
- Automatic bcrypt hashing for secure storage
- Copy to clipboard functionality
- Keys shown only once during generation
- Revoke keys when no longer needed
- Support for named keys for better organization

### Formations Dashboard
- Real-time status filtering by partner
- Partners only see their own formations
- Status badges with color coding
- Responsive data tables

### Settings
- Update company name and email
- Account information display
- Profile management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting (via editor)
- TypeScript for type safety
- Tailwind CSS for styling

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Docker**

Make sure to set the environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
