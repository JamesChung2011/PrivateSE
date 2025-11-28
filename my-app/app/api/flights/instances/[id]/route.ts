import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/flights/instances/[id] - Get single flight instance
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const instanceId = resolvedParams.id

    const instance = await prisma.flight_instance.findUnique({
      where: { instance_id: instanceId },
      include: {
        flight: {
          include: {
            route: {
              include: {
                airport_route_originToairport: true,
                airport_route_destinationToairport: true,
              }
            }
          }
        },
        aircraft: true,
      }
    })

    if (!instance) {
      return NextResponse.json(
        { error: "Flight instance not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(instance)
  } catch (error: any) {
    console.error("Get flight instance error:", error)
    return NextResponse.json(
      { error: "Failed to fetch flight instance", details: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/flights/instances/[id] - Update flight instance status and times
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const instanceId = resolvedParams.id
    const body = await request.json()
    const { status, departure_time, arrival_time, staff_notes } = body

    // Validate status if provided
    const validStatuses = [
      "On Time", 
      "Delayed", 
      "Boarding", 
      "Departed", 
      "Landed", 
      "Cancelled",
      "Preparing"
    ]
    
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          error: "Invalid status", 
          validStatuses 
        },
        { status: 400 }
      )
    }

    // Check if flight instance exists
    const existingInstance = await prisma.flight_instance.findUnique({
      where: { instance_id: instanceId }
    })

    if (!existingInstance) {
      return NextResponse.json(
        { error: "Flight instance not found" },
        { status: 404 }
      )
    }

    // Update flight instance
    const updatedInstance = await prisma.flight_instance.update({
      where: { instance_id: instanceId },
      data: {
        ...(status && { status }),
        ...(departure_time && { departure_time: new Date(departure_time) }),
        ...(arrival_time && { arrival_time: new Date(arrival_time) }),
      },
      include: {
        flight: {
          include: {
            route: {
              include: {
                airport_route_originToairport: true,
                airport_route_destinationToairport: true,
              }
            }
          }
        },
        aircraft: true,
      }
    })

    // Log status change for audit trail
    console.log(`Flight ${updatedInstance.flight?.flight_number} status updated to ${status} at ${new Date().toISOString()}`)

    return NextResponse.json({
      message: "Flight status updated successfully",
      instance: updatedInstance,
      changes: {
        status: status || existingInstance.status,
        departure_time: departure_time || existingInstance.departure_time,
        arrival_time: arrival_time || existingInstance.arrival_time,
        updated_at: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error("Update flight instance error:", error)
    return NextResponse.json(
      { error: "Failed to update flight instance", details: error.message },
      { status: 500 }
    )
  }
}