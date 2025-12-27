import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest, requireRole } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET /api/routes - list available routes for selectors/dropdowns
export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["owner", "admin", "staff", "customer"])
    if (guard) return guard

    const routes = await prisma.route.findMany({
      include: {
        airport_route_originToairport: true,
        airport_route_destinationToairport: true,
      },
      orderBy: { route_id: "asc" },
    })

    const formatted = routes.map((route) => {
      const originCode = route.origin || "N/A"
      const destCode = route.destination || "N/A"
      const originName = route.airport_route_originToairport?.name
      const destName = route.airport_route_destinationToairport?.name

      const labelParts = [`${originCode} → ${destCode}`]
      if (originName || destName) {
        labelParts.push(`(${originName ?? "Unknown"} → ${destName ?? "Unknown"})`)
      }

      return {
        id: route.route_id,
        origin: originCode,
        destination: destCode,
        label: labelParts.join(" "),
      }
    })

    return NextResponse.json(formatted)
  } catch (error: any) {
    console.error("Get routes error:", error)
    return NextResponse.json(
      { error: "Failed to fetch routes", details: error.message },
      { status: 500 },
    )
  }
}
