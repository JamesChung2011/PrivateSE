"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"

interface BookingData {
  bookingId: string
  dbId: string
  route: string
  date: string
  departure: string
  arrival: string
  passengers: number
  price: string
  status: string
  airline: string
}

export default function BookingsPage() {
  const { user } = useUser()
  const router = useRouter()
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

  const columns = [
    { key: "bookingId", label: "Booking ID" },
    { key: "route", label: "Route" },
    { key: "date", label: "Date" },
    { key: "departure", label: "Departure" },
    { key: "arrival", label: "Arrival" },
    { key: "passengers", label: "Pax" },
    { key: "price", label: "Price" },
    { key: "status", label: "Status" },
  ]

  const completedBookings = bookings.filter((b) => b.status === "Completed").length
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Bookings</h1>
          <p className="text-neutral-500 mt-1">View and manage your flight bookings history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-neutral-900">{bookings.length}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-info">{confirmedBookings}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-success">{completedBookings}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-neutral-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-warning">{pendingBookings}</p>
        </Card>
      </div>

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
              {bookings.length === 0 ? (
                 <tr><td colSpan={9} className="text-center py-4 text-neutral-500">No bookings found.</td></tr>
              ) : bookings.map((booking) => (
                <tr key={booking.bookingId} className="border-b border-border hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-neutral-900">{booking.bookingId}</td>
                  <td className="py-4 px-4">{booking.route}</td>
                  <td className="py-4 px-4">{booking.date}</td>
                  <td className="py-4 px-4">{booking.departure}</td>
                  <td className="py-4 px-4">{booking.arrival}</td>
                  <td className="py-4 px-4">{booking.passengers}</td>
                  <td className="py-4 px-4 font-medium">{booking.price}</td>
                  <td className="py-4 px-4">
                    <Badge variant={booking.status === "Cancelled" ? "destructive" : "outline"}
                      className={
                        booking.status === "Completed" ? "bg-success text-white" :
                        booking.status === "Confirmed" ? "bg-info text-white" :
                        booking.status === "Cancelled" ? "bg-destructive text-white" :
                        "bg-warning/10 text-warning"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-border text-xs bg-transparent"
                      // UPDATED: Push to /ticket?id=...
                      onClick={() => router.push(`/dashboard/customer/ticket?id=${booking.dbId}`)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}