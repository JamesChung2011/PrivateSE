"use client"

import { useUser } from "@/lib/user-context"
import { LogOut, Menu, Clock, Settings, Bell, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface NavbarProps {
  onMenuClick?: () => void
}

interface Notification {
  notification_id: number
  message: string | null
  is_read: boolean | null
  sent_at: string | null
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notification_id: 1,
    message: "Your flight AA100 is confirmed for tomorrow.",
    is_read: false,
    sent_at: new Date().toISOString(),
  },
  {
    notification_id: 2,
    message: "Gate change: Flight DL300 now departs from Gate B12.",
    is_read: false,
    sent_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    notification_id: 3,
    message: "A new refund request needs your review.",
    is_read: true,
    sent_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
]

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useUser()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [unreadCount, setUnreadCount] = useState(
    MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length
  )
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const fetchNotifications = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`/api/notifications?mock=true`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
      } else {
        setNotifications(MOCK_NOTIFICATIONS)
        setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length)
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error)
      setNotifications(MOCK_NOTIFICATIONS)
      setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [user?.id])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleLogout = () => {
    logout()
  }

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))

    try {
      await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
    } catch (error) {
      console.error("Failed to mark as read")
    }
  }

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    
    return date.toLocaleDateString()
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-neutral-100 rounded-lg lg:hidden transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">✈</span>
            </div>
            <span className="font-semibold text-neutral-900 hidden sm:inline text-lg tracking-tight">Aircadium</span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 sm:gap-4 relative">
          {user && (
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-neutral-500 hover:text-neutral-900 transition-colors"
                onClick={() => setOpen((prev) => !prev)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
                )}
              </Button>
              {open && (
                <Card className="absolute right-0 mt-2 w-80 p-0 overflow-hidden shadow-lg border border-border bg-white z-50">
                  <div className="p-3 border-b border-border bg-neutral-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-neutral-900">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                          {unreadCount} new
                        </Badge>
                      )}
                      <button
                        onClick={() => setOpen(false)}
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-500"
                        aria-label="Close notifications"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <ScrollArea className="h-[320px]">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-neutral-400">
                        <Bell className="w-10 h-10 mb-3 opacity-20" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="flex flex-col divide-y divide-border/50">
                        {notifications.map((item) => (
                          <button
                            key={item.notification_id}
                            className={`p-3 text-left transition-colors flex gap-3 hover:bg-neutral-50 w-full ${!item.is_read ? "bg-blue-50/40" : "bg-white"}`}
                            onClick={() => !item.is_read && handleMarkAsRead(item.notification_id)}
                          >
                            <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!item.is_read ? "bg-blue-500" : "bg-transparent"}`} />
                            <div className="flex-1 space-y-1">
                              <p className={`text-sm ${!item.is_read ? "font-semibold text-neutral-900" : "text-neutral-700"}`}>
                                System Notification
                              </p>
                              <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                                {item.message || "No content"}
                              </p>
                              <p className="text-[10px] text-neutral-400 pt-1">
                                {formatTime(item.sent_at)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </Card>
              )}
            </div>
          )}

          {user && (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-medium text-neutral-900 leading-none mb-1">{user.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{user.role}</p>
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  className="rounded-full p-0 focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => router.push(`/dashboard/settings`)}
                >
                  <Avatar className="h-9 w-9 border border-border hover:border-primary/50 transition-colors">
                    <AvatarImage src={user.avatar || ""} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
