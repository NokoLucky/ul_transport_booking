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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

import type { Booking } from '@/types'

export default function InspectorDashboard() {
  const bookings: Booking[] = [
    {
      id: 'BK002',
      purpose: 'Student Sports Trip',
      destination: 'Peter Mokaba Stadium',
      user: { name: 'Mrs. Jane Smith', department: 'Sports Admin' },
      dates: { start: new Date('2024-08-15'), end: new Date('2024-08-15') },
      status: 'Pending Inspector',
      vehicle: '22-Seater Minibus'
    },
    {
      id: 'BK007',
      purpose: 'Geology Field Trip',
      destination: 'Magoebaskloof',
      user: { name: 'Dr. Anna Bell', department: 'Geography' },
      dates: { start: new Date('2024-08-18'), end: new Date('2024-08-19') },
      status: 'Pending Inspector',
      vehicle: '4x4 Bakkie'
    },
  ];

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader>
          <CardTitle>Awaiting Vehicle Inspection</CardTitle>
          <CardDescription>
            These bookings require your inspection for vehicle availability and condition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Trip Details</TableHead>
                <TableHead>Vehicle Requested</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.user.name}</div>
                    <div className="text-sm text-muted-foreground">{booking.user.department}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.destination}</div>
                    <div className="text-sm text-muted-foreground">{booking.purpose}</div>
                  </TableCell>
                  <TableCell>{booking.vehicle || 'N/A'}</TableCell>
                  <TableCell>{`${booking.dates.start.toLocaleDateString()} - ${booking.dates.end.toLocaleDateString()}`}</TableCell>
                  <TableCell>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Inspection Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Check Vehicle Log</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Approve Availability</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Deny Availability</DropdownMenuItem>
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
