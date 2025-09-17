
import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

export async function getVehicles(category: string) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('category', category)
    .eq('status', 'Unallocated');

  if (error) throw error;
  return data;
}

export async function updateVehicleStatus(registration: string, vehicleStatus: string) {
  const { error } = await supabase
    .from('vehicles')
    .update({ status: vehicleStatus })
    .eq('registration', registration);

  if (error) {
    console.error("Error updating vehicle status:", error);
    throw error;
  }
}

export async function getDrivers() {
    const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('status', 'Unassigned');

    if (error) throw error;
    return data;
}
