
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { logExists, addLogbookKms } from "@/lib/services/logbook"
import { updateBookingStatus } from "@/lib/services/bookings"
import { updateVehicleStatus } from "@/lib/services/vehicles"
import { updateDriverStatus } from "@/lib/services/allocation"


const FormSchema = z.object({
  kms: z.string().min(1, "Closing kilometers are required."),
})

export function EndTripForm({ allocation }: { allocation: any }) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      kms: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        const tripAlreadyEnded = await logExists(allocation.booking_id);
        if (tripAlreadyEnded) {
            toast({
                title: "Trip Already Ended",
                description: "This trip's closing kilometers have already been submitted.",
                variant: "destructive"
            });
            return;
        }

        const registration = allocation.vehicle.split(' - ')[1];
        if (!registration) throw new Error("Could not extract vehicle registration.");

        await addLogbookKms(allocation.booking_id, data.kms, allocation.vehicle, new Date().toISOString());
        await updateBookingStatus(String(allocation.booking_id), 'Completed');
        await updateVehicleStatus(registration, 'Unallocated');

        if(allocation.driver_id) {
            await updateDriverStatus(allocation.driver_id, 'Unassigned');
        }

        toast({
            title: "Trip Ended Successfully!",
            description: "The vehicle is now ready for inspector check-in.",
        });

        router.push('/');

    } catch (error: any) {
      console.error("End trip error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="kms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Closing Kilometers</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/')}>
                Back to Home
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "End Trip"}
            </Button>
        </div>
      </form>
    </Form>
  )
}
