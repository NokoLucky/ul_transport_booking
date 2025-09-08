import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Booking } from '@/types'
import { PlusCircle } from 'lucide-react'

export default function UserDashboard() {
  const bookings: Booking[] = [
     {
      id: 'BK004',
      purpose: 'Conference Travel',
      destination: 'Johannesburg',
      user: { name: 'Current User', department: 'Physics' },
      dates: { start: new Date('2024-09-01'), end: new Date('2024-09-05') },
      status: 'Approved',
      vehicle: 'Toyota Quantum',
      driver: 'Mr. T. Maponya'
    },
    {
      id: 'BK005',
      purpose: 'Departmental Off-site',
      destination: 'Haenertsburg',
      user: { name: 'Current User', department: 'Physics' },
      dates: { start: new Date('2024-08-20'), end: new Date('2024-08-20') },
      status: 'Pending Admin',
    },
    {
      id: 'BK006',
      purpose: 'Exam Paper Collection',
      destination: 'Pretoria',
      user: { name: 'Current User', department: 'Physics' },
      dates: { start: new Date('2024-07-15'), end: new Date('2024-07-15') },
      status: 'Completed',
      vehicle: 'Toyota Corolla'
    },
  ];

  const getBadgeVariant = (status: Booking['status']): 'destructive' | 'secondary' | 'default' | 'outline' => {
    switch (status) {
        case 'Rejected': return 'destructive';
        case 'Pending Admin': return 'secondary';
        case 'Pending Inspector': return 'secondary';
        case 'Approved': return 'default';
        case 'In Progress': return 'default';
        default: return 'outline';
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">My Dashboard</h1>
     <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>
                Here are your recent and upcoming vehicle bookings.
                </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/user/bookings/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Booking
                </span>
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip Details</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="[&_td:last-child]:text-right">
                  <TableCell>
                    <div className="font-medium">{booking.destination}</div>
                    <div className="text-sm text-muted-foreground">{booking.purpose}</div>
                  </TableCell>
                  <TableCell>{`${booking.dates.start.toLocaleDateString()}`}{booking.dates.start.getTime() !== booking.dates.end.getTime() ? ` - ${booking.dates.end.toLocaleDateString()}` : ''}</TableCell>
                   <TableCell>{booking.vehicle || 'Not Assigned'}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>1-{bookings.length}</strong> of <strong>{bookings.length}</strong> bookings
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
