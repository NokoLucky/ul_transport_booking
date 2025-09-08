'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bus, User, Shield, Wrench } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState('user')
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd handle authentication here.
    toast({
      title: "Login Successful",
      description: `Redirecting to ${role} dashboard...`,
    })
    // We'll just redirect based on the selected role after a short delay.
    setTimeout(() => router.push(`/dashboard/${role}`), 1000)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="https://picsum.photos/1920/1081"
        alt="Background image of a UL campus"
        fill
        className="object-cover"
        data-ai-hint="university campus"
      />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 text-foreground">
          <Bus className="h-8 w-8 text-primary" />
          <span className="font-headline text-3xl font-bold">LimpopoRide</span>
        </Link>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
            <CardDescription>Log in to manage your university transport needs.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>I am a...</Label>
                <RadioGroup defaultValue="user" className="grid grid-cols-3 gap-4" onValueChange={setRole} value={role}>
                  <div>
                    <RadioGroupItem value="user" id="user" className="peer sr-only" />
                    <Label htmlFor="user" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <User className="mb-3 h-6 w-6" />
                      User
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="inspector" id="inspector" className="peer sr-only" />
                    <Label htmlFor="inspector" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <Wrench className="mb-3 h-6 w-6" />
                      Inspector
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                    <Label htmlFor="admin" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                      <Shield className="mb-3 h-6 w-6" />
                      Admin
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email / Employee ID</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required defaultValue="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Log In</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
