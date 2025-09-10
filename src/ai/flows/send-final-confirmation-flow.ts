
'use server';
/**
 * @fileOverview A flow for sending final booking confirmation emails to clients and drivers.
 *
 * - sendFinalConfirmation - A function that handles sending the confirmation emails.
 * - SendFinalConfirmationInput - The input type for the sendFinalConfirmation function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Resend } from 'resend';
import { updateBookingStatus } from '@/lib/services/bookings';
import { updateVehicleStatus } from '@/lib/services/vehicles';

const resend = new Resend(process.env.RESEND_API_KEY);

const SendFinalConfirmationInputSchema = z.object({
  clientName: z.string().describe('The name of the user who made the booking.'),
  clientEmail: z.string().email().describe('The email address of the user.'),
  vehicleDetails: z.string().describe('The make and registration of the allocated vehicle.'),
  departDateTime: z.string().describe('The departure date and time.'),
  returnDateTime: z.string().describe('The return date and time.'),
  allocationId: z.number().describe('The ID of the allocation record.'),
  bookingId: z.string().or(z.number()).describe('The ID of the booking record.'),
  driver: z.object({
    name: z.string().optional(),
    mobile: z.string().optional(),
    email: z.string().email().optional(),
  }).nullable().describe('The details of the assigned driver, if any.'),
});

export type SendFinalConfirmationInput = z.infer<
  typeof SendFinalConfirmationInputSchema
>;

const clientEmailNoDriverPrompt = ai.definePrompt({
    name: 'clientEmailNoDriverPrompt',
    input: { schema: SendFinalConfirmationInputSchema },
    prompt: `Hi {{{clientName}}},

We are excited to inform you that your booking has been approved. Below are the vehicle details.
      
Vehicle: **{{{vehicleDetails}}}**

Please come and collect the vehicle at the transport section 30 minutes prior to your departure time, which is at **{{departDateTime}}**.
      
NB: Collection of vehicles on weekdays will be between 7:30 and 16:00, and on weekends between 8:00 and 12:00.
      
Please make sure to log a vehicle return on this link upon your return date, which is at: **{{returnDateTime}}**.
(Note: Link functionality to be implemented in a future step for allocate_id: {{allocationId}})

Kind Regards,
UL Transport Management
    `
});

const clientEmailWithDriverPrompt = ai.definePrompt({
    name: 'clientEmailWithDriverPrompt',
    input: { schema: SendFinalConfirmationInputSchema },
    prompt: `Hi {{{clientName}}},

We are excited to inform you that your booking has been approved.
      
Your allocated vehicle details are as follows: **{{{vehicleDetails}}}**
      
Your assigned driver details are as follows:
Name: **{{driver.name}}**
Contact: **{{driver.mobile}}**

Please meet your designated driver at the student centre 30 minutes prior to departure time, which is at: **{{departDateTime}}**.
      
NB: Driver waiting period is 15 minutes maximum. If you are not at the meeting point by that period, the trip may be cancelled.

Kind Regards,
UL Transport Management
    `
});

const driverEmailPrompt = ai.definePrompt({
    name: 'driverEmailPrompt',
    input: { schema: SendFinalConfirmationInputSchema },
    prompt: `Hi {{driver.name}},

You have been assigned a new trip.
      
Client: **{{{clientName}}}**
Vehicle: **{{{vehicleDetails}}}**
Departure: **{{departDateTime}}**
Return: **{{returnDateTime}}**

Please meet the client at the student centre 30 minutes prior to the departure time.

Kind Regards,
UL Transport Management
    `
});

export const sendFinalConfirmationFlow = ai.defineFlow(
  {
    name: 'sendFinalConfirmationFlow',
    inputSchema: SendFinalConfirmationInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    
    // 1. Generate and send email to the client
    const clientPrompt = input.driver?.name ? clientEmailWithDriverPrompt : clientEmailNoDriverPrompt;
    const clientEmailResponse = await clientPrompt(input);
    const clientEmailBody = clientEmailResponse.text;

    try {
        console.log(`Attempting to send client confirmation to ${input.clientEmail}`);
        const { data, error } = await resend.emails.send({
            from: 'UL Transport <onboarding@resend.dev>',
            to: input.clientEmail,
            subject: 'Booking Approved',
            text: clientEmailBody
        });

        if (error) {
          console.error("Resend API error (client email):", error);
          throw new Error(`Failed to send client email: ${JSON.stringify(error)}`);
        }

        console.log("Resend API success response (client email):", data);
        console.log(`Client confirmation email sent successfully to ${input.clientEmail}`);

    } catch (error) {
        console.error(`Failed to send client email to ${input.clientEmail}`, error);
        // Re-throw the error to ensure the flow fails and reports it to the client.
        throw new Error(`Failed to send client email: ${error instanceof Error ? error.message : String(error)}`);
    }


    // 2. Generate and send email to the driver if one is assigned
    if (input.driver?.name && input.driver?.email) {
        const driverEmailResponse = await driverEmailPrompt(input);
        const driverEmailBody = driverEmailResponse.text;
        try {
            console.log(`Attempting to send driver confirmation to ${input.driver.email}`);
            const { data, error } = await resend.emails.send({
                from: 'UL Transport <onboarding@resend.dev>',
                to: input.driver.email,
                subject: 'New Trip Assigned',
                text: driverEmailBody
            });

            if (error) {
              console.error("Resend API error (driver email):", error);
              throw new Error(`Failed to send driver email: ${JSON.stringify(error)}`);
            }

            console.log("Resend API success response (driver email):", data);
            console.log(`Driver confirmation email sent successfully to ${input.driver.email}`);
        } catch (error) {
            console.error(`Failed to send driver email to ${input.driver.email}`, error);
            // Re-throw the error to ensure the flow fails and reports it to the client.
            throw new Error(`Failed to send driver email: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    
    // 3. Update statuses in the database
    const vehicleRegistration = input.vehicleDetails.split(' - ')[1];
    await updateBookingStatus(String(input.bookingId), 'Approved');
    await updateVehicleStatus(vehicleRegistration, 'Completed'); // This seems counterintuitive, but matching PHP logic. Might need review.
    
    return { success: true };
  }
);


export async function sendFinalConfirmation(
  input: SendFinalConfirmationInput
): Promise<{ success: boolean }> {
  return sendFinalConfirmationFlow(input);
}
