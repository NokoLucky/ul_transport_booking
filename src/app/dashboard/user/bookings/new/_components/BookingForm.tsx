'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Car, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  purpose: z.string().min(10, {
    message: "Purpose must be at least 10 characters.",
  }),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
  passengers: z.coerce.number().min(1, { message: "At least 1 passenger is required." }),
  vehicleType: z.string().min(1, { message: "Please select a vehicle type." }),
  costCenter: z.string().min(3, { message: "Cost center is required." }),
})

export function BookingForm() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      purpose: "",
      passengers: 1,
      costCenter: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Booking Submitted!",
      description: "Your vehicle request has been sent for approval.",
    })
    router.push('/dashboard/user');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Peter Mokaba Stadium, Polokwane" {...field} />
                </FormControl>
                <FormDescription>
                    The final destination of your trip.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="costCenter"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cost Center / Department Code</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., FMS-001" {...field} />
                </FormControl>
                 <FormDescription>
                    The financial code for billing purposes.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose of Trip</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Clearly describe the reason for this transport request..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid md:grid-cols-3 gap-8">
            <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Trip Dates</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value?.from && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                            field.value.to ? (
                            <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                            </>
                            ) : (
                            format(field.value.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={{ from: field.value?.from, to: field.value?.to }}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Passengers</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="1" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Preferred Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select a vehicle type" />
                        </SelectTrigger>
                    </div>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="sedan">Sedan (1-3 passengers)</SelectItem>
                    <SelectItem value="suv">SUV (4-6 passengers)</SelectItem>
                    <SelectItem value="minibus">Minibus (7-22 passengers)</SelectItem>
                    <SelectItem value="bus">Bus (23+ passengers)</SelectItem>
                    <SelectItem value="any">Any Available</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex justify-end pt-4">
            <Button type="submit">Submit Booking Request</Button>
        </div>
      </form>
    </Form>
  )
}
