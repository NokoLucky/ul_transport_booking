import { supabase } from '@/lib/supabase/client';

export async function addLogbookKms(bookingId, kms, vehicle, logDate) {
    const { error } = await supabase
        .from('logbook')
        .insert([{
            booking_id: bookingId,
            kms: kms,
            vehicle: vehicle,
            log_date: logDate,
        }]);
    
    if (error) throw error;
}

export async function getDriverKms(bookingId) {
    const { data, error } = await supabase
        .from('logbook')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

    if (error) throw error;
    return data;
}

export async function logExists(bookingId) {
    const { data, error, count } = await supabase
        .from('logbook')
        .select('*', { count: 'exact', head: true })
        .eq('booking_id', bookingId);
        
    if (error) throw error;
    return (count ?? 0) > 0;
}
