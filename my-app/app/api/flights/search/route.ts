import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")?.toUpperCase()
    const to = searchParams.get("to")?.toUpperCase()
    const date = searchParams.get("date")

    if (!from || !to || !date) {
      return NextResponse.json(
        { error: "Missing required parameters: from, to, date" },
        { status: 400 }
      )
    }

    // Parse the search date
    const searchDate = new Date(date)
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999))

    // Query real flight instances from database
    const flightInstances = await prisma.flight_instance.findMany({
      where: {
        departure_time: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: "On Time",
        flight: {
          status: "active",
          route: {
            origin: from,
            destination: to
          }
        }
      },
      include: {
        flight: {
          include: {
            route: {
              include: {
                airport_route_originToairport: true,
                airport_route_destinationToairport: true
              }
            }
          }
        },
        aircraft: true,
        ticket: true
      }
    })

    // Transform to frontend format
    const flights = flightInstances.map(instance => {
      const departTime = new Date(instance.departure_time)
      const arrivalTime = new Date(instance.arrival_time)
      const durationMs = arrivalTime.getTime() - departTime.getTime()
      const hours = Math.floor(durationMs / (1000 * 60 * 60))
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

      const bookedSeats = instance.ticket.length
      const totalSeats = instance.aircraft?.total_seats || 0
      const availableSeats = totalSeats - bookedSeats

      return {
        id: instance.instance_id, // This is the UUID we need
        airline: instance.flight?.carrier || "Unknown",
        departure: instance.flight?.route?.origin || from,
        arrival: instance.flight?.route?.destination || to,
        departTime: departTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        arrivalTime: arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: `${hours}h ${minutes}m`,
        route: `${instance.flight?.route?.airport_route_originToairport?.city || from} → ${instance.flight?.route?.airport_route_destinationToairport?.city || to}`,
        price: Number(instance.base_price),
        stops: 0, // Direct flights for now
        aircraft: instance.aircraft?.model || "Unknown",
        availableSeats: availableSeats
      }
    })

    return NextResponse.json(flights)
  } catch (error: any) {
    console.error("Flight search error:", error)
    return NextResponse.json(
      { error: "Failed to search flights" },
      { status: 500 }
    )
  }
}

