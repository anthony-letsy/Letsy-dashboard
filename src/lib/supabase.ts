import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      partners: {
        Row: {
          id: string
          email: string
          company_name: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          company_name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_name?: string
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          partner_id: string
          name: string
          key: string
          created_at: string
          revoked: boolean
        }
        Insert: {
          id?: string
          partner_id: string
          name: string
          key: string
          created_at?: string
          revoked?: boolean
        }
        Update: {
          id?: string
          partner_id?: string
          name?: string
          key?: string
          created_at?: string
          revoked?: boolean
        }
      }
      formations: {
        Row: {
          id: string
          company_name: string
          status: 'pending' | 'verified' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          status?: 'pending' | 'verified' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          status?: 'pending' | 'verified' | 'failed'
          created_at?: string
        }
      }
    }
  }
}
