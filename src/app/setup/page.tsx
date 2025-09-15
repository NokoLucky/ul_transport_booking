
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SetupForm } from './_components/SetupForm'
import { Users } from 'lucide-react'

export default function SetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-lg">
            <CardHeader>
                 <div className="flex items-center gap-3 mb-4">
                    <Users className="size-8 text-primary" />
                    <CardTitle className="font-headline text-3xl">System User Setup</CardTitle>
                </div>
                <CardDescription>
                    Create new Admin or Inspector accounts. This page should only be accessible to authorized management.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SetupForm />
            </CardContent>
        </Card>
    </div>
  )
}
