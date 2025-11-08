"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Flight {
  id: string
  aircraft: string
  route: string
  status: "On Time" | "Delayed" | "Cancelled"
  passengers: number
  revenue: string
}

const initialFlights: Flight[] = [
  {
    id: "FL001",
    aircraft: "Boeing 737",
    route: "NYC → LAX",
    status: "On Time",
    passengers: 182,
    revenue: "$8,920",
  },
  {
    id: "FL002",
    aircraft: "Airbus A320",
    route: "LAX → MIA",
    status: "Delayed",
    passengers: 165,
    revenue: "$7,850",
  },
  {
    id: "FL003",
    aircraft: "Boeing 737",
    route: "ORD → BOS",
    status: "On Time",
    passengers: 178,
    revenue: "$8,680",
  },
  {
    id: "FL004",
    aircraft: "Embraer E190",
    route: "DEN → SFO",
    status: "On Time",
    passengers: 145,
    revenue: "$6,240",
  },
]

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>(initialFlights)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Flight>({
    id: "",
    aircraft: "",
    route: "",
    status: "On Time",
    passengers: 0,
    revenue: "",
  })

  const handleEdit = (flight: Flight) => {
    setEditingId(flight.id)
    setFormData(flight)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    setFlights(flights.filter((f) => f.id !== id))
  }

  const handleSave = () => {
    if (editingId) {
      setFlights(flights.map((f) => (f.id === editingId ? formData : f)))
    } else {
      const newId = `FL${String(flights.length + 1).padStart(3, "0")}`
      setFlights([...flights, { ...formData, id: newId }])
    }
    setShowModal(false)
    setEditingId(null)
    setFormData({
      id: "",
      aircraft: "",
      route: "",
      status: "On Time",
      passengers: 0,
      revenue: "",
    })
  }

  const handleOpenNew = () => {
    setEditingId(null)
    setFormData({
      id: "",
      aircraft: "",
      route: "",
      status: "On Time",
      passengers: 0,
      revenue: "",
    })
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Flights Management</h1>
          <p className="text-neutral-500 mt-1">Manage and monitor all active flights</p>
        </div>
        <Button onClick={handleOpenNew} className="gap-2 bg-primary hover:bg-primary-dark text-white">
          <Plus className="w-4 h-4" />
          New Flight
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" className="border-border bg-transparent">
          All Status
        </Button>
        <Button variant="outline" className="border-border bg-transparent">
          This Week
        </Button>
      </div>

      {/* Table */}
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
              {flights.map((flight) => (
                <TableRow key={flight.id} className="hover:bg-neutral-50 border-b border-border">
                  <TableCell className="py-3 px-4 text-neutral-700 font-medium">{flight.id}</TableCell>
                  <TableCell className="py-3 px-4 text-neutral-700">{flight.aircraft}</TableCell>
                  <TableCell className="py-3 px-4 text-neutral-700">{flight.route}</TableCell>
                  <TableCell className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        flight.status === "On Time"
                          ? "bg-green-100 text-green-700"
                          : flight.status === "Delayed"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {flight.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-neutral-700">{flight.passengers}</TableCell>
                  <TableCell className="py-3 px-4 text-neutral-700 font-medium">{flight.revenue}</TableCell>
                  <TableCell className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(flight)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                        aria-label="Edit flight"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(flight.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                        aria-label="Delete flight"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">{editingId ? "Edit Flight" : "New Flight"}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
                aria-label="Close modal"
              >
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
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Route</label>
                <Input
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  placeholder="e.g., NYC → LAX"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "On Time" | "Delayed" | "Cancelled",
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Revenue</label>
                <Input
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  placeholder="e.g., $8,920"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1 border-border">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary-dark text-white">
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
