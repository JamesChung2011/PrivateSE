"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Server, Zap, HardDrive, Activity } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const systemMetrics = [
  { time: "00:00", cpu: 25, memory: 45, disk: 60 },
  { time: "04:00", cpu: 30, memory: 50, disk: 61 },
  { time: "08:00", cpu: 45, memory: 65, disk: 62 },
  { time: "12:00", cpu: 60, memory: 75, disk: 63 },
  { time: "16:00", cpu: 55, memory: 70, disk: 64 },
  { time: "20:00", cpu: 42, memory: 58, disk: 65 },
  { time: "23:59", cpu: 28, memory: 48, disk: 66 },
]

const services = [
  { name: "API Server", status: "Running", uptime: "99.99%", cpu: "15%", memory: "2.4GB" },
  { name: "Database", status: "Running", uptime: "99.95%", cpu: "22%", memory: "8.1GB" },
  { name: "Cache Layer", status: "Running", uptime: "99.98%", cpu: "8%", memory: "1.2GB" },
  { name: "Message Queue", status: "Running", uptime: "99.97%", cpu: "12%", memory: "512MB" },
  { name: "Search Engine", status: "Running", uptime: "99.93%", cpu: "18%", memory: "3.5GB" },
]

export default function SystemPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">System Maintenance</h1>
          <p className="text-neutral-500 mt-1">Infrastructure monitoring and health checks</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary-dark text-white">
          <Zap className="w-4 h-4" />
          Quick Restart
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <Activity className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">CPU Usage</p>
              <p className="text-2xl font-bold text-neutral-900">42%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <HardDrive className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Memory Usage</p>
              <p className="text-2xl font-bold text-neutral-900">58%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Server className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Disk Usage</p>
              <p className="text-2xl font-bold text-neutral-900">66%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">System Status</p>
              <p className="text-2xl font-bold text-success">Healthy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">24-Hour System Metrics</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={systemMetrics}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0055cc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0055cc" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="cpu" stroke="#0055cc" fillOpacity={1} fill="url(#colorCpu)" />
            <Area type="monotone" dataKey="memory" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMemory)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Services Status */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Running Services</h2>
        <div className="space-y-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <div>
                    <p className="font-medium text-neutral-900">{service.name}</p>
                    <p className="text-xs text-neutral-500">Uptime: {service.uptime}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-right text-sm">
                <div>
                  <p className="text-neutral-500">CPU</p>
                  <p className="font-medium text-neutral-900">{service.cpu}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Memory</p>
                  <p className="font-medium text-neutral-900">{service.memory}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
