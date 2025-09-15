
'use server'

import { createServerClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

async function inspectorLogin({ username, password_raw }: { username: string, password_raw: string }): Promise<boolean> {
  console.log(`[Inspector Login] Attempting login for username: ${username}`);
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('inspector')
    .select('id, password')
    .eq('username', username)
    .single();

  if (error) {
    console.error('[Inspector Login] Supabase error:', error.message);
    // Don't throw the error to the client, just return false for security.
    return false;
  }

  if (!data) {
    console.warn(`[Inspector Login] No user found with username: ${username}`);
    return false;
  }

  console.log(`[Inspector Login] User found for ${username}. Comparing passwords...`);
  const isValid = await bcrypt.compare(password_raw, data.password);

  if (!isValid) {
      console.warn(`[Inspector Login] Password comparison failed for user: ${username}`);
  } else {
      console.log(`[Inspector Login] Password valid for user: ${username}. Login successful.`);
  }
  
  return isValid;
}

export async function inspectorLoginAction(username: string, password_raw: string): Promise<boolean> {
    return await inspectorLogin({username, password_raw});
}
