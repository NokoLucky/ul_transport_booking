
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ImageUp } from 'lucide-react'

export default function InspectorUploadPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-3">
                <ImageUp className="size-8 text-primary" />
                <h1 className="font-headline text-4xl font-bold">Upload Vehicle Images (Check Out)</h1>
            </div>
            <p className="text-lg text-muted-foreground">
                Upload images for the vehicle allocated to booking <span className="font-semibold text-primary">#{params.id}</span>.
            </p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Image Upload</CardTitle>
                <CardDescription>This feature is not yet implemented.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>The form to upload inspector images will be here.</p>
            </CardContent>
        </Card>
    </div>
  )
}
