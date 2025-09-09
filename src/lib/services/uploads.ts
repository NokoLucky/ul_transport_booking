import { supabase } from '@/lib/supabase/client';

export async function addBookingFiles(bookingId, leaveFormPath, passengersPath, driversLicensePath) {
    const { error } = await supabase
        .from('uploads')
        .insert([{
            booking_id: bookingId,
            leave_form: leaveFormPath,
            passengers: passengersPath,
            drivers: driversLicensePath,
        }]);
    
    if (error) throw error;
}

export async function addInspectorFiles(bookingId, pictures, action) {
     const pictureObjects = {
        booking_id: bookingId,
        picture1: pictures[0] || null,
        picture2: pictures[1] || null,
        picture3: pictures[2] || null,
        picture4: pictures[3] || null,
        picture5: pictures[4] || null,
        picture6: pictures[5] || null,
        picture7: pictures[6] || null,
        picture8: pictures[7] || null,
     };

    const { error } = await supabase
        .from('pictures')
        .insert([pictureObjects]);

    if (error) throw error;
}
