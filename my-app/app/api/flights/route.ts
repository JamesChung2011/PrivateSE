import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/flights - Get all flights
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where = status ? { status } : {}

    const flights = await prisma.flight.findMany({
      where,
      include: {
        route: {
          include: {
            airport_route_originToairport: true,
            airport_route_destinationToairport: true,
          },
        },
        flight_instance: {
          include: {
            aircraft: true,
          },
          orderBy: {
            departure_time: 'asc'
          }
        },
      },
      orderBy: {
        flight_number: 'asc'
      }
    })

    return NextResponse.json(flights)
  } catch (error: any) {
    console.error("Get flights error:", error)
    return NextResponse.json(
      { error: "Failed to fetch flights", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/flights - Create new flight
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { flight_number, route_id, carrier, status } = body

    // Validate required fields
    if (!flight_number || !route_id) {
      return NextResponse.json(
        { error: "Missing required fields: flight_number, route_id" },
        { status: 400 }
      )
    }

    // Check if flight_number already exists
    const existingFlight = await prisma.flight.findUnique({
      where: { flight_number }
    })

    if (existingFlight) {
      return NextResponse.json(
        { error: "Flight number already exists" },
        { status: 409 }
      )
    }

    // Check if route exists
    const route = await prisma.route.findUnique({
      where: { route_id: parseInt(route_id) }
    })

    if (!route) {
      return NextResponse.json(
        { error: "Route not found" },
        { status: 404 }
      )
    }

    // Create new flight
    const newFlight = await prisma.flight.create({
      data: {
        flight_number,
        route_id: parseInt(route_id),
        carrier,
        status: status || "active",
      },
      include: {
        route: {
          include: {
            airport_route_originToairport: true,
            airport_route_destinationToairport: true,
          },
        },
      },
    })

    return NextResponse.json(newFlight, { status: 201 })
  } catch (error: any) {
    console.error("Create flight error:", error)
    return NextResponse.json(
      { error: "Failed to create flight", details: error.message },
      { status: 500 }
    )
  }
}
