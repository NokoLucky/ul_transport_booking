
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AllocationForm } from './_components/AllocationForm'
import { getInspectorOneBooking } from '@/lib/services/bookings'
import { Car } from 'lucide-react'

export default async function AllocateVehiclePage({ params }: { params: { id: string } }) {
  const bookingDetails = await getInspectorOneBooking(params.id);

  if (!bookingDetails) {
    return <div className="text-center p-8 text-destructive">Booking not found.</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-2 text-center">
             <div className="flex items-center justify-center gap-3">
                <Car className="size-8 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Vehicle Allocation & Quality Control</h1>
            </div>
             <p className="text-lg text-muted-foreground">
                Allocate a vehicle for booking <span className="font-semibold text-primary">#{bookingDetails.reference}</span> and complete the quality check.
            </p>
        </div>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Inspection Checklist</CardTitle>
                <CardDescription>
                    Select a vehicle and complete the form below. All checklist items are required.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AllocationForm booking={bookingDetails} />
            </CardContent>
        </Card>
    </div>
  )
}
