
'use server';

import { supabase } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

export async function createUser(details: {username: string, password_raw: string, role: 'admin' | 'inspector'}) {
    const { username, password_raw, role } = details;

    if (!password_raw) {
        throw new Error("Password cannot be empty.");
    }

    const hashedPassword = await bcrypt.hash(password_raw, 10);
    
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
