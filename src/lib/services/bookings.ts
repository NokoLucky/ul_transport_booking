
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

  if (!bookings || bookings.length === 0) return [];

  // Step 2: Get all booking IDs
  const bookingIds = bookings.map(booking => booking.id);

  // Step 3: Fetch all uploads for those booking IDs in a single query
  const { data: uploads, error: uploadsError } = await supabase
    .from('uploads')
    .select('*')
    .in('booking_id', bookingIds);

  if (uploadsError) {
    console.error("Error fetching uploads:", uploadsError);
    throw uploadsError;
  }

  // Step 4: Create a map of uploads by booking_id for easy lookup
  const uploadsMap = new Map();
  if (uploads) {
    for (const upload of uploads) {
        uploadsMap.set(upload.booking_id, upload);
    }
  }

  // Step 5: Combine the bookings with their corresponding uploads
  const bookingsWithUploads = bookings.map(booking => {
    return {
      ...booking,
      uploads: uploadsMap.get(booking.id) || null
    };
  });

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

    