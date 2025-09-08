import { supabase } from '@/lib/supabase/client';

export async function getCompletedBookings() {
    const { data, error } = await supabase
        .from('ALLOCATES')
        .select(`
            *,
            BOOKING (*),
            DRIVERS (*)
        `)
        .eq('BOOKING.status', 'Awaiting Admin Approval');
    
    if (error) throw error;
    return data;
}

export async function getOneCompletedBooking(allocateId) {
    const { data, error } = await supabase
        .from('ALLOCATES')
        .select(`
            *,
            BOOKING (*),
            DRIVERS (*)
        `)
        .eq('id', allocateId)
        .single();

    if (error) throw error;
    return data;
}

export async function getCompletedBookingsCheckin() {
    const { data, error } = await supabase
        .from('ALLOCATES')
        .select('*')
        .eq('BOOKING.status', 'Completed');

    if (error) throw error;
    return data;
}

export async function getOneCompletedBookingCheckin(bookingId) {
    const { data, error } = await supabase
        .from('ALLOCATES')
        .select('*')
        .eq('booking_id', bookingId)
        .eq('status', 'Completed')
        .single();
        
    if (error) throw error;
    return data;
}