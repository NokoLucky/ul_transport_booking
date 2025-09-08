'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeft, Settings, LogOut } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'

const useRole = () => {
    const pathname = usePathname();
    if (pathname.startsWith('/dashboard/admin')) return 'admin';
    if (pathname.startsWith('/dashboard/inspector')) return 'inspector';
    return 'user';
}

const userNav = [
  { href: '/dashboard/user', label: 'My Bookings' },
  { href: '/dashboard/user/bookings/new', label: 'New Booking' },
  { href: '/status', label: 'Check Status' },
];

const inspectorNav = [
  { href: '/dashboard/inspector', label: 'Inspection Queue' },
];

const adminNav = [
  { href: '/dashboard/admin', label: 'Dashboard' },
];

export function TopNav() {
  const pathname = usePathname()
  const role = useRole();

  const navItems = role === 'admin' ? adminNav : role === 'inspector' ? inspectorNav : userNav;

  return (
    <>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-auto">
            {navItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className={`transition-colors hover:text-foreground ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden ml-auto"
                >
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                     {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-4 px-2.5 transition-colors hover:text-foreground ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="#"
                         className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    </>
  )
}
