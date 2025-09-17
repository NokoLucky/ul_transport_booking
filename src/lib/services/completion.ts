import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

export async function getCompletedBookings() {
    const { data, error } = await supabase
        .from('allocates')
        .select(`
            *,
            booking (*),
            drivers (*)
        `)
        .eq('booking.status', 'Awaiting Admin Approval');
    
    if (error) throw error;
    return data;
}

export async function getOneCompletedBooking(allocateId) {
    const { data, error } = await supabase
        .from('allocates')
        .select(`
            *,
            booking (*),
            drivers (*)
        `)
        .eq('id', allocateId)
        .single();

    if (error) throw error;
    return data;
}

export async function getCompletedBookingsCheckin() {
    const { data, error } = await supabase
        .from('allocates')
        .select(`
            *,
            booking (*),
            drivers (*)
        `)
        .eq('booking.status', 'Completed');

    if (error) throw error;
    return data;
}

export async function getOneCompletedBookingCheckin(bookingId) {
    const { data, error } = await supabase
        .from('allocates')
        .select('*')
        .eq('booking_id', bookingId)
        .eq('status', 'Completed')
        .single();
        
    if (error) throw error;
    return data;
}
