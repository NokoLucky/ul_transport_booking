
'use server';
/**
 * @fileOverview A flow for sending a booking confirmation email.
 *
 * - sendBookingConfirmation - A function that handles sending the confirmation email.
 * - SendBookingConfirmationInput - The input type for the sendBookingConfirmation function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SendBookingConfirmationInputSchema = z.object({
  name: z.string().describe('The name of the user who made the booking.'),
  reference: z.string().describe('The booking reference number.'),
  email: z.string().email().describe('The email address of the user.'),
});

export type SendBookingConfirmationInput = z.infer<
  typeof SendBookingConfirmationInputSchema
>;

const emailPrompt = ai.definePrompt({
    name: 'bookingEmailPrompt',
    input: { schema: SendBookingConfirmationInputSchema },
    prompt: `Hi {{{name}}},

This email serves as a notice that you have successfully requested a booking for a vehicle. Please be patient while we are processing your booking.

Below is your reference code which can be used to check status on our system.
      
**{{reference}}**

Kind Regards,
UL Transport Management
    `
});

export const sendBookingConfirmationFlow = ai.defineFlow(
  {
    name: 'sendBookingConfirmationFlow',
    inputSchema: SendBookingConfirmationInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    
    const emailBody = await emailPrompt(input);

    try {
        await resend.emails.send({
            from: 'UL Transport <onboarding@resend.dev>',
            to: input.email,
            subject: 'Booking Confirmation',
            text: emailBody.text,
        });
        console.log(`Booking confirmation email sent to ${input.email}`);
    } catch (error) {
        console.error("Failed to send booking confirmation email:", error);
        // We can decide if this should be a hard failure or not.
        // For now, we'll let it fail silently in the background but log the error.
        // In a production app, you'd want more robust error handling/retry logic.
    }
    
    return { success: true };
  }
);


export async function sendBookingConfirmation(
  input: SendBookingConfirmationInput
): Promise<{ success: boolean }> {
  return sendBookingConfirmationFlow(input);
}
