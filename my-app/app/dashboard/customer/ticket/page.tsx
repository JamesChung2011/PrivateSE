"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plane, QrCode, Loader2, Download, Printer } from "lucide-react"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog"

function TicketContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("id")
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (id) {
      fetchBookingDetail(id)
    } else {
      setLoading(false)
    }
  }, [id])

  const fetchBookingDetail = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/detail?id=${bookingId}`)
      if (res.ok) setBooking(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!id) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/bookings/cancel`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id })
      })
      
      if (!res.ok) throw new Error("Failed to cancel")
      
      fetchBookingDetail(id)
      alert("Booking cancelled successfully. Refund initiated.")
    } catch (err) {
      alert("Error cancelling booking")
    } finally {
      setCancelling(false)
    }
  }
  
  const handleDownload = () => {
     // For a real app, generate PDF via a library like jspdf
     // Here, we simulate by invoking print which can "Save as PDF"
     window.print()
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
  if (!id || !booking) return <div className="p-10 text-center">Booking not found or invalid ID.</div>

  const passenger = booking.passenger[0]
  const ticket = passenger?.ticket[0]
  const instance = ticket?.flight_instance
  const flight = instance?.flight
  const route = flight?.route

  const isCancellable = booking.status !== "Cancelled" && booking.status !== "Completed"

  return (
    <div className="max-w-3xl mx-auto space-y-6 print:space-y-2">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 hover:bg-transparent">
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" /> Save PDF
           </Button>
           <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="w-4 h-4" /> Print
           </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-Ticket Details</h1>
        <Badge variant={booking.status === "Cancelled" ? "destructive" : "default"} className="text-sm">
          {booking.status}
        </Badge>
      </div>

      <Card id="printable-ticket" className="border-2 border-dashed border-neutral-200 overflow-hidden bg-white print:border-none print:shadow-none">
        {/* Ticket Header */}
        <div className="bg-primary p-6 text-white flex justify-between items-center print:bg-neutral-900">
          <div>
            <p className="text-primary-foreground/80 text-sm">Airline</p>
            <p className="font-bold text-lg">{flight?.carrier || "FlightHub Air"}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80 text-sm">Booking Reference</p>
            <p className="font-mono text-xl font-bold tracking-wider">{booking.booking_code}</p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 print:grid-cols-3">
          {/* Flight Info */}
          <div className="md:col-span-2 space-y-6 col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-neutral-900">{route?.origin}</p>
                <p className="text-sm text-neutral-500">Departure</p>
              </div>
              <div className="flex flex-col items-center px-4">
                <Plane className="w-6 h-6 text-primary mb-1 rotate-90 print:text-black" />
                <p className="text-xs text-neutral-400">{instance ? "Non-stop" : ""}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-neutral-900">{route?.destination}</p>
                <p className="text-sm text-neutral-500">Arrival</p>
              </div>
            </div>

            <div className="h-px bg-neutral-200 w-full" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">Passenger</p>
                <p className="font-semibold text-neutral-900">{passenger?.full_name}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Flight No.</p>
                <p className="font-semibold text-neutral-900">{flight?.flight_number}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Date</p>
                <p className="font-semibold text-neutral-900">
                  {instance ? new Date(instance.departure_time).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Time</p>
                <p className="font-semibold text-neutral-900">
                  {instance ? new Date(instance.departure_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Gate</p>
                <p className="font-semibold text-neutral-900">TBD</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Seat</p>
                <p className="font-semibold text-neutral-900">{ticket?.seat_label || "Any"}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Class</p>
                <p className="font-semibold text-neutral-900">{ticket?.fare_class?.name || "Economy"}</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center border-l border-dashed pl-8 border-neutral-200">
            <div className="bg-white p-2 border border-neutral-200 rounded-lg mb-4">
              <QrCode className="w-32 h-32 text-neutral-900" />
            </div>
            <p className="text-xs text-neutral-500 text-center">Scan at check-in</p>
            {booking.status === "Paid" || booking.status === "Confirmed" ? (
               <Badge className="mt-4 bg-green-100 text-green-700 hover:bg-green-100 border-green-200 print:hidden">Paid</Badge>
            ) : (
               <Badge variant="outline" className="mt-4 print:hidden">{booking.status}</Badge>
            )}
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        {isCancellable && (
          <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex justify-end print:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2 bg-red-600 hover:bg-red-700">
                  Cancel Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Booking?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. A refund request will be automatically created.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={handleCancelBooking} disabled={cancelling} variant="destructive">
                    {cancelling ? "Processing..." : "Confirm Cancellation"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>
    </div>
  )
}

export default function TicketPage() {
  return (
    <Suspense fallback={<div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <TicketContent />
    </Suspense>
  )
}