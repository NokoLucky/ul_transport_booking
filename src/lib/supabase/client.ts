// src/lib/supabase/client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | undefined;

// Note: These variables should be stored in environment variables
// For local development, you can create a .env.local file
function getSupabaseClient() {
    if (supabase) {
        return supabase;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
}

export { getSupabaseClient };
