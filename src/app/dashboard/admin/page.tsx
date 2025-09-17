
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
import { getBookings, updateBookingStatus } from '@/lib/services/bookings';
import { getCompletedBookings } from '@/lib/services/completion';
import { useToast } from '@/hooks/use-toast';
import { sendFinalConfirmation } from '@/ai/flows/send-final-confirmation-flow';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [newBookings, setNewBookings] = useState<any[]>([]);
  const [completedBookings, setCompletedBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null); // Use booking ID to track submission
  const { toast } = useToast();

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

  const handleCheckAvailability = async (bookingId: string) => {
    setIsSubmitting(bookingId);
    try {
      await updateBookingStatus(bookingId, 'Allocating');
      setNewBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast({
        title: 'Request Sent to Inspector',
        description: 'The booking is now awaiting vehicle allocation.',
      });
    } catch (error: any) {
      console.error('Failed to update booking status:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not send the request to the inspector. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(null);
    }
  };

  const handleReject = async (bookingId: string) => {
     if (confirm('Are you sure you want to reject this application?')) {
        setIsSubmitting(bookingId);
        try {
            await updateBookingStatus(bookingId, 'Rejected');
            setNewBookings((prev) => prev.filter((b) => b.id !== bookingId));
            toast({
                title: 'Booking Rejected',
                description: 'The booking request has been rejected.',
                variant: 'destructive'
            });
        } catch (error) {
             console.error('Failed to reject booking:', error);
             toast({
                title: 'Rejection Failed',
                description: 'Could not reject the booking. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(null);
        }
    }
  }

  const handleSendConfirmation = async (comp: any) => {
    setIsSubmitting(comp.id);
    try {
      const confirmationInput = {
        clientName: comp.booking.user_name,
        clientEmail: comp.booking.user_email,
        vehicleDetails: comp.vehicle,
        departDateTime: new Date(comp.booking.depart_date).toLocaleString(),
        returnDateTime: new Date(comp.booking.return_date).toLocaleString(),
        allocationId: comp.id,
        bookingId: String(comp.booking.id),
        driver: comp.drivers ? {
          name: comp.drivers.name,
          mobile: comp.drivers.cellphone,
          email: comp.drivers.email,
        } : null,
      };

      await sendFinalConfirmation(confirmationInput);

      setCompletedBookings(prev => prev.filter(c => c.id !== comp.id));
      toast({
        title: "Confirmation Sent!",
        description: "The confirmation email has been sent to the client.",
      });

    } catch (error: any) {
      console.error('Failed to send confirmation:', error);
      toast({
        title: "Confirmation Failed",
        description: 'Could not send the confirmation. Please try again.',
        variant: 'destructive'
      });
    } finally {
        setIsSubmitting(null);
    }
  }

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
                        {newBookings.length > 0 ? newBookings.map((booking) => {
                            const uploadData = booking.uploads;
                            const hasFiles = uploadData && (uploadData.leave_form || uploadData.passengers || uploadData.drivers);

                            return (
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
                                            {hasFiles ? (
                                                <>
                                                    {uploadData.leave_form ? (
                                                        <a href={uploadData.leave_form} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">Leave Form</a>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">No Leave Form</span>
                                                    )}
                                                    {uploadData.passengers ? (
                                                        <a href={uploadData.passengers} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">Passengers List</a>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">No Passengers List</span>
                                                    )}
                                                    {uploadData.drivers ? (
                                                        <a href={uploadData.drivers} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">Driver's License</a>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">No Driver's License</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No files uploaded</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleCheckAvailability(booking.id)} disabled={isSubmitting === booking.id}>
                                                {isSubmitting === booking.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Check Availability
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReject(booking.id)} disabled={isSubmitting === booking.id}>
                                                {isSubmitting === booking.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Reject
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
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
                           comp.booking && (
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
                                   <Button size="sm" onClick={() => handleSendConfirmation(comp)} disabled={isSubmitting === comp.id}>
                                     {isSubmitting === comp.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                     Send Confirmation
                                   </Button>
                               </TableCell>
                           </TableRow>
                           )
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
