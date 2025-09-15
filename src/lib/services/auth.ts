
import { supabase } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

export async function adminLogin(username: string, password_raw: string): Promise<boolean> {
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

export async function inspectorLogin(username: string, password_raw: string): Promise<boolean> {
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
