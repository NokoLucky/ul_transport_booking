
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ImageUp } from 'lucide-react'
import { ImageUploadForm } from './_components/ImageUploadForm'

export default function InspectorCheckinUploadPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-3">
                <ImageUp className="size-8 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Upload Vehicle Images (Check In)</h1>
            </div>
            <p className="text-lg text-muted-foreground">
                Upload up to 8 images for the vehicle returned from booking <span className="font-semibold text-primary">#{params.id}</span>.
            </p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Return Image Upload</CardTitle>
                <CardDescription>Select all required images of the returned vehicle before uploading. Supported formats: PNG, JPEG, GIF.</CardDescription>
            </CardHeader>
            <CardContent>
                <ImageUploadForm bookingId={params.id} />
            </CardContent>
        </Card>
    </div>
  )
}
