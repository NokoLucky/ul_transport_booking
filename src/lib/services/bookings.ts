
import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

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
  // Step 1: Fetch all bookings with status 'In Progress'
  const { data: bookings, error: bookingsError } = await supabase
    .from('booking')
    .select('*')
    .eq('status', 'In Progress');

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
    throw bookingsError;
  }

  if (!bookings) return [];

  // Step 2: For each booking, fetch its corresponding upload data
  const bookingsWithUploads = await Promise.all(
    bookings.map(async (booking) => {
      // Fetch a SINGLE upload record for the booking
      const { data: upload, error: uploadError } = await supabase
        .from('uploads')
        .select('*')
        .eq('booking_id', booking.id)
        .single(); // Use .single() to get an object or null

      if (uploadError && uploadError.code !== 'PGRST116') { // PGRST116 means no rows found, which is okay.
        console.error(`Error fetching uploads for booking ${booking.id}:`, uploadError);
        // Return booking without uploads if there's a critical error
        return { ...booking, uploads: null };
      }
      
      // Step 3: Combine the data
      return { ...booking, uploads: upload }; // 'uploads' is now an object or null
    })
  );

  return bookingsWithUploads;
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

export async function cancelBooking(bookingId: string) {
    const { data, error } = await supabase
        .from('booking')
        .update({ status: 'Canceled' })
        .eq('id', bookingId)
        .select()
        .single();
    
    if (error) {
        console.error('Error canceling booking:', error);
        throw new Error('Failed to cancel booking.');
    }
    return data;
}


export async function deleteBooking(bookingId) {
    const { error } = await supabase
        .from('booking')
        .delete()
        .eq('id', bookingId);

    if (error) throw error;
}
