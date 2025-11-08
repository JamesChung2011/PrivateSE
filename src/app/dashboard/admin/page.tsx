"use client"

import { StatCard } from "@/components/stat-card"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Server, Users, AlertCircle, CheckCircle } from "lucide-react"

const systemStatusData = [
  { component: "API Server", status: "Operational", uptime: "99.99%" },
  { component: "Database", status: "Operational", uptime: "99.95%" },
  { component: "Cache Layer", status: "Operational", uptime: "99.98%" },
  { component: "Payment Gateway", status: "Operational", uptime: "99.97%" },
]

const columns = [
  { key: "component", label: "Component" },
  { key: "status", label: "Status" },
  { key: "uptime", label: "Uptime" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-500 mt-1">System monitoring and maintenance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Users" value="2,480" icon={Users} trend={{ value: 8, isPositive: true }} />
        <StatCard title="System Status" value="Healthy" icon={CheckCircle} description="All systems online" />
        <StatCard title="Alerts" value="2" icon={AlertCircle} description="Minor issues" />
        <StatCard title="Server Load" value="42%" icon={Server} description="Stable" />
      </div>

      {/* System Status */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">System Components</h2>
        <DataTable columns={columns} data={systemStatusData} />
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex gap-3 p-3 bg-neutral-50 rounded-lg border border-border">
            <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">Database backup completed successfully</p>
              <p className="text-xs text-neutral-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-neutral-50 rounded-lg border border-border">
            <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">Scheduled maintenance window completed</p>
              <p className="text-xs text-neutral-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
