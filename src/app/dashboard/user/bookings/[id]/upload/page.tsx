import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UploadForm } from './_components/UploadForm'
import { FilePlus } from 'lucide-react'


export default function UploadDocumentsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-3">
                <FilePlus className="size-8 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Upload Documents</h1>
            </div>
            <p className="text-lg text-muted-foreground">
                Upload required documents for your booking request <span className="font-semibold text-primary">#{params.id}</span>.
            </p>
        </div>
        
        <UploadForm bookingId={params.id} />
    </div>
  )
}
