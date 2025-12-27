"use client"

import { useEffect, useMemo, useState } from "react"
import { StatCard } from "@/components/stat-card"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Plane, Calendar, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/lib/user-context"

interface BookingData {
  bookingId: string
  dbId: string
  route: string
  date: string
  passengers: number
  status: string
}

const columns = [
  { key: "bookingId", label: "Booking ID" },
  { key: "route", label: "Route" },
  { key: "date", label: "Date" },
  { key: "passengers", label: "Passengers" },
  { key: "status", label: "Status" },
]

export default function CustomerDashboard() {
  const { user } = useUser()
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchBookings()
    }
  }, [user?.id])

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings/list?userId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = bookings.length
    const active = bookings.filter((b) => b.status !== "Cancelled").length
    const miles = total * 1000
    return { total, active, miles }
  }, [bookings])

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
        <StatCard title="Total Bookings" value={String(stats.total)} icon={Plane} description="All time" />
        <StatCard title="Active Trips" value={String(stats.active)} icon={Calendar} description="Upcoming/active" />
        <StatCard title="Miles Earned" value={stats.miles.toLocaleString()} icon={MapPin} trend={{ value: 5, isPositive: true }} />
      </div>

      {/* Bookings */}
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-900">Your Bookings</h2>
          <Link href="/dashboard/customer/bookings">
            <Button variant="outline" size="sm">View all</Button>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable columns={columns} data={bookings.slice(0, 5)} />
        )}
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
