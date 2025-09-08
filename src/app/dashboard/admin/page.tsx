import { Activity, CarFront, ClipboardCheck, Users, MoreHorizontal } from 'lucide-react'
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

import type { Booking } from '@/types'

export default function AdminDashboard() {
  const bookings: Booking[] = [
    {
      id: 'BK001',
      purpose: 'Faculty Retreat',
      destination: 'Zebula Lodge',
      user: { name: 'Dr. John Doe', department: 'Computer Science' },
      dates: { start: new Date('2024-08-10'), end: new Date('2024-08-12') },
      status: 'Pending Admin',
    },
    {
      id: 'BK002',
      purpose: 'Student Sports Trip',
      destination: 'Peter Mokaba Stadium',
      user: { name: 'Mrs. Jane Smith', department: 'Sports Admin' },
      dates: { start: new Date('2024-08-15'), end: new Date('2024-08-15') },
      status: 'Pending Inspector',
    },
    {
      id: 'BK003',
      purpose: 'Research Material Collection',
      destination: 'Polokwane',
      user: { name: 'Prof. Emily White', department: 'Chemistry' },
      dates: { start: new Date('2024-08-05'), end: new Date('2024-08-05') },
      status: 'Approved',
    },
     {
      id: 'BK004',
      purpose: 'Guest Lecture Transport',
      destination: 'Campus',
      user: { name: 'Admin Office', department: 'Events' },
      dates: { start: new Date('2024-08-06'), end: new Date('2024-08-06') },
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Available</CardTitle>
            <CarFront className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 / 45</div>
            <p className="text-xs text-muted-foreground">71% utilization</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+5 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Booking Requests</CardTitle>
          <CardDescription>Review and manage incoming vehicle requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Trip Details</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
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
                          <DropdownMenuItem>Assign to Inspector</DropdownMenuItem>
                          <DropdownMenuItem>Allocate Vehicle</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Reject Booking</DropdownMenuItem>
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
