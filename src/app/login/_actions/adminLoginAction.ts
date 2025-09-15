
'use server'

import { adminLogin } from '@/lib/services/auth'

export async function adminLoginAction(username: string, password_raw: string): Promise<boolean> {
  return await adminLogin(username, password_raw);
}
