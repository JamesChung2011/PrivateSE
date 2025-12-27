"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Database, CloudFog } from "lucide-react"
import { useState } from "react"

const mockStatus = [
  { name: "Web App", status: "Operational", latency: "120ms", uptime: "99.9%" },
  { name: "API Layer", status: "Operational", latency: "180ms", uptime: "99.7%" },
  { name: "Database", status: "Degraded", latency: "250ms", uptime: "99.2%" },
  { name: "Background Jobs", status: "Operational", latency: "140ms", uptime: "99.5%" },
]

export default function AdminStatusPage() {
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">System Status</h1>
          <p className="text-neutral-500 mt-1">Monitor app/API/DB health at a glance.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setMaintenance((m) => !m)}>
          <CloudFog className="w-4 h-4" />
          {maintenance ? "Disable Maintenance Banner" : "Enable Maintenance Banner"}
        </Button>
      </div>

      {maintenance && (
        <Card className="p-4 border border-warning bg-warning/10">
          <div className="flex items-center gap-3">
            <Badge className="bg-warning text-white">Maintenance</Badge>
            <div>
              <p className="font-semibold text-neutral-900">Scheduled maintenance in progress</p>
              <p className="text-sm text-neutral-700">
                Systems may be intermittently unavailable. We’ll notify when complete.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStatus.map((item) => (
          <Card key={item.name} className="p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {item.name === "Database" ? (
                  <Database className="w-4 h-4 text-neutral-500" />
                ) : (
                  <Server className="w-4 h-4 text-neutral-500" />
                )}
                <p className="font-semibold text-neutral-900">{item.name}</p>
              </div>
              <Badge
                className={
                  item.status === "Operational"
                    ? "bg-success text-white"
                    : "bg-warning text-white"
                }
              >
                {item.status}
              </Badge>
            </div>
            <div className="text-sm text-neutral-600 space-y-1">
              <p>Latency: {item.latency}</p>
              <p>Uptime: {item.uptime}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-neutral-900">Recent Incidents</h3>
            <p className="text-sm text-neutral-600">No incidents reported in the last 24 hours.</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </Card>
    </div>
  )
}
