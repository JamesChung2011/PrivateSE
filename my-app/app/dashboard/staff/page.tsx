"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type FlightRow = {
  id: string
  carrier: string
  routeLabel: string
  status: string
  passengers: number
  departure?: string
  arrival?: string
  aircraft?: string
}

interface CustomerRegistration {
  id: string
  customerName: string
  email: string
  flightId: string
  ticketClass: "Economy" | "Business" | "First"
  seatNumber: string
  registrationDate: string
}

const initialRegistrations: CustomerRegistration[] = [
  {
    id: "R001",
    customerName: "Alice Brown",
    email: "alice@example.com",
    flightId: "AA100",
    ticketClass: "Economy",
    seatNumber: "12A",
    registrationDate: "2025-01-15",
  },
  {
    id: "R002",
    customerName: "Bob Wilson",
    email: "bob@example.com",
    flightId: "UA200",
    ticketClass: "Business",
    seatNumber: "2C",
    registrationDate: "2025-01-16",
  },
]

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<"flights" | "registrations">("flights")
  const [flights, setFlights] = useState<FlightRow[]>([])
  const [loadingFlights, setLoadingFlights] = useState(false)

  const [registrations, setRegistrations] = useState<CustomerRegistration[]>(initialRegistrations)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [registrationFormData, setRegistrationFormData] = useState<CustomerRegistration>({
    id: "",
    customerName: "",
    email: "",
    flightId: "",
    ticketClass: "Economy",
    seatNumber: "",
    registrationDate: new Date().toISOString().split("T")[0],
  })

  const fetchFlights = async () => {
    try {
      setLoadingFlights(true)
      const res = await fetch("/api/flights")
      if (!res.ok) throw new Error("Failed to load flights")
      const data = await res.json()
      const mapped: FlightRow[] = data.map((f: any) => {
        const routeLabel = f.route ? `${f.route.origin} → ${f.route.destination}` : "Unknown route"
        const passengerCount =
          f.flight_instance?.reduce(
            (sum: number, inst: any) => sum + Number(inst.passenger_count ?? 0),
            0,
          ) || 0
        const firstInst = f.flight_instance?.[0]
        return {
          id: f.flight_number,
          carrier: f.carrier || "Carrier",
          routeLabel,
          status: f.status === "active" ? "On Time" : f.status || "On Time",
          passengers: passengerCount,
          departure: firstInst?.departure_time,
          arrival: firstInst?.arrival_time,
          aircraft: firstInst?.aircraft?.registration || "",
        }
      })
      setFlights(mapped)
    } catch (e) {
      console.error(e)
      setFlights([])
    } finally {
      setLoadingFlights(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  const flightStats = useMemo(() => {
    const total = flights.length
    const passengers = flights.reduce((sum, f) => sum + f.passengers, 0)
    const onTimeCount = flights.filter((f) => f.status?.toLowerCase().includes("on")).length
    const onTimeRate = total ? Math.round((onTimeCount / total) * 100) : 0
    return { total, passengers, onTimeRate }
  }, [flights])

  const handleSaveRegistration = () => {
    const newId = `R${String(registrations.length + 1).padStart(3, "0")}`
    setRegistrations([...registrations, { ...registrationFormData, id: newId }])
    setShowRegistrationModal(false)
    setRegistrationFormData({
      id: "",
      customerName: "",
      email: "",
      flightId: "",
      ticketClass: "Economy",
      seatNumber: "",
      registrationDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleDeleteRegistration = (id: string) => {
    setRegistrations(registrations.filter((r) => r.id !== id))
  }

  const getFlightRoute = (flightId: string) => {
    const flight = flights.find((f) => f.id === flightId)
    return flight ? flight.routeLabel : flightId
  }

  const formatDateTime = (value?: string) => {
    if (!value) return "—"
    const d = new Date(value)
    return isNaN(d.getTime()) ? "—" : d.toLocaleString()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Staff Dashboard</h1>
        <p className="text-neutral-500 mt-1">Live flight list from the database and customer registrations</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("flights")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "flights"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Flight Management
        </button>
        <button
          onClick={() => setActiveTab("registrations")}
          className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === "registrations"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <Users className="w-4 h-4" />
          Customer Registration
        </button>
      </div>

      {activeTab === "flights" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">Active Flights</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{flightStats.total}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">Total Passengers</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{flightStats.passengers}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">On-Time Rate</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{flightStats.onTimeRate}%</p>
            </Card>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-neutral-900">All Flights</h2>
            <Button onClick={fetchFlights} disabled={loadingFlights} className="gap-2">
              {loadingFlights ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <Card className="border border-border p-6 overflow-x-auto">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50 border-b border-border">
                  <TableRow>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Flight</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Route</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Aircraft</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Status</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Passengers</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Departure</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Arrival</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingFlights ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                        Loading flights...
                      </TableCell>
                    </TableRow>
                  ) : flights.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                        No flights found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    flights.map((flight) => (
                      <TableRow key={flight.id} className="hover:bg-neutral-50 border-b border-border">
                        <TableCell className="py-3 px-4 text-neutral-700 font-medium">
                          {flight.id} <span className="text-neutral-500">({flight.carrier})</span>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-neutral-700">{flight.routeLabel}</TableCell>
                        <TableCell className="py-3 px-4 text-neutral-700">{flight.aircraft || "N/A"}</TableCell>
                        <TableCell className="py-3 px-4">
                          <Badge className="bg-blue-100 text-blue-700">{flight.status}</Badge>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-neutral-700">{flight.passengers}</TableCell>
                        <TableCell className="py-3 px-4 text-neutral-700">{formatDateTime(flight.departure)}</TableCell>
                        <TableCell className="py-3 px-4 text-neutral-700">{formatDateTime(flight.arrival)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "registrations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">Total Registrations</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{registrations.length}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">Business Class</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {registrations.filter((r) => r.ticketClass === "Business").length}
              </p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">Economy Class</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {registrations.filter((r) => r.ticketClass === "Economy").length}
              </p>
            </Card>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-neutral-900">Register Customer</h2>
            <Button onClick={() => setShowRegistrationModal(true)} className="gap-2 bg-primary hover:bg-primary-dark text-white">
              <Plus className="w-4 h-4" />
              New Registration
            </Button>
          </div>

          <Card className="border border-border p-6 overflow-x-auto">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50 border-b border-border">
                  <TableRow>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Customer</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Email</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Flight</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Ticket Class</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Seat</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Registration Date</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id} className="hover:bg-neutral-50 border-b border-border">
                      <TableCell className="py-3 px-4 text-neutral-700 font-medium">{reg.customerName}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{reg.email}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{getFlightRoute(reg.flightId)}</TableCell>
                      <TableCell className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {reg.ticketClass}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{reg.seatNumber}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{reg.registrationDate}</TableCell>
                      <TableCell className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteRegistration(reg.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition"
                          aria-label="Delete registration"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {showRegistrationModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md border border-border p-6 shadow-2xl bg-white/95 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">Register Customer for Flight</h2>
                  <button
                    onClick={() => setShowRegistrationModal(false)}
                    className="p-1 hover:bg-neutral-100 rounded-lg"
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Customer Name</label>
                    <Input
                      value={registrationFormData.customerName}
                      onChange={(e) =>
                        setRegistrationFormData({ ...registrationFormData, customerName: e.target.value })
                      }
                      placeholder="Full name"
                      className="mt-1 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Email</label>
                    <Input
                      type="email"
                      value={registrationFormData.email}
                      onChange={(e) => setRegistrationFormData({ ...registrationFormData, email: e.target.value })}
                      placeholder="customer@example.com"
                      className="mt-1 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Select Flight</label>
                    <select
                      value={registrationFormData.flightId}
                      onChange={(e) => setRegistrationFormData({ ...registrationFormData, flightId: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="">Choose a flight</option>
                      {flights.map((flight) => (
                        <option key={flight.id} value={flight.id}>
                          {flight.id} - {flight.routeLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Ticket Class</label>
                    <select
                      value={registrationFormData.ticketClass}
                      onChange={(e) =>
                        setRegistrationFormData({
                          ...registrationFormData,
                          ticketClass: e.target.value as "Economy" | "Business" | "First",
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Seat Number</label>
                    <Input
                      value={registrationFormData.seatNumber}
                      onChange={(e) => setRegistrationFormData({ ...registrationFormData, seatNumber: e.target.value })}
                      placeholder="e.g., 12A"
                      className="mt-1 bg-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowRegistrationModal(false)}
                      variant="outline"
                      className="flex-1 border-border"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveRegistration}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
