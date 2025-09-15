
'use server'

import { inspectorLogin } from '@/lib/services/auth'

export async function inspectorLoginAction(username: string, password_raw: string): Promise<boolean> {
    return await inspectorLogin(username, password_raw);
}
