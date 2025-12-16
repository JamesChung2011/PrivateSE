"use client"

import { useUser } from "@/lib/user-context"
import { LogOut, Menu, Clock, Settings, Bell, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface NavbarProps {
  onMenuClick?: () => void
}

// Interface khớp với schema của bạn
interface Notification {
  notification_id: number
  message: string | null
  is_read: boolean | null
  sent_at: string | null
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useUser()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Fetch notifications function
  const fetchNotifications = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
        // Đếm số lượng chưa đọc (is_read === false hoặc null)
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }

  // Gọi API mỗi 60 giây và khi mới load trang
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [user?.id])

  const handleLogout = () => {
    logout()
  }

  const handleMarkAsRead = async (id: number) => {
    // Cập nhật giao diện ngay lập tức (Optimistic UI)
    setNotifications(prev => prev.map(n => 
      n.notification_id === id ? { ...n, is_read: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))

    // Gọi API cập nhật
    try {
      await fetch(`/api/notifications`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
    } catch (error) {
      console.error("Failed to mark as read")
    }
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
        {/* Left - Menu & Logo */}
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

        {/* Center - Empty space */}
        <div className="flex-1" />

        {/* Right - User Info & Logout */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Notifications Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-neutral-900 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden shadow-lg border-border">
                <div className="p-3 border-b border-border bg-neutral-50/50 flex justify-between items-center">
                  <h3 className="font-semibold text-sm text-neutral-900">Notifications</h3>
                  {unreadCount > 0 && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">{unreadCount} new</Badge>}
                </div>
                <ScrollArea className="h-[350px]">
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
                          className={`p-3 text-left transition-colors flex gap-3 hover:bg-neutral-50 w-full ${!item.is_read ? 'bg-blue-50/40' : 'bg-white'}`}
                          onClick={() => !item.is_read && handleMarkAsRead(item.notification_id)}
                        >
                          <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!item.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
                          <div className="flex-1 space-y-1">
                            {/* Giả lập Title từ Message nếu schema không có title */}
                            <p className={`text-sm ${!item.is_read ? 'font-semibold text-neutral-900' : 'text-neutral-700'}`}>
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
                <div className="p-2 border-t border-border bg-neutral-50/50 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs h-8 text-primary hover:text-primary-dark hover:bg-blue-50" 
                    onClick={fetchNotifications}
                  >
                    Refresh Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user && (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-medium text-neutral-900 leading-none mb-1">{user.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{user.role}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow ring-offset-background">
                    <Avatar className="h-9 w-9 border border-border hover:border-primary/50 transition-colors">
                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
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
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/settings`)} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
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