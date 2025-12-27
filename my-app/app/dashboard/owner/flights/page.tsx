"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Loader2, Plus, X } from "lucide-react"

interface Flight {
  id: string
  aircraft: string
  routeId: number
  routeLabel: string
  status: "On Time" | "Delayed" | "Cancelled" | string
  passengers: number
  revenue: string
}

interface RouteOption {
  id: number
  label: string
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [loadingRoutes, setLoadingRoutes] = useState(true)
  const [tableLoading, setTableLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<Flight>>({
    aircraft: "",
    routeId: undefined,
    status: "On Time",
    passengers: 0,
    revenue: "",
  })

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const res = await fetch("/api/routes")
        if (res.ok) {
          const data = await res.json()
          setRoutes(data)
        }
      } catch (err) {
        console.error("Failed to load routes", err)
      } finally {
        setLoadingRoutes(false)
      }
    }
    loadRoutes()
  }, [])

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setTableLoading(true)
        const res = await fetch("/api/flights")
        if (!res.ok) throw new Error("Failed to load flights")
        const data = await res.json()
        const mapped = data.map((f: any, idx: number) => {
          const routeLabel = f.route ? `${f.route.origin} → ${f.route.destination}` : "Unknown route"
          const aircraftReg = f.flight_instance?.[0]?.aircraft?.registration || "N/A"
          const totalBase =
            f.flight_instance?.reduce(
              (sum: number, inst: any) => sum + Number(inst.base_price ?? 0),
              0,
            ) || 0
          const passengerCount =
            f.flight_instance?.reduce(
              (sum: number, inst: any) => sum + Number(inst.passenger_count ?? 0),
              0,
            ) || 0
          return {
            id: f.flight_number || `FL${idx + 1}`,
            aircraft: aircraftReg,
            routeId: f.route_id,
            routeLabel,
            status: f.status === "active" ? "On Time" : f.status || "On Time",
            passengers: passengerCount,
            revenue: `$${totalBase.toFixed(0)}`,
          } as Flight
        })
        setFlights(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setTableLoading(false)
      }
    }
    loadFlights()
  }, [])

  const handleEdit = (flight: Flight) => {
    setEditingId(flight.id)
    setFormData(flight)
    setShowModal(true)
  }

  const handleSave = () => {
    const selectedRoute = routes.find((r) => r.id === Number(formData.routeId))
    const routeLabel = selectedRoute ? selectedRoute.label : "Unknown Route"
    if (editingId) {
      setFlights(flights.map((f) => (f.id === editingId ? { ...f, ...formData, routeLabel } as Flight : f)))
    } else {
      const newId = `FL${String(flights.length + 1).padStart(3, "0")}`
      setFlights([...flights, { ...formData, id: newId, routeLabel } as Flight])
    }
    setShowModal(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      aircraft: "",
      routeId: undefined,
      status: "On Time",
      passengers: 0,
      revenue: "",
    })
    setEditingId(null)
  }

  if (loadingRoutes) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Flights Management</h1>
          <p className="text-neutral-500 mt-1">Manage and monitor all active flights</p>
        </div>
        <Button
          variant="default"
          onClick={() => setShowModal(true)}
          className="gap-2 bg-primary hover:bg-primary-dark text-white"
        >
          <Plus className="w-4 h-4" />
          New Flight
        </Button>
      </div>

      <Card className="border border-border p-6 overflow-x-auto">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-neutral-50 border-b border-border">
              <TableRow>
                <TableHead className="text-neutral-900 font-semibold py-3 px-4">Flight ID</TableHead>
                <TableHead className="text-neutral-900 font-semibold py-3 px-4">Aircraft</TableHead>
                <TableHead className="text-neutral-900 font-semibold py-3 px-4">Route</TableHead>
                <TableHead className="text-neutral-900 font-semibold py-3 px-4">Status</TableHead>
                <TableHead className="text-neutral-900 font-semibold py-3 px-4">Passengers</TableHead>
                <TableHead className="text-neutral-900 font-semibold py-3 px-4">Revenue</TableHead>
                <TableHead className="text-neutral-900 font-semibold py-3 px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                    Loading flights...
                  </TableCell>
                </TableRow>
              ) : flights.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                    No flights found. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                flights.map((flight) => (
                  <TableRow key={flight.id} className="hover:bg-neutral-50 border-b border-border">
                    <TableCell className="py-3 px-4 text-neutral-700 font-medium">{flight.id}</TableCell>
                    <TableCell className="py-3 px-4 text-neutral-700">{flight.aircraft}</TableCell>
                  <TableCell className="py-3 px-4 text-neutral-700">{flight.routeLabel}</TableCell>
                  <TableCell className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {flight.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-neutral-700">{flight.passengers}</TableCell>
                  <TableCell className="py-3 px-4 text-neutral-700 font-medium">{flight.revenue}</TableCell>
                  <TableCell className="py-3 px-4">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleEdit(flight)}
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          </Table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border border-border p-6 shadow-2xl bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">{editingId ? "Edit Flight" : "New Flight"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Aircraft</label>
                <Input
                  value={formData.aircraft}
                  onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
                  placeholder="e.g., Boeing 737"
                  className="mt-1 bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Route</label>
                <select
                  value={formData.routeId || ""}
                  onChange={(e) => setFormData({ ...formData, routeId: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="" disabled>
                    Select a route
                  </option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="On Time">On Time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Passengers</label>
                <Input
                  type="number"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: Number.parseInt(e.target.value) })}
                  placeholder="0"
                  className="mt-1 bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1 border-border">
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white"
                >
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
