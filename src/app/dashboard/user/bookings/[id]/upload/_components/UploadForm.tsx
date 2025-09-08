'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUp, FileCheck2 } from 'lucide-react'

type FileUploadCardProps = {
    title: string;
    description: string;
    fileId: string;
    fileName: string | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadCard = ({ title, description, fileId, fileName, handleFileChange }: FileUploadCardProps) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg">
                {fileName ? (
                    <div className="text-center text-green-600">
                        <FileCheck2 className="mx-auto h-12 w-12" />
                        <p className="mt-2 font-semibold">{fileName}</p>
                        <p className="text-sm text-muted-foreground">Upload successful!</p>
                    </div>
                ) : (
                    <>
                        <FileUp className="h-12 w-12 text-muted-foreground" />
                        <Label htmlFor={fileId} className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 text-sm font-medium">
                            Choose File
                        </Label>
                        <Input id={fileId} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                        <p className="mt-2 text-xs text-muted-foreground">Supported: PDF, DOC, DOCX</p>
                    </>
                )}
            </div>
        </CardContent>
    </Card>
)


export function UploadForm({ bookingId }: { bookingId: string }) {
    const router = useRouter()
    const { toast } = useToast()
    
    // In a real app, you would fetch the booking details to determine which documents are required.
    // For this demo, we'll use props or static booleans.
    const isOwnDriver = true; // This would come from booking details
    const hasPassengers = true; // This would also come from booking details
    
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        leave: null,
        passengers: null,
        driversLicense: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files: inputFiles } = e.target;
        if (inputFiles && inputFiles.length > 0) {
            setFiles(prev => ({ ...prev, [id]: inputFiles[0] }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Uploading files for booking:", bookingId, files)
        toast({
            title: "Documents Uploaded!",
            description: "Your booking request has been fully submitted for review.",
        })
        router.push('/dashboard/user')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FileUploadCard 
                    title="Leave of Absence"
                    description="Required for all employees taking official leave."
                    fileId="leave"
                    fileName={files.leave?.name || null}
                    handleFileChange={handleFileChange}
                />
                
                {hasPassengers && (
                    <FileUploadCard 
                        title="List of Passengers"
                        description="A document listing all passengers for the trip."
                        fileId="passengers"
                        fileName={files.passengers?.name || null}
                        handleFileChange={handleFileChange}
                    />
                )}

                {isOwnDriver && (
                     <FileUploadCard 
                        title="Driver's License"
                        description="A valid copy of the designated driver's license."
                        fileId="driversLicense"
                        fileName={files.driversLicense?.name || null}
                        handleFileChange={handleFileChange}
                    />
                )}
            </div>

            <div className="flex justify-end pt-4 gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Back to Booking Form</Button>
                <Button type="submit">Complete Booking</Button>
            </div>
        </form>
    )
}
