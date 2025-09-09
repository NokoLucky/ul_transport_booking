
'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getStatus } from '@/lib/services/status'

type BookingResult = {
  id: string;
  user_name: string;
  user_surname: string;
  user_staffno: string;
  user_mobile: string;
  department: string;
  building: string;
  officeno: string;
  car_type: string;
  status: string;
  reference: string;
}

export default function StatusPage() {
  const [reference, setReference] = useState('')
  const [result, setResult] = useState<BookingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setIsLoading(true)

    if (reference.trim() === '') {
      setError('Please enter a reference number.')
      setIsLoading(false)
      return
    }

    try {
      const bookingData = await getStatus(reference.trim().toUpperCase());
      if (bookingData) {
        setResult(bookingData as BookingResult);
      } else {
        setError(`No booking found for reference number: ${reference}`);
      }
    } catch (err: any) {
       console.error("Status check error:", err);
       setError(err.message || `An error occurred while fetching booking status.`);
    } finally {
        setIsLoading(false)
    }
  }
  
  const getBadgeVariant = (status: string): 'destructive' | 'secondary' | 'default' | 'outline' => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('reject')) return 'destructive';
    if (lowerStatus.includes('pending')) return 'secondary';
    if (lowerStatus.includes('approve')) return 'default';
    if (lowerStatus.includes('progress')) return 'default';
    return 'outline';
  }


  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Check Booking Status</CardTitle>
          <CardDescription>Enter your booking reference number to view its current status and details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="flex items-end gap-4 mb-8">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                type="text"
                placeholder="e.g., ULTRANS..."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Searching...' : 'Check'}</Button>
            <Button asChild variant="outline">
              <Link href="/">Back</Link>
            </Button>
          </form>

          {error && <p className="text-destructive text-center">{error}</p>}

          {result && (
            <div className="w-full">
              <h4 className="text-xl font-semibold mb-4">Booking Request Details for #{result.reference}</h4>
              <hr className="mb-4" />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Vehicle Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{result.user_name} {result.user_surname}</TableCell>
                      <TableCell>{result.department}</TableCell>
                      <TableCell>{result.car_type}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(result.status)}>{result.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" className="p-0 h-auto text-destructive" onClick={() => alert('Cancel booking functionality not yet implemented.')}>
                          Cancel Booking
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
