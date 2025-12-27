import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { user_id: session.userId },
      include: {
        passenger: {
          include: {
            ticket: {
              include: {
                flight_instance: {
                  include: {
                    flight: { include: { route: true } }
                  }
                }
              }
            }
          }
        },
        payment: true
      },
      orderBy: { created_at: 'desc' }
    })

    const formattedBookings = bookings.map(b => {
      const firstTicket = b.passenger[0]?.ticket[0];
      const instance = firstTicket?.flight_instance;
      const flightRoute = instance?.flight?.route;
      const totalPrice = b.payment.reduce((sum, p) => sum + Number(p.amount), 0);

      return {
        bookingId: b.booking_code,
        dbId: b.booking_id,
        route: flightRoute ? `${flightRoute.origin} → ${flightRoute.destination}` : "N/A",
        date: instance ? new Date(instance.departure_time).toLocaleDateString() : "N/A",
        departure: instance ? new Date(instance.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "",
        arrival: instance ? new Date(instance.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "",
        passengers: b.passenger.length,
        price: `$${totalPrice}`,
        status: b.status,
        airline: instance?.flight?.carrier || "Airline",
      }
    })

    return NextResponse.json(formattedBookings)
  } catch (error: any) {
    console.error("Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
