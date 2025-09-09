import { supabase } from '@/lib/supabase/client';

export async function getVehicles(category) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('category', category)
    .eq('status', 'Unallocated');

  if (error) throw error;
  return data;
}

export async function updateVehicleStatus(registration, vehicleStatus) {
  const { error } = await supabase
    .from('vehicles')
    .update({ status: vehicleStatus })
    .eq('registration', registration);

  if (error) throw error;
}

export async function getDrivers() {
    const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('status', 'Unassigned');

    if (error) throw error;
    return data;
}
