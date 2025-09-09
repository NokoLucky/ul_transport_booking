import { supabase } from '@/lib/supabase/client';

export async function allocateVehicle(details, bookingId, driverId, action) {
    const { data, error } = await supabase
        .from('allocates')
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
        .from('drivers')
        .update({ status: status })
        .eq('id', driverId);
    
    if (error) throw error;
}
