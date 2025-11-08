"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, Download } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const scheduleData = [
  { day: "Mon", flights: 14, staff: 28 },
  { day: "Tue", flights: 15, staff: 30 },
  { day: "Wed", flights: 12, staff: 24 },
  { day: "Thu", flights: 16, staff: 32 },
  { day: "Fri", flights: 18, staff: 36 },
  { day: "Sat", flights: 20, staff: 40 },
  { day: "Sun", flights: 11, staff: 22 },
]

const staffSchedule = [
  { name: "John Smith", role: "Ground Handler", shift: "06:00 - 14:00", status: "Scheduled" },
  { name: "Maria Garcia", role: "Gate Agent", shift: "14:00 - 22:00", status: "Scheduled" },
  { name: "Ahmed Hassan", role: "Security", shift: "22:00 - 06:00", status: "On Duty" },
  { name: "Lisa Chen", role: "Ground Handler", shift: "06:00 - 14:00", status: "Off" },
  { name: "James Wilson", role: "Supervisor", shift: "08:00 - 17:00", status: "Scheduled" },
]

export default function SchedulesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Schedules</h1>
          <p className="text-neutral-500 mt-1">Flight and staff scheduling management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-white">
            <Plus className="w-4 h-4" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Weekly Overview */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Weekly Flight Schedule</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scheduleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="flights" fill="#0055cc" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Staff Requirements */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Daily Staff Requirements</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={scheduleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="staff" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Staff Schedule */}
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Staff Schedule
          </h2>
          <Button variant="outline" className="border-border text-sm bg-transparent">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {staffSchedule.map((staff, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{staff.name}</p>
                <p className="text-sm text-neutral-500">{staff.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-900">{staff.shift}</p>
                <p
                  className={`text-xs font-medium ${
                    staff.status === "On Duty"
                      ? "text-success"
                      : staff.status === "Off"
                        ? "text-neutral-500"
                        : "text-info"
                  }`}
                >
                  {staff.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
