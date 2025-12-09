"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Lock, 
  Unlock, 
  UserCog, 
  Loader2,
  RefreshCw
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  user_id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  role: {
    name: string
    description: string | null
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (searchTerm) query.append("search", searchTerm)
      if (roleFilter && roleFilter !== "all") query.append("role", roleFilter)

      const res = await fetch(`/api/admin/users?${query.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch users")
      
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsers()
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, roleFilter])

  // Toggle User Status (Lock/Unlock)
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setUpdatingId(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (!res.ok) throw new Error("Failed to update user")

      const updatedUser = await res.json()
      
      // Update local state
      setUsers(users.map(u => 
        u.user_id === userId ? { ...u, is_active: updatedUser.is_active } : u
      ))
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update user status")
    } finally {
      setUpdatingId(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return "bg-purple-100 text-purple-800 border-purple-200"
      case 'admin': return "bg-blue-100 text-blue-800 border-blue-200"
      case 'staff': return "bg-orange-100 text-orange-800 border-orange-200"
      case 'customer': return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500 mt-1">Manage system users, roles, and access permissions</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary-dark text-white">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Stats - Calculated from real data if available, or static for now */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-neutral-900">{users.length}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-success">
            {users.filter(u => u.is_active).length}
          </p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Staff Members</p>
          <p className="text-2xl font-bold text-info">
            {users.filter(u => u.role.name === 'staff').length}
          </p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">New (This Month)</p>
          <p className="text-2xl font-bold text-primary">
            {users.filter(u => {
              const date = new Date(u.created_at)
              const now = new Date()
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input 
            type="text" 
            placeholder="Search users by name, email, or phone..." 
            className="pl-10 border-border" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-border gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Role: <span className="capitalize">{roleFilter === "all" ? "All" : roleFilter}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("admin")}>Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("staff")}>Staff</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("customer")}>Customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          size="icon"
          onClick={fetchUsers} 
          className="border-border bg-transparent"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Users Table */}
      <Card className="border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50 border-b border-border">
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading users...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.user_id} className="hover:bg-neutral-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user.avatar_url || ""} alt={user.full_name} />
                        <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">{user.full_name}</span>
                        <span className="text-xs text-neutral-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getRoleBadgeColor(user.role.name)} capitalize`}>
                      {user.role.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.is_active ? "secondary" : "destructive"} 
                      className={user.is_active ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}
                    >
                      {user.is_active ? "Active" : "Locked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500">
                    {user.phone || "—"}
                  </TableCell>
                  <TableCell className="text-neutral-500 text-sm">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.user_id)}>
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                          <UserCog className="h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => toggleUserStatus(user.user_id, user.is_active)}
                          disabled={updatingId === user.user_id}
                          className={`gap-2 ${user.is_active ? "text-red-600 focus:text-red-600" : "text-green-600 focus:text-green-600"}`}
                        >
                          {updatingId === user.user_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.is_active ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                          {user.is_active ? "Lock Account" : "Activate Account"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}