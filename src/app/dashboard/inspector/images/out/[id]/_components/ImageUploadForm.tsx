
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { addInspectorFiles } from '@/lib/services/uploads'
import { FileUp, ImagePlus, X } from 'lucide-react'

type FilePreviewProps = {
    file: File | null;
    onClear: () => void;
}

const FilePreview = ({ file, onClear }: FilePreviewProps) => {
    if (!file) return null;
    return (
        <div className="relative mt-2">
            <Image
                src={URL.createObjectURL(file)}
                alt="Selected preview"
                width={100}
                height={100}
                className="rounded-md object-cover w-full h-24"
            />
            <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={onClear}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}


type ImageUploadSlotProps = {
    id: string;
    title: string;
    file: File | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
}

const ImageUploadSlot = ({ id, title, file, onFileChange, onClear }: ImageUploadSlotProps) => (
    <div className="p-4 border rounded-lg flex flex-col justify-center items-center text-center">
        <Label htmlFor={id} className="cursor-pointer w-full">
            <div className="flex flex-col items-center justify-center space-y-2">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <p className="font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">Click to choose file</p>
                <Input id={id} name={id} type="file" className="hidden" onChange={onFileChange} accept=".png,.jpeg,.gif,.jpg" />
            </div>
        </Label>
        {file && <FilePreview file={file} onClear={onClear} />}
    </div>
);


export function ImageUploadForm({ bookingId }: { bookingId: string }) {
    const router = useRouter()
    const { toast } = useToast()
    const [files, setFiles] = useState<(File | null)[]>(Array(8).fill(null));
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = [...files];
            newFiles[index] = e.target.files[0];
            setFiles(newFiles);
        }
    };
    
    const handleClearFile = (index: number) => {
        const newFiles = [...files];
        newFiles[index] = null;
        setFiles(newFiles);
    };

    const uploadFile = async (file: File | null, bookingId: string) => {
        if (!file) return null;
        const filePath = `inspector/${bookingId}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('uploads').upload(filePath, file);
        if (error) {
            console.error('Error uploading file:', file.name, error);
            throw new Error(`Upload failed for ${file.name}: ${error.message}`);
        }
        const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        
        try {
            const uploadPromises = files.map(file => uploadFile(file, bookingId));
            const uploadedUrls = await Promise.all(uploadPromises);

            await addInspectorFiles(bookingId, uploadedUrls, 'Check Out');
            
            toast({
                title: "Images Uploaded Successfully!",
                description: "The vehicle check-out process is complete.",
            });

            router.push('/dashboard/inspector');
        } catch (error: any) {
            console.error("Image upload error:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "An unexpected error occurred while uploading images.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                    <ImageUploadSlot
                        key={index}
                        id={`pic${index + 1}`}
                        title={`Picture ${index + 1}`}
                        file={file}
                        onFileChange={(e) => handleFileChange(e, index)}
                        onClear={() => handleClearFile(index)}
                    />
                ))}
            </div>
             <Button type="submit" className="w-full" disabled={isUploading || files.every(f => f === null)}>
                <FileUp className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Choosen Pictures'}
            </Button>
        </form>
    )
}
