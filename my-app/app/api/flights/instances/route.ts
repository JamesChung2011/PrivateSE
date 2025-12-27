import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest, requireRole } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET /api/flights/instances - Get all flight instances
export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["owner", "admin", "staff"])
    if (guard) return guard

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    
    // Build filters
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      where.departure_time = {
        gte: startDate,
        lt: endDate
      }
    }

    const instances = await prisma.flight_instance.findMany({
      where,
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
      },
      orderBy: {
        departure_time: 'asc'
      }
    })

    return NextResponse.json(instances)
  } catch (error: any) {
    console.error("Get flight instances error:", error)
    return NextResponse.json(
      { error: "Failed to fetch flight instances", details: error.message },
      { status: 500 }
    )
  }
}
