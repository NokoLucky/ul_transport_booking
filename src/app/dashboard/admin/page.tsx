
'use client';

import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
import { Button } from '@/components/ui/button'
import { getBookings } from '@/lib/services/bookings';
import { getCompletedBookings } from '@/lib/services/completion';

// A helper function to extract filename from a URL
const getFileName = (url: string | null | undefined): string => {
    if (!url) return '';
    try {
        const path = new URL(url).pathname;
        const parts = path.split('/');
        return decodeURIComponent(parts[parts.length - 1] || '');
    } catch (e) {
        console.error("Failed to parse URL for filename:", url, e);
        return '';
    }
};

export default function AdminDashboard() {
  const [newBookings, setNewBookings] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [newBookingsData, completedBookingsData] = await Promise.all([
          getBookings(),
          getCompletedBookings()
        ]);
        setNewBookings(newBookingsData || []);
        setCompletedBookings(completedBookingsData || []);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.message || JSON.stringify(err);
        console.error("Failed to fetch dashboard data:", errorMessage);
        setError("Failed to load booking data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
      return <div className="text-center p-8">Loading dashboard...</div>
  }
  if (error) {
      return <div className="text-center p-8 text-destructive">{error}</div>
  }

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
              <CardTitle className="font-headline text-3xl">Administrator Dashboard</CardTitle>
              <CardDescription>Manage all transport booking requests and approvals.</CardDescription>
          </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="new-applications">
        <AccordionItem value="new-applications">
          <AccordionTrigger className="text-xl font-semibold bg-muted px-6 rounded-t-lg">
            New Booking Applications
          </AccordionTrigger>
          <AccordionContent className="p-2 md:p-4 border border-t-0 rounded-b-lg">
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Requests Details</CardTitle>
                    <CardDescription>Review new applications and attached documents before proceeding.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead>Files</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {newBookings.length > 0 ? newBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="font-medium">{booking.user_name} {booking.user_surname}</div>
                                    <div className="text-sm text-muted-foreground">Staff: {booking.user_staffno}</div>
                                </TableCell>
                                <TableCell>{booking.user_mobile}</TableCell>
                                 <TableCell>
                                    <div className="font-medium">{booking.department}</div>
                                    <div className="text-sm text-muted-foreground">{booking.building} - {booking.officeno}</div>
                                </TableCell>
                                <TableCell>{booking.car_type}</TableCell>
                                <TableCell>{!booking.driver_name ? 'Required' : 'Provided'}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {booking.uploads?.[0]?.leave_form && <a href={booking.uploads[0].leave_form} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">{getFileName(booking.uploads[0].leave_form) || 'Leave Form'}</a>}
                                        {booking.uploads?.[0]?.passengers && <a href={booking.uploads[0].passengers} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">{getFileName(booking.uploads[0].passengers) || 'Passengers List'}</a>}
                                        {booking.uploads?.[0]?.drivers && <a href={booking.uploads[0].drivers} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">{getFileName(booking.uploads[0].drivers) || 'Driver\'s License'}</a>}
                                        {(!booking.uploads || Object.values(booking.uploads[0] || {}).every(v => !v)) && <span className="text-xs text-muted-foreground">No files</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => alert('Proceeding to check availability...')}>Check Availability</Button>
                                        <Button size="sm" variant="destructive" onClick={() => confirm('Are you sure you want to reject this application?')}>Reject</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">No new applications found.</TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="completed-applications">
          <AccordionTrigger className="text-xl font-semibold bg-muted px-6 rounded-t-lg">
            Inspector Completed Applications
          </AccordionTrigger>
          <AccordionContent className="p-2 md:p-4 border border-t-0 rounded-b-lg">
             <Card>
                <CardHeader>
                    <CardTitle>Awaiting Final Approval</CardTitle>
                    <CardDescription>These requests have been reviewed by an inspector. Send the final confirmation to the user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Client Details</TableHead>
                            <TableHead>Vehicle Details</TableHead>
                            <TableHead>Assigned Driver</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {completedBookings.length > 0 ? completedBookings.map((comp) => (
                           <TableRow key={comp.id}>
                               <TableCell>
                                    <div className="font-medium">{comp.booking.user_name} {comp.booking.user_surname}</div>
                                    <div className="text-sm text-muted-foreground">Staff: {comp.booking.user_staffno} | {comp.booking.user_mobile}</div>
                               </TableCell>
                               <TableCell>
                                    <div className="font-medium">{comp.vehicle} ({comp.kms} km)</div>
                                    <div className="text-sm text-muted-foreground">Fuel: {comp.fuel} | Disk Expiry: {comp.disk_expiry}</div>
                               </TableCell>
                               <TableCell>{comp.drivers?.name || 'Not Required'}</TableCell>
                               <TableCell>
                                   <Button size="sm" onClick={() => alert('Sending confirmation...')}>Send Confirmation</Button>
                               </TableCell>
                           </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No inspector-completed applications found.</TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
