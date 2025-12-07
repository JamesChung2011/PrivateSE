"use client"

import { useUser } from "@/lib/user-context"
import { LogOut, Menu, Clock, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const getSessionDuration = () => {
    if (!user?.loginTime) return "Just now"
    const loginTime = new Date(user.loginTime)
    const currentTime = new Date()
    const durationMs = currentTime.getTime() - loginTime.getTime()
    const durationMinutes = Math.floor(durationMs / 60000)
    const durationHours = Math.floor(durationMinutes / 60)

    if (durationHours > 0) {
      return `${durationHours}h ${durationMinutes % 60}m`
    }
    return `${durationMinutes}m`
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-secondary glass">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left - Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-neutral-100 rounded-lg lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">✈</span>
            </div>
            <span className="font-semibold text-neutral-900 hidden sm:inline">Aircadium</span>
          </div>
        </div>

        {/* Center - Empty space */}
        <div className="flex-1" />

        {/* Right - User Info & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user.role}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary text-white font-semibold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-neutral-600 cursor-default">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Session: {getSessionDuration()}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/settings`)}>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}