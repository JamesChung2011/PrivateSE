"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Info, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"

const logsData = [
  {
    id: "LOG001",
    timestamp: "2025-11-06 14:32:15",
    level: "INFO",
    source: "API Server",
    message: "User john@example.com logged in successfully",
    details: "Login from 192.168.1.100",
  },
  {
    id: "LOG002",
    timestamp: "2025-11-06 14:28:42",
    level: "WARNING",
    source: "Database",
    message: "Slow query detected on bookings table",
    details: "Query took 2.3 seconds",
  },
  {
    id: "LOG003",
    timestamp: "2025-11-06 14:15:08",
    level: "ERROR",
    source: "Payment Gateway",
    message: "Payment processing failed for order #12345",
    details: "Timeout after 30 seconds",
  },
  {
    id: "LOG004",
    timestamp: "2025-11-06 14:10:22",
    level: "INFO",
    source: "Scheduler",
    message: "Daily backup completed successfully",
    details: "Backed up 450GB of data",
  },
  {
    id: "LOG005",
    timestamp: "2025-11-06 13:58:19",
    level: "WARNING",
    source: "API Server",
    message: "Rate limit exceeded for client",
    details: "Client IP: 203.0.113.45",
  },
]

const getLevelIcon = (level: string) => {
  switch (level) {
    case "ERROR":
      return <AlertCircle className="w-4 h-4 text-danger" />
    case "WARNING":
      return <AlertCircle className="w-4 h-4 text-warning" />
    case "INFO":
      return <Info className="w-4 h-4 text-info" />
    default:
      return <CheckCircle className="w-4 h-4 text-success" />
  }
}

const getLevelColor = (level: string) => {
  switch (level) {
    case "ERROR":
      return "text-danger"
    case "WARNING":
      return "text-warning"
    case "INFO":
      return "text-info"
    default:
      return "text-success"
  }
}

export default function LogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">System Logs</h1>
          <p className="text-neutral-500 mt-1">View and manage system event logs</p>
        </div>
        <Button variant="outline" className="border-border gap-2 bg-transparent">
          <FileText className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input type="text" placeholder="Search logs..." className="flex-1 min-w-64 border-border" />
        <Button variant="outline" className="border-border bg-transparent">
          All Levels
        </Button>
        <Button variant="outline" className="border-border bg-transparent">
          All Sources
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <Info className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Info Logs</p>
              <p className="text-2xl font-bold text-neutral-900">2,340</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Warnings</p>
              <p className="text-2xl font-bold text-neutral-900">156</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Errors</p>
              <p className="text-2xl font-bold text-neutral-900">23</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Today</p>
              <p className="text-2xl font-bold text-neutral-900">2,519</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Logs List */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Logs</h2>
        <div className="space-y-3">
          {logsData.map((log) => (
            <div
              key={log.id}
              className="flex gap-4 p-4 border border-border rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="flex-shrink-0">{getLevelIcon(log.level)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-medium text-neutral-900">{log.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">{log.details}</p>
                  </div>
                  <span className={`text-xs font-medium ${getLevelColor(log.level)}`}>{log.level}</span>
                </div>
                <div className="flex gap-4 text-xs text-neutral-500">
                  <span>Source: {log.source}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
