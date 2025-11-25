"use client"

import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

const usersData = [
  {
    id: "U001",
    name: "Alice Johnson",
    email: "alice@flightmgmt.com",
    role: "Owner",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: "U002",
    name: "Bob Smith",
    email: "bob@flightmgmt.com",
    role: "Staff",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: "U003",
    name: "Carol White",
    email: "carol@flightmgmt.com",
    role: "Admin",
    status: "Active",
    joinDate: "2023-12-10",
  },
  {
    id: "U004",
    name: "David Brown",
    email: "david@flightmgmt.com",
    role: "Customer",
    status: "Inactive",
    joinDate: "2024-03-05",
  },
  {
    id: "U005",
    name: "Emma Davis",
    email: "emma@flightmgmt.com",
    role: "Staff",
    status: "Active",
    joinDate: "2024-01-22",
  },
]

const columns = [
  { key: "id", label: "User ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "joinDate", label: "Join Date" },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
          <p className="text-neutral-500 mt-1">Manage system users and permissions</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary-dark text-white">
          <Plus className="w-4 h-4" />
          New User
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input type="text" placeholder="Search users..." className="pl-10 border-border" />
        </div>
        <Button variant="outline" className="border-border gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-neutral-900">2,480</p>
          <p className="text-xs text-success mt-2">+12% from last month</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Active Users</p>
          <p className="text-2xl font-bold text-neutral-900">2,156</p>
          <p className="text-xs text-neutral-500 mt-2">86.9% engagement</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Inactive Users</p>
          <p className="text-2xl font-bold text-neutral-900">324</p>
          <p className="text-xs text-danger mt-2">-5% from last month</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">New This Month</p>
          <p className="text-2xl font-bold text-neutral-900">248</p>
          <p className="text-xs text-success mt-2">+18% increase</p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">All Users</h2>
          <Button variant="outline" className="border-border text-sm bg-transparent">
            Export
          </Button>
        </div>
        <DataTable columns={columns} data={usersData} />
      </Card>
    </div>
  )
}
