
import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

export async function allocateVehicle(details: any) {
    const { data, error } = await supabase
        .from('allocates')
        .insert([details])
        .select('booking_id');

    if (error) throw error;
    return data?.[0]?.booking_id;
}

export async function updateDriverStatus(driverId, status) {
    if(!driverId) return; // Do nothing if driverId is not provided
    const { error } = await supabase
        .from('drivers')
        .update({ status: status })
        .eq('id', driverId);
    
    if (error) throw error;
}

export async function checkinVehicle(details: any) {
    const { data, error } = await supabase
        .from('allocates')
        .insert([details])
        .select('booking_id');

    if (error) throw error;
    return data?.[0]?.booking_id;
}
