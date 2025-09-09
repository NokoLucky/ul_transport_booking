import { TopNav } from "@/components/dashboard/TopNav"
import { UserNav } from "@/components/dashboard/UserNav"
import { Bus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="min-h-screen w-full flex flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-6">
            <Link href="/" className="flex items-center gap-2" title="University Of Limpopo Transport Booking System Home">
                <Bus className="size-8 text-primary" />
                <h1 className="text-lg font-semibold font-headline hidden sm:block">UL Transport Booking</h1>
            </Link>

            <TopNav />
            
            <div className="ml-auto flex items-center gap-4">
                <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-muted/40">
            {children}
          </main>
      </div>
  )
}
