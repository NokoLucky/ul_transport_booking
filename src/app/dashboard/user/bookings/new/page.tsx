import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BookingForm } from './_components/BookingForm'
import Image from 'next/image'

export default function NewBookingPage() {
  return (
    <div className="space-y-6">
        <div className="relative h-60 w-full rounded-lg overflow-hidden">
            <Image
                src="https://picsum.photos/1200/400"
                alt="UL Fleet Vehicle"
                data-ai-hint="fleet vehicle"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
                <h1 className="font-headline text-4xl font-bold text-white">New Booking Request</h1>
                <p className="text-lg text-white/90">Request a vehicle for your official university travel.</p>
            </div>
        </div>
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle className="font-headline text-2xl">Trip Details</CardTitle>
            <CardDescription>
                Please fill out the form below to request a vehicle. All fields are required unless marked optional.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <BookingForm />
            </CardContent>
        </Card>
    </div>
  )
}

    