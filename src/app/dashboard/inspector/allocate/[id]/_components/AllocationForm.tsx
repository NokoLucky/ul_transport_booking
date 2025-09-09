
'use client'

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { getVehicles, getDrivers, updateVehicleStatus } from "@/lib/services/vehicles"
import { updateBookingStatus } from "@/lib/services/bookings"
import { allocateVehicle, updateDriverStatus } from "@/lib/services/allocation"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
  // Vehicle Details
  vehicle: z.string().min(1, "Please select a vehicle."),
  kms: z.string().min(1, "KMS is required."),
  disk_expiry: z.date({ required_error: "License disk expiry date is required." }),
  condition: z.string().min(1, "Vehicle condition description is required."),

  // Checklists
  accessories: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You must select at least one accessory.",
  }),
  engine: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You must select at least one engine check item.",
  }),
  electrical: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You must select at least one electrical item.",
  }),
  interior: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You must select at least one interior item.",
  }),
  exterior: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You must select at least one exterior item.",
  }),

  // Fuel & Remarks
  fuel: z.enum(["Empty", "Quater Empty", "Half", "Quater Full", "Full"], {
    required_error: "You need to select a fuel level.",
  }),
  remarks: z.string().optional(),
});


const checklistItems = {
  accessories: ["Spare Wheel Tyre", "Life Jack/Tools", "Emegency Triangles", "Tow Bar", "Radio / CD player", "Cigarette Lighter", "Canopy", "Canopy Keys", "Fire Extinguisher"],
  engine: ["Oil Level Checked", "Radiator Full", "Water Bottle Full W/Screen Wash", "Battery", "Liquid Leakage"],
  electrical: ["Brake Lights", "Intirior Lights", "Head Lights", "Reverse Lights", "Winscreen Wipers & Wiper Fluid", "Hooter"],
  interior: ["carpets Clean", "Seats Clean", "Under The Seats Clean", "Dashboard Clean", "Windows Clean", "Rear View Mirrors", "Service Book", "E Tag"],
  exterior: ["Sub roof", "Side Mirrors", "Wheel Cabs, Mag Wheels", "Mud Flaps", "Front and Read Batch", "Flue Cap", "Front and Read Number Plate"],
};

type ChecklistSectionProps = {
    form: any;
    name: "accessories" | "engine" | "electrical" | "interior" | "exterior";
    title: string;
    items: string[];
}

const ChecklistSection = ({ form, name, title, items }: ChecklistSectionProps) => (
    <fieldset className="border p-4 rounded-lg">
        <legend className="text-lg font-semibold px-2">{title}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
            {items.map((item) => (
                <FormField
                    key={item}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(field.value?.filter((value: string) => value !== item))
                                    }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                    )}
                />
            ))}
        </div>
         <FormField
            control={form.control}
            name={name}
            render={() => <FormMessage className="mt-2" />}
        />
    </fieldset>
);


export function AllocationForm({ booking }: { booking: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kms: "",
      condition: "",
      remarks: "",
      accessories: [],
      engine: [],
      electrical: [],
      interior: [],
      exterior: [],
    },
  });

  useEffect(() => {
    async function fetchData() {
        try {
            const [vehicleData, driverData] = await Promise.all([
                getVehicles(booking.car_type),
                getDrivers()
            ]);
            setVehicles(vehicleData || []);
            setDrivers(driverData || []);
        } catch (error) {
            console.error("Failed to fetch vehicles/drivers", error);
            toast({
                title: "Error",
                description: "Could not load available vehicles or drivers.",
                variant: "destructive"
            });
        }
    }
    fetchData();
  }, [booking.car_type, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const registration = values.vehicle.split(' - ')[2]?.trim();
        if (!registration) throw new Error("Invalid vehicle selection format.");

        let assignedDriverId = null;
        if (!booking.driver_name) {
            if (drivers.length > 0) {
                 const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
                 assignedDriverId = randomDriver.id;
            } else {
                toast({ title: "No drivers available", description: "Cannot assign a driver.", variant: "destructive" });
                setIsLoading(false);
                return;
            }
        }

        const allocationData = {
            vehicle: values.vehicle,
            kms: values.kms,
            disk_expiry: format(values.disk_expiry, "yyyy-MM-dd"),
            remarks: values.remarks,
            fuel: values.fuel,
            condition: values.condition,
            accessories: JSON.stringify(values.accessories),
            engine: JSON.stringify(values.engine),
            electrical: JSON.stringify(values.electrical),
            interior: JSON.stringify(values.interior),
            exterior: JSON.stringify(values.exterior),
            booking_id: booking.id,
            driver_id: assignedDriverId,
            action: "Check Out",
        };

        await allocateVehicle(allocationData);
        await updateVehicleStatus(registration, 'Allocated');
        await updateBookingStatus(booking.id, 'Awaiting Admin Approval');
        if (assignedDriverId) {
            await updateDriverStatus(assignedDriverId, 'Assigned');
        }

        toast({
            title: "Vehicle Allocated Successfully!",
            description: "Please proceed to upload pictures of the vehicle.",
        });
        
        router.push(`/dashboard/inspector/images/out/${booking.id}`);

    } catch (error: any) {
        console.error("Allocation submission error:", error);
        toast({
            title: "Allocation Failed",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold px-2">Vehicle Details</legend>
             <div className="grid md:grid-cols-2 gap-6 p-2">
                 <FormField
                    control={form.control}
                    name="vehicle"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Choose vehicle *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a vehicle" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {vehicles.map((v) => (
                                    <SelectItem key={v.id} value={`${v.description} - ${v.registration}`}>
                                        {v.description} - {v.registration}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="kms"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>KMS *</FormLabel>
                        <FormControl><Input type="number" placeholder="Enter current mileage" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="disk_expiry"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>License Disk Expiry Date *</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Vehicle Condition *</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe the vehicle's current condition..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
        </fieldset>

        <ChecklistSection form={form} name="accessories" title="Accessories" items={checklistItems.accessories} />
        <ChecklistSection form={form} name="engine" title="Engine" items={checklistItems.engine} />
        <ChecklistSection form={form} name="electrical" title="Electrical" items={checklistItems.electrical} />
        <ChecklistSection form={form} name="interior" title="Interior" items={checklistItems.interior} />
        <ChecklistSection form={form} name="exterior" title="Exterior" items={checklistItems.exterior} />
       
        <fieldset className="border p-4 rounded-lg">
            <legend className="text-lg font-semibold px-2">Fuel Guage Reading</legend>
            <div className="p-2 space-y-4">
                <FormField
                    control={form.control}
                    name="fuel"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Fuel Guage Level *</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-wrap gap-4"
                            >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Empty" /></FormControl>
                                    <FormLabel className="font-normal">E</FormLabel>
                                </FormItem>
                                 <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Quater Empty" /></FormControl>
                                    <FormLabel className="font-normal">QE</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Half" /></FormControl>
                                    <FormLabel className="font-normal">H</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Quater Full" /></FormControl>
                                    <FormLabel className="font-normal">QF</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Full" /></FormControl>
                                    <FormLabel className="font-normal">F</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Add any additional remarks here..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </fieldset>

        <div className="flex justify-end pt-4 gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Back
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
        </div>
      </form>
    </Form>
  )
}
