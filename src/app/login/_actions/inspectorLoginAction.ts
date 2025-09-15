
'use server'

import { supabase } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'

async function inspectorLogin(username: string, password_raw: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('inspector')
    .select('id, password')
    .eq('username', username)
    .single();

  if (error || !data) {
    console.error('Inspector login error or user not found:', error);
    return false;
  }

  const isValid = await bcrypt.compare(password_raw, data.password);
  return isValid;
}

export async function inspectorLoginAction(username: string, password_raw: string): Promise<boolean> {
    return await inspectorLogin(username, password_raw);
}
