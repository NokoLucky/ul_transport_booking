
'use server'

import { createServerClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

async function adminLogin({ username, password_raw }: { username: string, password_raw: string }): Promise<boolean> {
  console.log(`[Admin Login] Attempting login for username: ${username}`);
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('admin')
    .select('id, password')
    .eq('username', username)
    .single();

  if (error) {
    console.error('[Admin Login] Supabase error:', error.message);
    // Don't throw the error to the client, just return false for security.
    return false;
  }

  if (!data) {
    console.warn(`[Admin Login] No user found with username: ${username}`);
    return false;
  }

  console.log(`[Admin Login] User found for ${username}. Comparing passwords...`);
  const isValid = await bcrypt.compare(password_raw, data.password);
  
  if (!isValid) {
      console.warn(`[Admin Login] Password comparison failed for user: ${username}`);
  } else {
      console.log(`[Admin Login] Password valid for user: ${username}. Login successful.`);
  }

  return isValid;
}


export async function adminLoginAction(username: string, password_raw: string): Promise<boolean> {
  return await adminLogin({username, password_raw});
}
