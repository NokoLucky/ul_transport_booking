import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Booking } from '@/types'

export default function UserDashboard() {
  const bookings: Booking[] = [
    {
      id: 'BK005',
      purpose: 'Official Meeting',
      destination: 'Department of Education',
      user: { name: 'You', department: 'Computer Science' },
      dates: { start: new Date('2024-08-20'), end: new Date('2024-08-20') },
      status: 'Pending Admin',
    },
    {
      id: 'BK006',
      purpose: 'Attend Workshop',
      destination: 'Tzaneen',
      user: { name: 'You', department: 'Computer Science' },
      dates: { start: new Date('2024-07-11'), end: new Date('2024-07-12') },
      status: 'Completed',
    },
  ];

    const getBadgeVariant = (status: Booking['status']): 'destructive' | 'secondary' | 'default' | 'outline' => {
        switch (status) {
            case 'Pending Admin': return 'destructive';
            case 'Pending Inspector': return 'secondary';
            case 'Approved': return 'default';
            default: return 'outline';
        }
    }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">My Bookings</h1>
                <p className="text-muted-foreground">View and manage your past and present booking requests.</p>
            </div>
            <Button asChild>
                <Link href="/dashboard/user/bookings/new">New Booking</Link>
            </Button>
       </div>
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>A list of all your vehicle booking requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.destination}</TableCell>
                   <TableCell>{booking.purpose}</TableCell>
                  <TableCell>{`${booking.dates.start.toLocaleDateString()} - ${booking.dates.end.toLocaleDateString()}`}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                   <TableCell>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Check Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Cancel Booking</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
