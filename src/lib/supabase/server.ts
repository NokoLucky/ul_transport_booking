
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: These should be stored in .env file and MUST NOT be public

// This is a server-only client
export const createServerClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });
}
