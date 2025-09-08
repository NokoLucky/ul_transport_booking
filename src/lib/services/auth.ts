import { supabase } from '@/lib/supabase/client';
import bcrypt from 'bcryptjs';

export async function adminLogin(username, password) {
  const { data, error } = await supabase
    .from('ADMIN')
    .select('id, password')
    .eq('username', username)
    .single();

  if (error || !data) return false;

  const isValid = await bcrypt.compare(password, data.password);
  return isValid ? data.id : false;
}

export async function inspectorLogin(username, password) {
  const { data, error } = await supabase
    .from('INSPECTOR')
    .select('id, password')
    .eq('username', username)
    .single();

  if (error || !data) return false;

  const isValid = await bcrypt.compare(password, data.password);
  return isValid ? data.id : false;
}
