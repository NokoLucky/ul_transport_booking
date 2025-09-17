
'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"

const useRole = () => {
    const pathname = usePathname();
    if (pathname.startsWith('/dashboard/admin')) return 'Admin';
    if (pathname.startsWith('/dashboard/inspector')) return 'Inspector';
    return 'User';
}

export function UserNav() {
  const role = useRole();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://picsum.photos/100" data-ai-hint="profile person" alt="User avatar" />
            <AvatarFallback>UL</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">UL {role}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {role.toLowerCase()}@limpopo.ac.za
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/login">
          <DropdownMenuItem>
              Log out
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
