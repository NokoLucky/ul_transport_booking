
'use client'

import { useState } from 'react'
import { Bus, Loader2 } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import { adminLogin, inspectorLogin } from '@/lib/services/auth'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginRole, setLoginRole] = useState<'admin' | 'inspector' | null>(null)

  const handleLogin = async (role: 'admin' | 'inspector') => {
    setIsLoading(true)
    setLoginRole(role)
    try {
      let success = false;
      if (role === 'admin') {
        success = await adminLogin(email, password)
      } else {
        success = await inspectorLogin(email, password)
      }

      if (success) {
        toast({
          title: 'Login Successful',
          description: `Redirecting to ${role} dashboard...`,
        })
        router.push(`/dashboard/${role}`)
      } else {
        throw new Error('Invalid username or password.')
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setLoginRole(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex flex-col items-center gap-2 justify-center mb-4">
                <Bus className="h-12 w-12 text-primary" />
                <h1 className="font-headline text-2xl font-bold">
                    University Of Limpopo Transport Booking System
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
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="staff.username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
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
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => handleLogin('admin')} className="w-full" disabled={isLoading}>
                    {isLoading && loginRole === 'admin' ? <Loader2 className="animate-spin" /> : 'Login as Admin'}
                </Button>
                <Button onClick={() => handleLogin('inspector')} className="w-full" disabled={isLoading}>
                    {isLoading && loginRole === 'inspector' ? <Loader2 className="animate-spin" /> : 'Login as Inspector'}
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
