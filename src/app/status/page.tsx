
'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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
  driver_required: 'Yes' | 'No';
  status: string;
}

export default function StatusPage() {
  const [reference, setReference] = useState('')
  const [result, setResult] = useState<BookingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (reference.trim() === '') {
      setError('Please enter a reference number.')
      return
    }

    // This is mock data. In a real application, you would fetch this from your backend.
    const mockData: { [key: string]: BookingResult } = {
      'ULTRANS69904': {
        id: 'ULTRANS69904',
        user_name: 'John',
        user_surname: 'Doe',
        user_staffno: '12345',
        user_mobile: '0812345678',
        department: 'Computer Science',
        building: 'New R-Block',
        officeno: '1024',
        car_type: 'SEDAN',
        driver_required: 'Yes',
        status: 'Pending Admin',
      },
      'ULTRANS12345': {
        id: 'ULTRANS12345',
        user_name: 'Jane',
        user_surname: 'Smith',
        user_staffno: '54321',
        user_mobile: '0823456789',
        department: 'Sports Admin',
        building: 'Sports Complex',
        officeno: 'G01',
        car_type: '22 SEATERS',
        driver_required: 'No',
        status: 'Pending Inspector',
      },
    }

    if (mockData[reference.toUpperCase()]) {
      setResult(mockData[reference.toUpperCase()]);
    } else {
      setError(`No booking found for reference number: ${reference}`);
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
                placeholder="e.g., ULTRANS69904"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <Button type="submit">Check</Button>
            <Button asChild variant="outline">
              <Link href="/">Back</Link>
            </Button>
          </form>

          {error && <p className="text-destructive text-center">{error}</p>}

          {result && (
            <div className="w-full">
              <h4 className="text-xl font-semibold mb-4">Vehicle Request Details</h4>
              <hr className="mb-4" />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>First Name</TableHead>
                      <TableHead>Surname</TableHead>
                      <TableHead>Staff No.</TableHead>
                      <TableHead>Mobile No.</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Office No.</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Driver Req.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{result.user_name}</TableCell>
                      <TableCell>{result.user_surname}</TableCell>
                      <TableCell>{result.user_staffno}</TableCell>
                      <TableCell>{result.user_mobile}</TableCell>
                      <TableCell>{result.department}</TableCell>
                      <TableCell>{result.building}</TableCell>
                      <TableCell>{result.officeno}</TableCell>
                      <TableCell>{result.car_type}</TableCell>
                      <TableCell>{result.driver_required}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(result.status)}>{result.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="link" className="p-0 h-auto text-destructive" onClick={() => alert('Booking cancellation action!')}>
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
