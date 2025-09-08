'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bus, LayoutDashboard, ClipboardList, CarFront, Users, Wrench, Settings, LogOut } from 'lucide-react'
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

const useRole = () => {
    const pathname = usePathname();
    if (pathname.startsWith('/dashboard/admin')) return 'admin';
    if (pathname.startsWith('/dashboard/inspector')) return 'inspector';
    // Default to user for any other path including `/dashboard/user/*`
    return 'user';
}

const userNav = [
  { href: '/dashboard/user', label: 'My Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/user/bookings/new', label: 'New Booking', icon: ClipboardList },
];

const inspectorNav = [
  { href: '/dashboard/inspector', label: 'Inspection Queue', icon: LayoutDashboard },
];

const adminNav = [
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  // These would be real pages in a full app
  // { href: '/dashboard/admin/bookings', label: 'All Bookings', icon: ClipboardList },
  // { href: '/dashboard/admin/fleet', label: 'Fleet Management', icon: CarFront },
  // { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
  // { href: '/dashboard/admin/drivers', label: 'Driver Management', icon: Wrench },
];

export function AppSidebar() {
  const pathname = usePathname()
  const role = useRole();

  const navItems = role === 'admin' ? adminNav : role === 'inspector' ? inspectorNav : userNav;

  return (
    <>
      <SidebarHeader className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2" title="LimpopoRide Home">
          <Bus className="size-8 text-primary" />
          <h1 className="text-2xl font-semibold font-headline">LimpopoRide</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                            isActive={pathname === item.href}
                            className="w-full justify-start text-base h-10"
                            tooltip={item.label}
                        >
                            <item.icon className="size-5 mr-3 shrink-0" />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className='my-0' />
      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start text-base h-10" tooltip="Settings">
                    <Settings className="size-5 mr-3 shrink-0" />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <Link href="/login">
                    <SidebarMenuButton className="w-full justify-start text-base h-10" tooltip="Logout">
                        <LogOut className="size-5 mr-3 shrink-0" />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
