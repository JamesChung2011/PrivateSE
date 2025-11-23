"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const bookingsHistoryData = [
  {
    bookingId: "BK001",
    route: "NYC → LAX",
    date: "2025-02-15",
    departure: "08:00",
    arrival: "11:30",
    passengers: 2,
    price: "$490",
    status: "Confirmed",
    airline: "FlightHub Air",
  },
  {
    bookingId: "BK002",
    route: "LAX → MIA",
    date: "2025-03-01",
    departure: "14:30",
    arrival: "22:15",
    passengers: 1,
    price: "$245",
    status: "Confirmed",
    airline: "FlightHub Air",
  },
  {
    bookingId: "BK003",
    route: "ORD → BOS",
    date: "2025-03-10",
    departure: "10:00",
    arrival: "14:45",
    passengers: 3,
    price: "$735",
    status: "Pending",
    airline: "FlightHub Air",
  },
  {
    bookingId: "BK004",
    route: "DEN → SFO",
    date: "2025-01-20",
    departure: "09:15",
    arrival: "10:50",
    passengers: 1,
    price: "$180",
    status: "Completed",
    airline: "FlightHub Air",
  },
  {
    bookingId: "BK005",
    route: "MIA → BOS",
    date: "2024-12-25",
    departure: "15:00",
    arrival: "19:30",
    passengers: 4,
    price: "$980",
    status: "Completed",
    airline: "FlightHub Air",
  },
]

const columns = [
  { key: "bookingId", label: "Booking ID" },
  { key: "route", label: "Route" },
  { key: "date", label: "Date" },
  { key: "departure", label: "Departure" },
  { key: "arrival", label: "Arrival" },
  { key: "passengers", label: "Passengers" },
  { key: "price", label: "Total Price" },
  { key: "status", label: "Status" },
]

export default function BookingsPage() {
  const completedBookings = bookingsHistoryData.filter((b) => b.status === "Completed").length
  const confirmedBookings = bookingsHistoryData.filter((b) => b.status === "Confirmed").length
  const pendingBookings = bookingsHistoryData.filter((b) => b.status === "Pending").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Bookings</h1>
          <p className="text-neutral-500 mt-1">View and manage your flight bookings history</p>
        </div>
        <Button variant="outline" className="border-border gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Download Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-neutral-900">{bookingsHistoryData.length}</p>
          <p className="text-xs text-neutral-500 mt-2">Since 2024</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-info">{confirmedBookings}</p>
          <p className="text-xs text-info mt-2">Upcoming flights</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-success">{completedBookings}</p>
          <p className="text-xs text-success mt-2">Past flights</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-warning">{pendingBookings}</p>
          <p className="text-xs text-warning mt-2">Awaiting confirmation</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 relative min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input type="text" placeholder="Search by booking ID or route..." className="pl-10 border-border" />
        </div>
        <Button variant="outline" className="border-border gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Bookings Table */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Booking History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {columns.map((col) => (
                  <th key={col.key} className="text-left py-3 px-4 font-medium text-neutral-700">
                    {col.label}
                  </th>
                ))}
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsHistoryData.map((booking, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-neutral-900">{booking.bookingId}</td>
                  <td className="py-4 px-4 text-neutral-700">{booking.route}</td>
                  <td className="py-4 px-4 text-neutral-700">{booking.date}</td>
                  <td className="py-4 px-4 text-neutral-700">{booking.departure}</td>
                  <td className="py-4 px-4 text-neutral-700">{booking.arrival}</td>
                  <td className="py-4 px-4 text-neutral-700">{booking.passengers}</td>
                  <td className="py-4 px-4 font-medium text-neutral-900">{booking.price}</td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={
                        booking.status === "Completed"
                          ? "default"
                          : booking.status === "Confirmed"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        booking.status === "Completed"
                          ? "bg-success text-white"
                          : booking.status === "Confirmed"
                            ? "bg-info text-white"
                            : "bg-warning/10 text-warning"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="outline" size="sm" className="border-border text-xs bg-transparent">
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Frequent Travelers Card */}
      <Card className="p-6 border border-border bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Loyalty Program Member</h3>
            <p className="text-sm text-neutral-600 mt-1">
              You've earned 24,580 miles! Get closer to your next free flight.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark text-white">Redeem Miles</Button>
        </div>
      </Card>
    </div>
  )
}
