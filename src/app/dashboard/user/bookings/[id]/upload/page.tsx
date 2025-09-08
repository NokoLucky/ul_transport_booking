import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UploadForm } from './_components/UploadForm'
import { FileCheck, FilePlus } from 'lucide-react'


export default function UploadDocumentsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <FilePlus className="size-8 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Upload Documents</h1>
            </div>
            <p className="text-lg text-muted-foreground">
                Upload required documents for your booking request <span className="font-semibold text-primary">#{params.id}</span>.
            </p>
        </div>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Required Files</CardTitle>
                <CardDescription>
                    Please upload the necessary documents below. Files are optional unless stated otherwise.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <UploadForm bookingId={params.id} />
            </CardContent>
        </Card>
    </div>
  )
}
