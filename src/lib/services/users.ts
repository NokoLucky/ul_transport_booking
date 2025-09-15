
'use server';

import { createServerClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

export async function createUser(details: {username: string, password: string, role: 'admin' | 'inspector'}) {
    const { username, password, role } = details;
    const supabase = createServerClient();

    if (!password) {
        throw new Error("Password cannot be empty.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
        .from(role)
        .insert([{ username, password: hashedPassword }])
        .select('id');

    if (error) {
        if (error.code === '23505') { // Unique violation
            throw new Error(`Username '${username}' already exists for role '${role}'.`);
        }
        console.error(`Error creating ${role}:`, error);
        throw error;
    }
    
    return data?.[0]?.id;
}
