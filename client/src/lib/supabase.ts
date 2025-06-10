import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our newsletter signup
export interface NewsletterSignup {
  id?: string;
  email: string;
  created_at?: string;
  source?: string;
  is_subscribed?: boolean;
  metadata?: Record<string, any>;
} 