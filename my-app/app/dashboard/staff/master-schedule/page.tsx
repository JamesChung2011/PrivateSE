"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Instance {
  instance_id: string
  status: string | null
  departure_time: string
  arrival_time: string
  flight: {
    flight_number: string
    carrier: string | null
    route: {
      origin: string | null
      destination: string | null
    } | null
  } | null
}

export default function MasterSchedulePage() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      if (dateFilter) params.set("date", dateFilter)
      const res = await fetch(`/api/flights/instances?${params.toString()}`)
      const data = await res.json()
      setInstances(data)
    } catch (err) {
      console.error(err)
      setInstances([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Master Schedule</h1>
          <p className="text-neutral-500 text-sm">View all flight instances with quick filters.</p>
        </div>
      </div>

      <Card className="p-4 border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-xs text-neutral-600">Status</label>
            <Input
              placeholder="On Time / Delayed / Boarding"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-600">Date</label>
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchData} disabled={loading} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Filters"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter("")
                setDateFilter("")
                fetchData()
              }}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-neutral-50">
                <th className="px-3 py-2 text-left">Flight</th>
                <th className="px-3 py-2 text-left">Route</th>
                <th className="px-3 py-2 text-left">Departure</th>
                <th className="px-3 py-2 text-left">Arrival</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-neutral-500">
                    <Loader2 className="w-5 h-5 animate-spin inline" />
                  </td>
                </tr>
              ) : instances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-neutral-500">
                    No flight instances found.
                  </td>
                </tr>
              ) : (
                instances.map((inst) => (
                  <tr key={inst.instance_id} className="border-b border-border">
                    <td className="px-3 py-3 font-medium">
                      {inst.flight?.flight_number} ({inst.flight?.carrier || "Carrier"})
                    </td>
                    <td className="px-3 py-3">
                      {inst.flight?.route?.origin || "N/A"} → {inst.flight?.route?.destination || "N/A"}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(inst.departure_time).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(inst.arrival_time).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">{inst.status || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
