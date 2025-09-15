
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EndTripForm } from './_components/EndTripForm'
import { getOneCompletedBooking } from '@/lib/services/completion'

export default async function CompleteTripPage({ params }: { params: { id: string } }) {
  
  const allocation = await getOneCompletedBooking(params.id);

  if (!allocation) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-destructive">Invalid Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The trip completion link is either invalid or has expired. Please contact transport admin.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">End Your Trip</CardTitle>
                <CardDescription>
                    Please enter the final closing kilometers for vehicle <span className="font-semibold">{allocation.vehicle}</span> for booking <span className="font-semibold">#{allocation.booking.reference}</span>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <EndTripForm allocation={allocation} />
            </CardContent>
        </Card>
    </div>
  )
}
