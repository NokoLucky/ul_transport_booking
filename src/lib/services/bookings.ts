
import { supabase } from '@/lib/supabase/client';

export async function addBooking(bookingDetails) {
  const { data, error } = await supabase
    .from('booking')
    .insert([bookingDetails])
    .select('id');
    
  if (error) throw error;
  return data?.[0]?.id;
}

export async function bookingExists(userEmail) {
  const { data, error, count } = await supabase
    .from('booking')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', userEmail);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function getBookings() {
  const { data, error } = await supabase
    .from('booking')
    .select(`
      *,
      uploads (*)
    `)
    .eq('status', 'In Progress');

  if (error) throw error;
  return data;
}

export async function getOneBooking(bookingId) {
  const { data, error } = await supabase
    .from('booking')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) throw error;
  return data;
}

export async function getInspectorBookings() {
  const { data, error } = await supabase
    .from('booking')
    .select('*')
    .eq('status', 'Allocating');
    
  if (error) throw error;
  return data;
}

export async function getInspectorOneBooking(bookingId) {
  return getOneBooking(bookingId);
}

export async function updateBookingStatus(bookingId: string, status: string) {
    const { data, error } = await supabase
        .from('booking')
        .update({ status })
        .eq('id', bookingId);
    
    if (error) throw error;
    return data;
}

export async function deleteBooking(bookingId) {
    const { error } = await supabase
        .from('booking')
        .delete()
        .eq('id', bookingId);

    if (error) throw error;
}
