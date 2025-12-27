import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest, requireRole } from "@/lib/auth"

// GET /api/flights/[id] - Get single flight by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["owner", "admin", "staff"])
    if (guard) return guard

    const resolvedParams = await params
    const flightId = parseInt(resolvedParams.id)

    console.log('Flight ID received:', resolvedParams.id, 'Parsed:', flightId)

    if (isNaN(flightId)) {
      return NextResponse.json(
        { error: "Invalid flight ID", received: resolvedParams.id },
        { status: 400 }
      )
    }

    const flight = await prisma.flight.findUnique({
      where: { flight_id: flightId },
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
    })

    if (!flight) {
      return NextResponse.json(
        { error: "Flight not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(flight)
  } catch (error: any) {
    console.error("Get flight error:", error)
    return NextResponse.json(
      { error: "Failed to fetch flight", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/flights/[id] - Update flight
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["owner", "admin"])
    if (guard) return guard

    const resolvedParams = await params
    const flightId = parseInt(resolvedParams.id)

    if (isNaN(flightId)) {
      return NextResponse.json(
        { error: "Invalid flight ID" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { flight_number, route_id, carrier, status } = body

    // Check if flight exists
    const existingFlight = await prisma.flight.findUnique({
      where: { flight_id: flightId }
    })

    if (!existingFlight) {
      return NextResponse.json(
        { error: "Flight not found" },
        { status: 404 }
      )
    }

    // If updating flight_number, check for duplicates
    if (flight_number && flight_number !== existingFlight.flight_number) {
      const duplicateFlight = await prisma.flight.findUnique({
        where: { flight_number }
      })

      if (duplicateFlight) {
        return NextResponse.json(
          { error: "Flight number already exists" },
          { status: 409 }
        )
      }
    }

    // If updating route_id, check if route exists
    if (route_id) {
      const route = await prisma.route.findUnique({
        where: { route_id: parseInt(route_id) }
      })

      if (!route) {
        return NextResponse.json(
          { error: "Route not found" },
          { status: 404 }
        )
      }
    }

    // Update flight
    const updatedFlight = await prisma.flight.update({
      where: { flight_id: flightId },
      data: {
        ...(flight_number && { flight_number }),
        ...(route_id && { route_id: parseInt(route_id) }),
        ...(carrier !== undefined && { carrier }),
        ...(status && { status }),
      },
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
        },
      },
    })

    return NextResponse.json(updatedFlight)
  } catch (error: any) {
    console.error("Update flight error:", error)
    return NextResponse.json(
      { error: "Failed to update flight", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/flights/[id] - Delete flight
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["owner", "admin"])
    if (guard) return guard

    const resolvedParams = await params
    const flightId = parseInt(resolvedParams.id)

    if (isNaN(flightId)) {
      return NextResponse.json(
        { error: "Invalid flight ID" },
        { status: 400 }
      )
    }

    // Check if flight exists
    const existingFlight = await prisma.flight.findUnique({
      where: { flight_id: flightId },
      include: {
        flight_instance: true,
      },
    })

    if (!existingFlight) {
      return NextResponse.json(
        { error: "Flight not found" },
        { status: 404 }
      )
    }

    // Check if there are flight instances
    if (existingFlight.flight_instance.length > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete flight with existing flight instances",
          details: `This flight has ${existingFlight.flight_instance.length} flight instance(s). Please delete them first or set flight status to 'inactive'.`
        },
        { status: 409 }
      )
    }

    // Delete flight
    await prisma.flight.delete({
      where: { flight_id: flightId }
    })

    return NextResponse.json(
      { message: "Flight deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Delete flight error:", error)
    return NextResponse.json(
      { error: "Failed to delete flight", details: error.message },
      { status: 500 }
    )
  }
}
