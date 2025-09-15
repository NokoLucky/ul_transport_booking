
'use server'

import { createServerClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

async function adminLogin(username: string, password_raw: string): Promise<boolean> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('admin')
    .select('id, password')
    .eq('username', username)
    .single();

  if (error || !data) {
    console.error('Admin login error or user not found:', error);
    return false;
  }

  const isValid = await bcrypt.compare(password_raw, data.password);
  return isValid;
}


export async function adminLoginAction(username: string, password_raw: string): Promise<boolean> {
  return await adminLogin(username, password_raw);
}
