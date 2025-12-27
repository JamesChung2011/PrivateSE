"use client"

import { useUser } from "@/lib/user-context"
import { useRouter, usePathname } from "next/navigation"
import { X } from "lucide-react"
import { BarChart3, Plane, Users, Ticket, Settings, FileText, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const roleNavigation = {
  owner: [
    { label: "Dashboard", href: "/dashboard/owner", icon: BarChart3 },
    { label: "Flights", href: "/dashboard/owner/flights", icon: Plane },
    { label: "Revenue", href: "/dashboard/owner/revenue", icon: DollarSign },
    { label: "Staff", href: "/dashboard/owner/staff", icon: Users },
  ],
  staff: [
    { label: "Dashboard", href: "/dashboard/staff", icon: BarChart3 },
    { label: "Operations", href: "/dashboard/staff/operations", icon: Clock },
    { label: "Schedules", href: "/dashboard/staff/schedules", icon: Plane },
    { label: "Reports", href: "/dashboard/staff/reports", icon: FileText },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: BarChart3 },
    { label: "System", href: "/dashboard/admin/system", icon: Settings },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Logs", href: "/dashboard/admin/logs", icon: FileText },
  ],
  customer: [
    { label: "Dashboard", href: "/dashboard/customer", icon: BarChart3 },
    { label: "Book Flight", href: "/dashboard/customer/book", icon: Ticket },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: Plane },
    { label: "Support", href: "/dashboard/customer/support", icon: Ticket },
  ],
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  if (!user) return null

  const navigation = roleNavigation[user.role] || []

  // pick the most specific match so only one item is highlighted
  const activeItem = navigation.reduce<{ href: string } | null>((best, item) => {
    const exact = pathname === item.href
    const nested = pathname.startsWith(item.href + "/")
    if (exact || nested) {
      if (!best || item.href.length > best.href.length) return { href: item.href }
    }
    return best
  }, null)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-secondary border-r border-border pt-20 transition-transform duration-300 z-40 lg:relative lg:translate-x-0 lg:pt-0 lg:top-16",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close button on mobile */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-lg lg:hidden">
          <X className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="flex flex-col p-4 gap-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeItem?.href === item.href
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href)
                  onClose?.()
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive ? "bg-primary text-white" : "text-neutral-700 hover:bg-neutral-100",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-neutral-50">
          <p className="text-xs text-neutral-500">Version 1.0</p>
          <p className="text-xs text-neutral-500 mt-1">© 2025 FlightHub</p>
        </div>
      </aside>
    </>
  )
}
