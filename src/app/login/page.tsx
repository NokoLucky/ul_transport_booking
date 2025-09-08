
'use client'

import { Bus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex items-center gap-4 justify-center mb-4">
                <Bus className="h-12 w-12 text-primary" />
                <h1 className="font-headline text-4xl font-bold">
                    LimpopoRide
                </h1>
            </div>
          <CardTitle className="text-2xl">Staff Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin or inspector dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="staff@ul.ac.za"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => router.push('/dashboard/admin')} className="w-full">
                    Login as Admin
                </Button>
                <Button onClick={() => router.push('/dashboard/inspector')} className="w-full">
                    Login as Inspector
                </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Not a staff member?{' '}
            <Link href="/" className="underline">
              Go to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
