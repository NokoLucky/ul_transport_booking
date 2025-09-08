import { supabase } from '@/lib/supabase/client';

export async function addBookingFiles(bookingId, leaveFormPath, passengersPath, driversLicensePath) {
    const { error } = await supabase
        .from('UPLOADS')
        .insert([{
            booking_id: bookingId,
            leave_form: leaveFormPath,
            passengers: passengersPath,
            drivers_license: driversLicensePath,
        }]);
    
    if (error) throw error;
}

export async function addInspectorFiles(bookingId, pictures, action) {
     const pictureObjects = pictures.map((path, index) => ({
        booking_id: bookingId,
        picture_path: path,
        picture_number: index + 1, // e.g., picture_1, picture_2
        action: action,
    }));

    const { error } = await supabase
        .from('PICTURES')
        .insert(pictureObjects);

    if (error) throw error;
}
