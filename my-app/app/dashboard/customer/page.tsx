"use client"

import { StatCard } from "@/components/stat-card"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Plane, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

const bookingsData = [
  {
    bookingId: "BK001",
    route: "NYC → LAX",
    date: "2025-02-15",
    passengers: 2,
    status: "Confirmed",
  },
  {
    bookingId: "BK002",
    route: "LAX → MIA",
    date: "2025-03-01",
    passengers: 1,
    status: "Confirmed",
  },
  {
    bookingId: "BK003",
    route: "ORD → BOS",
    date: "2025-03-10",
    passengers: 3,
    status: "Pending",
  },
]

const columns = [
  { key: "bookingId", label: "Booking ID" },
  { key: "route", label: "Route" },
  { key: "date", label: "Date" },
  { key: "passengers", label: "Passengers" },
  { key: "status", label: "Status" },
]

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Flights</h1>
          <p className="text-neutral-500 mt-1">Manage your bookings and travel plans</p>
        </div>
        <Link href="/dashboard/customer/book">
          <Button className="gap-2 bg-primary hover:bg-primary-dark text-white">
            <Plus className="w-4 h-4" />
            Book Flight
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Bookings" value="12" icon={Plane} description="All time" />
        <StatCard title="Upcoming Flights" value="3" icon={Calendar} description="Next 3 months" />
        <StatCard title="Miles Earned" value="24,580" icon={MapPin} trend={{ value: 15, isPositive: true }} />
      </div>

      {/* Bookings */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Bookings</h2>
        <DataTable columns={columns} data={bookingsData} />
      </Card>

      {/* Special Offers */}
      <Card className="p-6 border border-border bg-primary-light">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">Special Offer</h2>
        <p className="text-neutral-700 mb-4">Get 20% off on your next booking with code SPRING20</p>
        <Button className="bg-primary hover:bg-primary-dark text-white">Browse Flights</Button>
      </Card>
    </div>
  )
}
