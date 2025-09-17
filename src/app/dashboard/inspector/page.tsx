
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast';
import { getInspectorBookings, updateBookingStatus } from '@/lib/services/bookings';
import { getCompletedBookingsCheckin } from '@/lib/services/completion';
import { Loader2 } from 'lucide-react';

export default function InspectorDashboard() {
    const [checkOutBookings, setCheckOutBookings] = useState<any[]>([]);
    const [checkInBookings, setCheckInBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [checkOutData, checkInData] = await Promise.all([
                    getInspectorBookings(),
                    getCompletedBookingsCheckin()
                ]);
                setCheckOutBookings(checkOutData || []);
                setCheckInBookings(checkInData || []);
                setError(null);
            } catch (err: any) {
                const errorMessage = err.message || JSON.stringify(err);
                console.error("Failed to fetch inspector data:", errorMessage);
                setError("Failed to load booking data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    
    const handleReject = async (bookingId: string) => {
        if (confirm('Are you sure you want to reject this application?')) {
            setIsSubmitting(bookingId);
            try {
                await updateBookingStatus(bookingId, 'Rejected');
                setCheckOutBookings(prev => prev.filter(b => b.id !== bookingId));
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
    };


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
                    <CardTitle className="font-headline text-3xl">Inspector Dashboard</CardTitle>
                    <CardDescription>Manage all vehicle check-outs and check-ins.</CardDescription>
                </CardHeader>
            </Card>

            <Accordion type="multiple" defaultValue={['check-out', 'check-in']} className="w-full">
                <AccordionItem value="check-out">
                    <AccordionTrigger className="text-xl font-semibold bg-muted px-6 rounded-t-lg">
                        Check Out Vehicles
                    </AccordionTrigger>
                    <AccordionContent className="p-2 md:p-4 border border-t-0 rounded-b-lg">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vehicle Requests Details</CardTitle>
                                <CardDescription>Allocate vehicles for these approved requests.</CardDescription>
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
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {checkOutBookings.length > 0 ? checkOutBookings.map((booking) => (
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
                                                <TableCell>{!booking.driver_name ? 'Required' : 'Not Required'}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button size="sm" asChild>
                                                            <Link href={`/dashboard/inspector/allocate/${booking.id}`}>Allocate</Link>
                                                        </Button>
                                                        <Button size="sm" variant="destructive" onClick={() => handleReject(booking.id)} disabled={isSubmitting === booking.id}>
                                                            {isSubmitting === booking.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center">No new check-out requests found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="check-in">
                    <AccordionTrigger className="text-xl font-semibold bg-muted px-6 rounded-t-lg">
                        Check In Vehicles
                    </AccordionTrigger>
                    <AccordionContent className="p-2 md:p-4 border border-t-0 rounded-b-lg">
                        <Card>
                             <CardHeader>
                                <CardTitle>Returned Vehicle Details</CardTitle>
                                <CardDescription>Check in vehicles that have returned from their trips.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Applicant</TableHead>
                                            <TableHead>Returned Vehicle</TableHead>
                                            <TableHead>Disk Expiry</TableHead>
                                            <TableHead>Last Mileage</TableHead>
                                            <TableHead>Driver</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {checkInBookings.length > 0 ? checkInBookings.map((comp) => (
                                            comp.booking && (
                                            <TableRow key={comp.id}>
                                                <TableCell>
                                                    <div className="font-medium">{comp.booking.user_name} {comp.booking.user_surname}</div>
                                                    <div className="text-sm text-muted-foreground">Staff: {comp.booking.user_staffno} | {comp.booking.user_mobile}</div>
                                                </TableCell>
                                                <TableCell>{comp.vehicle}</TableCell>
                                                <TableCell>{comp.disk_expiry}</TableCell>
                                                <TableCell>{comp.kms} km</TableCell>
                                                <TableCell>{comp.drivers?.name || 'Not Required'}</TableCell>
                                                <TableCell>
                                                    <Button size="sm" asChild>
                                                        <Link href={`/dashboard/inspector/checkin/${comp.id}`}>Check In</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            )
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center">No new check-in requests found.</TableCell>
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
