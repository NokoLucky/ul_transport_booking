import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Bus } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="/home-background.jpg"
        alt="Background image of a university vehicle"
        fill
        className="object-cover"
        data-ai-hint="bus vehicle"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center text-white">
        <div className="flex items-center gap-4">
          <Bus className="h-16 w-16 text-accent" />
          <h1 className="font-headline text-5xl font-bold tracking-tight md:text-7xl">
            University Of Limpopo Transport Booking System
          </h1>
        </div>
        <p className="mt-4 max-w-2xl font-body text-lg text-gray-200 md:text-xl">
          University of Limpopo's Premier Transport Solution. Effortless booking and management for all your university travel needs.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/dashboard/user/bookings/new">Book Your Ride</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
            <Link href="/status">Check Status</Link>
          </Button>
        </div>
         <div className="absolute bottom-16">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
            <Link href="/login">Staff Login</Link>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-0 z-10 w-full p-4 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} University of Limpopo. All rights reserved.</p>
      </footer>
    </div>
  )
}
