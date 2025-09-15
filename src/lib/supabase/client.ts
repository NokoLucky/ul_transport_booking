// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
require('dotenv').config({ path: './.env.local' });

// Note: These variables should be stored in environment variables
// For local development, you can create a .env.local file
const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabaseClient();