
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Car, Loader2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { addBooking } from "@/lib/services/bookings"
import crypto from 'crypto'

const formSchema = z.object({
  // User Info
  userName: z.string().min(1, "Full name is required"),
  userSurname: z.string().min(1, "Surname is required"),
  userStaffNo: z.string().max(8, "Staff number can be at most 8 characters"),
  userMobile: z.string().max(10, "Mobile number can be at most 10 characters"),
  userEmail: z.string().email("Invalid email address"),
  vehicleType: z.string().min(1, "Please select a vehicle type."),
  
  // Department Info
  department: z.string().min(1, "Department is required"),
  building: z.string().min(1, "Building is required"),
  officeNo: z.string().min(1, "Office number is required"),
  schoolDivision: z.string().optional(),
  
  // Driver Info (conditional)
  driverFirstName: z.string().optional(),
  driverSurname: z.string().optional(),
  driverStaffNo: z.string().optional(),
  driverMobile: z.string().optional(),
  driverJobType: z.string().optional(),
  driverLicenseIssue: z.date().optional(),
  driverLicenseExpiry: z.date().optional(),

  // Cost Centre Info
  costCentre: z.string().min(1, "Cost centre is required"),
  costName: z.string().min(1, "Person in charge is required"),
  costAccName: z.string().min(1, "Accountant name is required"),
  costAccNo: z.string().min(1, "Account number is required"),

  // Trip Info
  destination: z.string().min(2, "Destination must be at least 2 characters."),
  estimatedDistance: z.string().min(1, "Estimated distance is required."),
  purpose: z.string().min(10, "Purpose must be at least 10 characters."),
  passengers: z.string().min(1, "At least 1 passenger is required."),
  departDateTime: z.date(),
  returnDateTime: z.date(),
  tripDescription: z.string().optional(),
});

export function BookingForm() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      userSurname: "",
      userStaffNo: "",
      userMobile: "",
      userEmail: "",
      department: "",
      building: "",
      officeNo: "",
      costCentre: "",
      costName: "",
      costAccName: "",
      costAccNo: "",
      destination: "",
      purpose: "",
      passengers: "1",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const reference = `ULTRANS${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        const bookingData = {
            user_name: values.userName,
            user_surname: values.userSurname,
            user_staffno: values.userStaffNo,
            user_mobile: values.userMobile,
            user_email: values.userEmail,
            car_type: values.vehicleType,
            department: values.department,
            building: values.building,
            officeno: values.officeNo,
            division: values.schoolDivision,
            driver_name: values.driverFirstName,
            driver_surname: values.driverSurname,
            driver_staffno: values.driverStaffNo,
            driver_mobile: values.driverMobile,
            driver_jobtype: values.driverJobType,
            license_issue: values.driverLicenseIssue ? format(values.driverLicenseIssue, 'yyyy-MM-dd') : null,
            license_expiry: values.driverLicenseExpiry ? format(values.driverLicenseExpiry, 'yyyy-MM-dd') : null,
            cost_centre: values.costCentre,
            cost_name: values.costName,
            cost_accname: values.costAccName,
            cost_accno: values.costAccNo,
            destination: values.destination,
            distance: values.estimatedDistance,
            purpose: values.purpose,
            passengerno: values.passengers,
            depart_date: values.departDateTime ? format(values.departDateTime, "yyyy-MM-dd'T'HH:mm:ss") : null,
            return_date: values.returnDateTime ? format(values.returnDateTime, "yyyy-MM-dd'T'HH:mm:ss") : null,
            description: values.tripDescription,
            status: 'In Progress',
            reference: reference,
        };

        const bookingId = await addBooking(bookingData);

        if (bookingId) {
            toast({
                title: "Booking Details Saved!",
                description: "Please upload the required documents to finalize your request.",
            });
            router.push(`/dashboard/user/bookings/${bookingId}/upload`);
        } else {
            throw new Error("Failed to get booking ID.");
        }
    } catch (error: any) {
        console.error("Booking submission error:", error);
        toast({
            title: "Submission Failed",
            description: error.message || "There was an error saving your booking. Please try again.",
            variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="multiple" defaultValue={['user-info', 'trip-info']} className="w-full">
            {/* User Information */}
            <AccordionItem value="user-info">
                <AccordionTrigger className="text-xl font-semibold">User Information</AccordionTrigger>
                <AccordionContent className="p-4 space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="userName" render={({ field }) => (
                            <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="userSurname" render={({ field }) => (
                            <FormItem><FormLabel>Surname</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="userStaffNo" render={({ field }) => (
                            <FormItem><FormLabel>Staff No.</FormLabel><FormControl><Input placeholder="12345678" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="userMobile" render={({ field }) => (
                            <FormItem><FormLabel>Mobile No.</FormLabel><FormControl><Input type="tel" placeholder="0812345678" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="userEmail" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@ul.ac.za" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Required Vehicle</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <div className="relative">
                                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <SelectTrigger className="pl-9">
                                        <SelectValue placeholder="Choose vehicle" />
                                    </SelectTrigger>
                                </div>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="22 SEATERS">22 Seater</SelectItem>
                                    <SelectItem value="13 SEATERS">13 Seater</SelectItem>
                                    <SelectItem value="7 SEATERS">7 Seater</SelectItem>
                                    <SelectItem value="BUSES">Bus</SelectItem>
                                    <SelectItem value="SEDANS">Sedan</SelectItem>
                                    <SelectItem value="TRACTORS">Tractor</SelectItem>
                                    <SelectItem value="TRUCKS">Truck</SelectItem>
                                    <SelectItem value="VANS/BAKKIES">Van/Bakkie</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </AccordionContent>
            </AccordionItem>

            {/* Department Information */}
            <AccordionItem value="department-info">
                <AccordionTrigger className="text-xl font-semibold">Department Information</AccordionTrigger>
                <AccordionContent className="p-4 space-y-8">
                     <FormField control={form.control} name="department" render={({ field }) => (
                        <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="building" render={({ field }) => (
                            <FormItem><FormLabel>Building</FormLabel><FormControl><Input placeholder="e.g., New R-Block" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="officeNo" render={({ field }) => (
                            <FormItem><FormLabel>Office No.</FormLabel><FormControl><Input placeholder="e.g., 1024" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="schoolDivision" render={({ field }) => (
                        <FormItem><FormLabel>School/Division</FormLabel><FormControl><Input placeholder="e.g., School of Mathematical and Computer Sciences" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </AccordionContent>
            </AccordionItem>

             {/* Driver Information */}
            <AccordionItem value="driver-info">
                <AccordionTrigger className="text-xl font-semibold">Driver Information (Optional)</AccordionTrigger>
                <AccordionContent className="p-4 space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="driverFirstName" render={({ field }) => (
                            <FormItem><FormLabel>Driver First Name</FormLabel><FormControl><Input placeholder="Driver's first name" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="driverSurname" render={({ field }) => (
                            <FormItem><FormLabel>Driver Surname</FormLabel><FormControl><Input placeholder="Driver's surname" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="driverStaffNo" render={({ field }) => (
                            <FormItem><FormLabel>Driver Staff No.</FormLabel><FormControl><Input placeholder="Driver's staff number" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="driverMobile" render={({ field }) => (
                            <FormItem><FormLabel>Driver Mobile No.</FormLabel><FormControl><Input type="tel" placeholder="Driver's mobile" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="driverJobType" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver Job Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select driver's job type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Permanent">Permanent</SelectItem>
                                <SelectItem value="Temporary">Temporary</SelectItem>
                                <SelectItem value="Contractor">Contractor</SelectItem>
                            </SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="driverLicenseIssue" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>License Issue Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="driverLicenseExpiry" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>License Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* Cost Centre Information */}
            <AccordionItem value="cost-info">
                <AccordionTrigger className="text-xl font-semibold">Cost Centre Information</AccordionTrigger>
                <AccordionContent className="p-4 space-y-8">
                    <FormField control={form.control} name="costCentre" render={({ field }) => (
                        <FormItem><FormLabel>Cost Centre</FormLabel><FormControl><Input placeholder="Enter Cost Centre" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="costName" render={({ field }) => (
                            <FormItem><FormLabel>Person in Charge</FormLabel><FormControl><Input placeholder="Name of HOD/Dean" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="costAccName" render={({ field }) => (
                            <FormItem><FormLabel>Accountant Name</FormLabel><FormControl><Input placeholder="Name of Accountant" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="costAccNo" render={({ field }) => (
                        <FormItem><FormLabel>Account Number</FormLabel><FormControl><Input placeholder="Enter Account Number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </AccordionContent>
            </AccordionItem>


            {/* Trip Information */}
            <AccordionItem value="trip-info">
                <AccordionTrigger className="text-xl font-semibold">Trip Information</AccordionTrigger>
                <AccordionContent className="p-4 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="destination" render={({ field }) => (
                            <FormItem><FormLabel>Destination</FormLabel><FormControl><Input placeholder="e.g., Peter Mokaba Stadium" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="estimatedDistance" render={({ field }) => (
                            <FormItem><FormLabel>Estimated Distance (KM)</FormLabel><FormControl><Input type="text" placeholder="e.g., 60" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="purpose" render={({ field }) => (
                            <FormItem><FormLabel>Purpose of Trip</FormLabel><FormControl><Input placeholder="e.g., Student Sports Trip" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="passengers" render={({ field }) => (
                            <FormItem><FormLabel>Number of Passengers</FormLabel><FormControl><div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="text" placeholder="1" {...field} className="pl-9" /></div></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid md:grid-cols-2 gap-8">
                         <FormField control={form.control} name="departDateTime" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Departure Date & Time</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /><div className="p-2 border-t"><Input type="time" value={field.value ? format(field.value, 'HH:mm') : ''} onChange={e => { const date = field.value || new Date(); const [h, m] = e.target.value.split(':'); date.setHours(parseInt(h)); date.setMinutes(parseInt(m)); field.onChange(new Date(date))}} /></div></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="returnDateTime" render={({ field }) => (
                             <FormItem className="flex flex-col"><FormLabel>Return Date & Time</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /><div className="p-2 border-t"><Input type="time" value={field.value ? format(field.value, 'HH:mm') : ''} onChange={e => { const date = field.value || new Date(); const [h, m] = e.target.value.split(':'); date.setHours(parseInt(h)); date.setMinutes(parseInt(m)); field.onChange(new Date(date))}}/></div></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={form.control} name="tripDescription" render={({ field }) => (
                        <FormItem><FormLabel>Trip Description</FormLabel><FormControl><Textarea placeholder="Provide a brief description of the trip..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        
        <div className="flex justify-end pt-4 gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={form.formState.isSubmitting}>Back</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit & Continue to Uploads'}
            </Button>
        </div>
      </form>
    </Form>
  )
}
