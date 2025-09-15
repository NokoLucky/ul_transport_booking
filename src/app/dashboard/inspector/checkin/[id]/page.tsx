
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckinForm } from './_components/CheckinForm'
import { getOneCompletedBooking } from '@/lib/services/completion'
import { getDriverKms } from '@/lib/services/logbook'
import { Car } from 'lucide-react'

export default async function CheckinVehiclePage({ params }: { params: { id: string } }) {
  const allocationDetails = await getOneCompletedBooking(params.id);

  if (!allocationDetails) {
    return <div className="text-center p-8 text-destructive">Allocation details not found.</div>
  }

  const logbook = await getDriverKms(allocationDetails.booking.id);

  if (!logbook) {
    return <div className="text-center p-8 text-destructive">Logbook entry not found for this booking.</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
        <div className="space-y-2 text-center">
             <div className="flex items-center justify-center gap-3">
                <Car className="size-8 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Vehicle Check-In & Quality Control</h1>
            </div>
             <p className="text-lg text-muted-foreground">
                Perform check-in for vehicle <span className="font-semibold text-primary">{allocationDetails.vehicle}</span> from booking <span className="font-semibold text-primary">#{allocationDetails.booking.reference}</span>.
            </p>
        </div>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Return Inspection Checklist</CardTitle>
                <CardDescription>
                    Confirm the closing kilometers and complete the vehicle inspection form below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CheckinForm allocation={allocationDetails} logbook={logbook} />
            </CardContent>
        </Card>
    </div>
  )
}
