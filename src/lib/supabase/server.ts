
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: These should be stored in .env file and MUST NOT be public
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// This is a server-only client
export const createServerClient = () => createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
})
