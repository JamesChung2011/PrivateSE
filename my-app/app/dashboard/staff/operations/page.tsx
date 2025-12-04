"use client"

import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Plane, 
  Edit3 
} from "lucide-react"
import { useState, useEffect } from "react"

interface FlightInstance {
  instance_id: string
  departure_time: string
  arrival_time: string
  status: string
  base_price: string
  flight?: {
    flight_number: string
    carrier: string
    route?: {
      airport_route_originToairport?: {
        airport_code: string
        name: string
      }
      airport_route_destinationToairport?: {
        airport_code: string
        name: string
      }
    }
  }
  aircraft?: {
    registration: string
    model: string
  }
}

export default function OperationsPage() {
  const [flightInstances, setFlightInstances] = useState<FlightInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  // Status options for dropdown
  const statusOptions = [
    "Delayed", 
    "Boarding",
    "Landed"
  ]

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delayed": return "bg-red-100 text-red-800"
      case "Boarding": return "bg-blue-100 text-blue-800"
      case "Landed": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  // Fetch flight instances
  const fetchFlightInstances = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/flights/instances?date=${today}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch flight instances')
      }
      
      const data = await response.json()
      setFlightInstances(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching flight instances:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update flight status
  const updateFlightStatus = async (instanceId: string, newStatus: string) => {
    try {
      setUpdatingStatus(instanceId)
      
      const response = await fetch(`/api/flights/instances/${instanceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update flight status')
      }
      
      // Refresh data
      await fetchFlightInstances()
    } catch (err: any) {
      console.error('Error updating flight status:', err)
      alert('Failed to update flight status: ' + err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Calculate stats
  const stats = {
    total: flightInstances.length,
    boarding: flightInstances.filter(f => f.status === "Boarding").length,
    delayed: flightInstances.filter(f => f.status === "Delayed").length,
    landed: flightInstances.filter(f => f.status === "Landed").length
  }

  useEffect(() => {
    fetchFlightInstances()
  }, [])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Operations</h1>
        <p className="text-neutral-500 mt-1">Real-time flight operations and gate management</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plane className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Active Flights</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Boarding</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.boarding}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Landed</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.landed}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Delayed</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.delayed}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Operations Table */}
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Today's Flight Operations</h2>
          <Button 
            variant="outline" 
            className="border-border bg-transparent gap-2"
            onClick={fetchFlightInstances}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-neutral-500" />
            <span className="ml-2 text-neutral-500">Loading flight operations...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={fetchFlightInstances} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {flightInstances.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No flight operations for today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-medium text-neutral-900">Flight</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900">Route</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900">Aircraft</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900">Schedule</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightInstances.map((instance) => (
                      <tr key={instance.instance_id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-neutral-900">
                              {instance.flight?.flight_number || 'N/A'}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {instance.flight?.carrier || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="font-medium">
                              {instance.flight?.route?.airport_route_originToairport?.airport_code || 'N/A'} → {instance.flight?.route?.airport_route_destinationToairport?.airport_code || 'N/A'}
                            </p>
                            <p className="text-neutral-500">
                              {instance.flight?.route?.airport_route_originToairport?.name || 'Unknown'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="font-medium">{instance.aircraft?.model || 'N/A'}</p>
                            <p className="text-neutral-500">{instance.aircraft?.registration || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="font-medium">{formatTime(instance.departure_time)}</p>
                            <p className="text-neutral-500">→ {formatTime(instance.arrival_time)}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(instance.status)}>
                            {instance.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={instance.status}
                            onChange={(e) => updateFlightStatus(instance.instance_id, e.target.value)}
                            disabled={updatingStatus === instance.instance_id}
                            className="px-3 py-1 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Alerts */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Alerts</h2>
        <div className="space-y-3">
          <div className="flex gap-3 p-4 bg-danger/5 border border-danger/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Flight FL003 Delayed</p>
              <p className="text-sm text-neutral-500">Mechanical issue - expected 30-minute delay</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Gate Maintenance</p>
              <p className="text-sm text-neutral-500">Gate B10 will be down for 15 minutes at 15:00</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
