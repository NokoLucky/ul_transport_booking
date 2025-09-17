
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUp, FileCheck2, FileText } from 'lucide-react'
import { sendBookingConfirmation } from '@/ai/flows/send-booking-confirmation-flow'
import { addBookingFiles } from '@/lib/services/uploads'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getOneBooking } from '@/lib/services/bookings'
import { Separator } from '@/components/ui/separator'

const supabase = getSupabaseClient();

type FileUploadRowProps = {
    title: string;
    fileId: string;
    fileName: string | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadRow = ({ title, fileId, fileName, handleFileChange }: FileUploadRowProps) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <div>
                <p className="font-semibold">{title}</p>
                {fileName ? (
                     <div className="flex items-center gap-2 text-sm text-green-600">
                        <FileCheck2 className="h-4 w-4" />
                        <span>{fileName}</span>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Supported: PDF, DOC, DOCX</p>
                )}
            </div>
        </div>
        <Label htmlFor={fileId} className="shrink-0 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md cursor-pointer hover:bg-secondary/80 text-xs font-medium">
            Choose File
        </Label>
        <Input id={fileId} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
    </div>
);


export function UploadForm({ bookingId }: { bookingId: string }) {
    const router = useRouter()
    const { toast } = useToast()
    
    // In a real app, you would fetch the booking details to determine which documents are required.
    const hasPassengers = true; // This would also come from booking details
    
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        leave: null,
        passengers: null,
        driversLicense: null,
    });
     const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files: inputFiles } = e.target;
        if (inputFiles && inputFiles.length > 0) {
            setFiles(prev => ({ ...prev, [id]: inputFiles[0] }));
        }
    };
    
    const uploadFile = async (file: File, bookingId: string) => {
        const filePath = `${bookingId}/${file.name}`;
        const { error } = await supabase.storage.from('uploads').upload(filePath, file);
        if (error) {
            console.error('Error uploading file:', file.name, error);
            // Add a more descriptive error for bucket not found
            if (error.message.includes('Bucket not found')) {
                 throw new Error('Upload failed: The storage bucket was not found. Please ensure a public "uploads" bucket exists in your Supabase project.');
            }
            throw error;
        }
        const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
        return data.publicUrl;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        
        try {
            const uploadPromises: Promise<string | null>[] = [
                files.leave ? uploadFile(files.leave, bookingId) : Promise.resolve(null),
                files.passengers ? uploadFile(files.passengers, bookingId) : Promise.resolve(null),
                files.driversLicense ? uploadFile(files.driversLicense, bookingId) : Promise.resolve(null),
            ];

            const [leaveUrl, passengersUrl, driversLicenseUrl] = await Promise.all(uploadPromises);

            await addBookingFiles(bookingId, leaveUrl, passengersUrl, driversLicenseUrl);

            const bookingDetails = await getOneBooking(bookingId);
            if(!bookingDetails) throw new Error('Could not retrieve booking details.');
            
            await sendBookingConfirmation({
                name: bookingDetails.user_name || 'Valued User',
                email: bookingDetails.user_email || 'user@limpopo.ac.za',
                reference: bookingDetails.reference,
            });
            
            toast({
                title: "Application Sent!",
                description: "Your booking request has been submitted. Please check your email for confirmation.",
            })
            router.push('/status')

        } catch (error: any) {
            console.error("Upload process error:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "There was an error uploading your files. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Upload Required Documents</CardTitle>
                    <CardDescription>Attach the necessary files for your booking request. All uploads will be finalized upon submission.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FileUploadRow 
                        title="Leave of Absence (if employee)"
                        fileId="leave"
                        fileName={files.leave?.name || null}
                        handleFileChange={handleFileChange}
                    />
                    
                    {hasPassengers && (
                       <FileUploadRow 
                            title="List of Passengers (if any)"
                            fileId="passengers"
                            fileName={files.passengers?.name || null}
                            handleFileChange={handleFileChange}
                        />
                    )}

                    <FileUploadRow 
                        title="Driver's License (if own driver)"
                        fileId="driversLicense"
                        fileName={files.driversLicense?.name || null}
                        handleFileChange={handleFileChange}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Complete Booking & Upload Files'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
