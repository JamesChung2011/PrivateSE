import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/flights/instances/[id]/seats - return seat map with occupancy for an instance
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const instance = await prisma.flight_instance.findUnique({
      where: { instance_id: id },
      include: { aircraft: true },
    })

    if (!instance || !instance.aircraft_id) {
      return NextResponse.json(
        { error: "Flight instance or aircraft not found" },
        { status: 404 }
      )
    }

    // All seats for this aircraft
    const seats = await prisma.aircraft_seat.findMany({
      where: { aircraft_id: instance.aircraft_id },
      select: { seat_label: true, seat_class: true },
      orderBy: { seat_label: "asc" },
    })

    // Tickets already issued for this instance
    const occupied = await prisma.ticket.findMany({
      where: { instance_id: instance.instance_id },
      select: { seat_label: true },
    })
    const occupiedLabels = new Set(occupied.map((t) => t.seat_label).filter(Boolean) as string[])

    // Simple price uplift per class
    const priceByClass: Record<string, number> = {
      "First Class": Number(instance.base_price) + 120,
      Business: Number(instance.base_price) + 60,
      Economy: Number(instance.base_price),
    }

    let payload = seats.map((seat) => {
      const match = seat.seat_label?.match(/^(\d+)([A-Z])$/)
      const row = match ? Number(match[1]) : 0
      const col = match ? match[2] : ""
      const seatClass = seat.seat_class || "Economy"
      return {
        id: seat.seat_label,
        row,
        col,
        class: seatClass,
        price: priceByClass[seatClass] ?? Number(instance.base_price),
        status: occupiedLabels.has(seat.seat_label) ? "occupied" : "available",
      }
    })

    // If no seats are defined for this aircraft, generate a basic layout so users can continue
    if (payload.length === 0) {
      const total = instance.aircraft?.total_seats ?? 180
      const rows = Math.ceil(total / 6)
      const letters = ["A", "B", "C", "D", "E", "F"]
      const generated: typeof payload = []
      for (let r = 1; r <= rows; r++) {
        for (const letter of letters) {
          const seatId = `${r}${letter}`
          let seatClass: string = "Economy"
          if (r <= 2) seatClass = "First Class"
          else if (r <= 6) seatClass = "Business"
          generated.push({
            id: seatId,
            row: r,
            col: letter,
            class: seatClass as any,
            price: priceByClass[seatClass] ?? Number(instance.base_price),
            status: occupiedLabels.has(seatId) ? "occupied" : "available",
          })
          if (generated.length >= total) break
        }
        if (generated.length >= total) break
      }
      payload = generated
    }

    return NextResponse.json(payload)
  } catch (error: any) {
    console.error("Get seats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch seats", details: error.message },
      { status: 500 }
    )
  }
}
