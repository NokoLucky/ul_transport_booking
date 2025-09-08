import { supabase } from '@/lib/supabase/client';

export async function allocateVehicle(details, bookingId, driverId, action) {
    const { data, error } = await supabase
        .from('ALLOCATES')
        .insert([{
            ...details,
            booking_id: bookingId,
            driver_id: driverId,
            action: action,
        }]);

    if (error) throw error;
    return data;
}

export async function updateDriverStatus(driverId, status) {
    const { error } = await supabase
        .from('DRIVERS')
        `</content>
  </change>
  <change>
    <file>/src/lib/services/completion.ts</file>
    <content><![CDATA[import { supabase } from '@/lib/supabase/client';

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
