"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus, Download, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { useUser } from "@/lib/user-context"
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

interface StaffSchedule {
  schedule_id: string
  shift_start: string
  shift_end: string
  role: string
  status: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

// Mock data for charts (will be replaced with real data later)
const scheduleData = [
  { day: "Mon", flights: 14, staff: 28 },
  { day: "Tue", flights: 15, staff: 30 },
  { day: "Wed", flights: 12, staff: 24 },
  { day: "Thu", flights: 16, staff: 32 },
  { day: "Fri", flights: 18, staff: 36 },
  { day: "Sat", flights: 20, staff: 40 },
  { day: "Sun", flights: 11, staff: 22 },
]

export default function SchedulesPage() {
  const { user } = useUser()
  const [schedules, setSchedules] = useState<StaffSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  // Format shift time range
  const formatShift = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`
  }

  // Fetch schedules from API
  const fetchSchedules = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/staff/schedules?userId=${user.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedules')
      }
      
      const data = await response.json()
      setSchedules(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching schedules:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when component mounts or user changes
  useEffect(() => {
    fetchSchedules()
  }, [user?.id])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Schedules</h1>
          <p className="text-neutral-500 mt-1">Flight and staff scheduling management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-border gap-2 bg-transparent"
            onClick={fetchSchedules}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
            My Schedule ({user?.name})
          </h2>
          <Button variant="outline" className="border-border text-sm bg-transparent">
            View All
          </Button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-neutral-500" />
            <span className="ml-2 text-neutral-500">Loading schedules...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={fetchSchedules} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Schedules List */}
        {!loading && !error && (
          <div className="space-y-3">
            {schedules.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No schedules found for your account.
              </div>
            ) : (
              schedules.map((schedule) => (
                <div
                  key={schedule.schedule_id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{schedule.user.name}</p>
                    <p className="text-sm text-neutral-500">{schedule.role}</p>
                    <p className="text-xs text-neutral-400">
                      {new Date(schedule.shift_start).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">
                      {formatShift(schedule.shift_start, schedule.shift_end)}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        schedule.status === "On Duty"
                          ? "text-green-600"
                          : schedule.status === "Off"
                            ? "text-neutral-500"
                            : schedule.status === "Scheduled"
                              ? "text-blue-600"
                              : "text-yellow-600"
                      }`}
                    >
                      {schedule.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
