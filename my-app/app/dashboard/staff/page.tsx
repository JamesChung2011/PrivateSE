"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, X, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Flight {
  id: string
  aircraft: string
  route: string
  status: "On Time" | "Delayed" | "Cancelled"
  passengers: number
  departure: string
  arrival: string
  gate: string
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

const initialFlights: Flight[] = [
  {
    id: "FL001",
    aircraft: "Boeing 737",
    route: "NYC → LAX",
    status: "On Time",
    passengers: 182,
    departure: "08:00",
    arrival: "11:30",
    gate: "A12",
  },
  {
    id: "FL002",
    aircraft: "Airbus A320",
    route: "LAX → MIA",
    status: "Delayed",
    passengers: 165,
    departure: "10:15",
    arrival: "13:45",
    gate: "B08",
  },
  {
    id: "FL003",
    aircraft: "Boeing 737",
    route: "ORD → BOS",
    status: "On Time",
    passengers: 178,
    departure: "14:30",
    arrival: "18:00",
    gate: "A05",
  },
  {
    id: "FL004",
    aircraft: "Embraer E190",
    route: "DEN → SFO",
    status: "On Time",
    passengers: 145,
    departure: "16:45",
    arrival: "20:15",
    gate: "C10",
  },
]

const initialRegistrations: CustomerRegistration[] = [
  {
    id: "R001",
    customerName: "Alice Brown",
    email: "alice@example.com",
    flightId: "FL001",
    ticketClass: "Economy",
    seatNumber: "12A",
    registrationDate: "2025-01-15",
  },
  {
    id: "R002",
    customerName: "Bob Wilson",
    email: "bob@example.com",
    flightId: "FL001",
    ticketClass: "Business",
    seatNumber: "2C",
    registrationDate: "2025-01-16",
  },
]

export default function StaffDashboard() {
  const [flights, setFlights] = useState<Flight[]>(initialFlights)
  const [registrations, setRegistrations] = useState<CustomerRegistration[]>(initialRegistrations)
  const [activeTab, setActiveTab] = useState<"flights" | "registrations">("flights")

  // Flight management states
  const [showFlightModal, setShowFlightModal] = useState(false)
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null)
  const [flightFormData, setFlightFormData] = useState<Flight>({
    id: "",
    aircraft: "",
    route: "",
    status: "On Time",
    passengers: 0,
    departure: "",
    arrival: "",
    gate: "",
  })

  // Customer registration states
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

  // Flight handlers
  const handleEditFlight = (flight: Flight) => {
    setEditingFlightId(flight.id)
    setFlightFormData(flight)
    setShowFlightModal(true)
  }

  const handleDeleteFlight = (id: string) => {
    setFlights(flights.filter((f) => f.id !== id))
  }

  const handleSaveFlight = () => {
    if (editingFlightId) {
      setFlights(flights.map((f) => (f.id === editingFlightId ? flightFormData : f)))
    } else {
      const newId = `FL${String(flights.length + 1).padStart(3, "0")}`
      setFlights([...flights, { ...flightFormData, id: newId }])
    }
    setShowFlightModal(false)
    setEditingFlightId(null)
    setFlightFormData({
      id: "",
      aircraft: "",
      route: "",
      status: "On Time",
      passengers: 0,
      departure: "",
      arrival: "",
      gate: "",
    })
  }

  const handleOpenNewFlight = () => {
    setEditingFlightId(null)
    setFlightFormData({
      id: "",
      aircraft: "",
      route: "",
      status: "On Time",
      passengers: 0,
      departure: "",
      arrival: "",
      gate: "",
    })
    setShowFlightModal(true)
  }

  // Customer registration handlers
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

  const getFlightNumber = (flightId: string) => {
    const flight = flights.find((f) => f.id === flightId)
    return flight ? flight.route : flightId
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Staff Dashboard</h1>
        <p className="text-neutral-500 mt-1">Manage flights and customer registrations</p>
      </div>

      {/* Tab Navigation */}
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

      {/* Flight Management Tab */}
      {activeTab === "flights" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">Active Flights</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{flights.length}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">Total Passengers</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {flights.reduce((sum, f) => sum + f.passengers, 0)}
              </p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-sm text-neutral-500">On-Time Rate</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {Math.round((flights.filter((f) => f.status === "On Time").length / flights.length) * 100)}%
              </p>
            </Card>
          </div>

          {/* Header with Add Button */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-neutral-900">All Flights</h2>
            <Button onClick={handleOpenNewFlight} className="gap-2 bg-primary hover:bg-primary-dark text-white">
              <Plus className="w-4 h-4" />
              Add Flight
            </Button>
          </div>

          {/* Flights Table */}
          <Card className="border border-border p-6 overflow-x-auto">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-neutral-50 border-b border-border">
                  <TableRow>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Flight ID</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Aircraft</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Route</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Departure</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Arrival</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Gate</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Status</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Passengers</TableHead>
                    <TableHead className="text-neutral-900 font-semibold py-3 px-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flights.map((flight) => (
                    <TableRow key={flight.id} className="hover:bg-neutral-50 border-b border-border">
                      <TableCell className="py-3 px-4 text-neutral-700 font-medium">{flight.id}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{flight.aircraft}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{flight.route}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{flight.departure}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{flight.arrival}</TableCell>
                      <TableCell className="py-3 px-4 text-neutral-700">{flight.gate}</TableCell>
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
                      <TableCell className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditFlight(flight)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition"
                            aria-label="Edit flight"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteFlight(flight.id)}
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

          {/* Flight Modal */}
          {showFlightModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">
                    {editingFlightId ? "Edit Flight" : "New Flight"}
                  </h2>
                  <button
                    onClick={() => setShowFlightModal(false)}
                    className="p-1 hover:bg-neutral-100 rounded-lg"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Aircraft</label>
                    <Input
                      value={flightFormData.aircraft}
                      onChange={(e) => setFlightFormData({ ...flightFormData, aircraft: e.target.value })}
                      placeholder="e.g., Boeing 737"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Route</label>
                    <Input
                      value={flightFormData.route}
                      onChange={(e) => setFlightFormData({ ...flightFormData, route: e.target.value })}
                      placeholder="e.g., NYC → LAX"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Departure</label>
                      <Input
                        value={flightFormData.departure}
                        onChange={(e) => setFlightFormData({ ...flightFormData, departure: e.target.value })}
                        placeholder="HH:MM"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Arrival</label>
                      <Input
                        value={flightFormData.arrival}
                        onChange={(e) => setFlightFormData({ ...flightFormData, arrival: e.target.value })}
                        placeholder="HH:MM"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Gate</label>
                      <Input
                        value={flightFormData.gate}
                        onChange={(e) => setFlightFormData({ ...flightFormData, gate: e.target.value })}
                        placeholder="e.g., A12"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Passengers</label>
                      <Input
                        type="number"
                        value={flightFormData.passengers}
                        onChange={(e) =>
                          setFlightFormData({ ...flightFormData, passengers: Number.parseInt(e.target.value) })
                        }
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Status</label>
                    <select
                      value={flightFormData.status}
                      onChange={(e) =>
                        setFlightFormData({
                          ...flightFormData,
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

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowFlightModal(false)}
                      variant="outline"
                      className="flex-1 border-border"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveFlight} className="flex-1 bg-primary hover:bg-primary-dark text-white">
                      {editingFlightId ? "Update" : "Add"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Customer Registration Tab */}
      {activeTab === "registrations" && (
        <div className="space-y-6">
          {/* Registration Stats */}
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

          {/* Header with Add Button */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-neutral-900">Register Customer</h2>
            <Button
              onClick={() => setShowRegistrationModal(true)}
              className="gap-2 bg-primary hover:bg-primary-dark text-white"
            >
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
                      <TableCell className="py-3 px-4 text-neutral-700">{getFlightNumber(reg.flightId)}</TableCell>
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

          {/* Registration Modal */}
          {showRegistrationModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">Register Customer for Flight</h2>
                  <button
                    onClick={() => setShowRegistrationModal(false)}
                    className="p-1 hover:bg-neutral-100 rounded-lg"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-neutral-600" />
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
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Email</label>
                    <Input
                      type="email"
                      value={registrationFormData.email}
                      onChange={(e) => setRegistrationFormData({ ...registrationFormData, email: e.target.value })}
                      placeholder="customer@example.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-neutral-700">Select Flight</label>
                    <select
                      value={registrationFormData.flightId}
                      onChange={(e) => setRegistrationFormData({ ...registrationFormData, flightId: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Choose a flight</option>
                      {flights.map((flight) => (
                        <option key={flight.id} value={flight.id}>
                          {flight.id} - {flight.route}
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
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="mt-1"
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
