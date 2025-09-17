import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

export async function getStatus(reference: string) {
    const { data, error } = await supabase
        .from('booking')
        .select('*')
        .eq('reference', reference)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // PostgREST error for "exact one row not found"
            return null;
        }
        throw error;
    }
    return data;
}
