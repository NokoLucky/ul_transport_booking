
import { createClient } from '@supabase/supabase-js';
require('dotenv').config({ path: './.env.local' });

// IMPORTANT: These should be stored in .env file and MUST NOT be public

// This is a server-only client
export const createServerClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side operations. Please add it to your .env.local file.');
    }
    
    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });
}
