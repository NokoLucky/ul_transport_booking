'use server';
/**
 * @fileOverview A flow for sending a booking confirmation email.
 *
 * - sendBookingConfirmation - A function that handles sending the confirmation email.
 * - SendBookingConfirmationInput - The input type for the sendBookingConfirmation function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    prompt: `
      To: {{{email}}}
      Subject: Booking Confirmation

      Hi {{{name}}},

      This email serves as a notice that you have successfully requested a booking for a vehicle. Please be patient while we are processing your booking.

      Below is your reference code which can be used to check status on our system.
      
      {{reference}}

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
    
    // In a real application, you would integrate with an email sending service here.
    // For now, we will simulate sending the email by generating the content.
    await emailPrompt(input);

    console.log(`Sending booking confirmation to ${input.email} for reference ${input.reference}`);
    
    return { success: true };
  }
);


export async function sendBookingConfirmation(
  input: SendBookingConfirmationInput
): Promise<{ success: boolean }> {
  return sendBookingConfirmationFlow(input);
}
