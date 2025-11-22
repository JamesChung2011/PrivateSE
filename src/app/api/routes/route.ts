import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      include: {
        airport_route_originToairport: true,      // Auto-generated relation name for Origin
        airport_route_destinationToairport: true, // Auto-generated relation name for Destination
      }
    })

    const formattedRoutes = routes.map((r) => ({
      id: r.route_id,
      origin: r.origin,
      destination: r.destination,
      label: `${r.origin} → ${r.destination}`
    }))

    return NextResponse.json(formattedRoutes)
  } catch (error) {
    console.error("Failed to fetch routes:", error)
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    )
  }
}