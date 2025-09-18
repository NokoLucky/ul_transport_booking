
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
require('dotenv').config({ path: './.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

// Define a hardcoded email for testing in a sandbox environment.
// Replace this with your actual Resend-verified email address.
const SANDBOX_TEST_EMAIL = "your-verified-email@example.com";

const SendBookingConfirmationInputSchema = z.object({
  name: z.string().describe('The name of the user who made the booking.'),
  reference: z.string().describe('The booking reference number.'),
  email: z.string().email().describe('The email address of the user.'),
});

export type SendBookingConfirmationInput = z.infer<
  typeof SendBookingConfirmationInputSchema
>;

export const sendBookingConfirmationFlow = ai.defineFlow(
  {
    name: 'sendBookingConfirmationFlow',
    inputSchema: SendBookingConfirmationInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    
    console.log("Generating booking confirmation email content...");
    const emailBody = `Hi ${input.name},<br/><br/>This email serves as a notice that you have successfully requested a booking for a vehicle. Please be patient while we are processing your booking.<br/><br/>Below is your reference code which can be used to check status on our system.<br/><br/><strong>${input.reference}</strong><br/><br/>Kind Regards,<br/>UL Transport Management`;
    console.log("Email content generated:\n", emailBody);

    try {
        // In a sandbox environment, Resend only allows sending to verified emails.
        // We will send all emails to a single verified address for testing.
        const recipientEmail = process.env.NODE_ENV === 'production' 
            ? SANDBOX_TEST_EMAIL // Use the hardcoded email on Vercel (production env) until domain is verified
            : input.email;      // Use the actual email in local dev (if you've verified it)

        console.log(`Attempting to send booking confirmation to ${recipientEmail}`);
        const { data, error } = await resend.emails.send({
            from: 'UL Transport <onboarding@resend.dev>',
            to: recipientEmail, // Changed from input.email
            subject: 'Booking Confirmation',
            html: emailBody,
        });

        if (error) {
          console.error("Resend API error:", error);
          throw new Error(`Failed to send booking confirmation email: ${JSON.stringify(error)}`);
        }

        console.log("Resend API success response:", data);
        console.log(`Booking confirmation email sent successfully to ${recipientEmail}`);
    } catch (error) {
        console.error("Failed to send booking confirmation email:", error);
        // Re-throw the error to ensure the flow fails and reports it to the client.
        throw new Error(`Failed to send booking confirmation email: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return { success: true };
  }
);


export async function sendBookingConfirmation(
  input: SendBookingConfirmationInput
): Promise<{ success: boolean }> {
  return sendBookingConfirmationFlow(input);
}
