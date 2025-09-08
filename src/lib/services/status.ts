import { supabase } from '@/lib/supabase/client';

export async function getStatus(reference) {
    const { data, error } = await supabase
        .from('BOOKING')
        .select('*')
        .eq('id', reference) // Assuming reference is the booking_id
        .single();

    if (error) throw error;
    return data;
}
