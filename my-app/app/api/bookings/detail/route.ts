import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
  }

  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: {
        passenger: {
          include: {
            ticket: {
              include: {
                fare_class: true,
                flight_instance: {
                  include: {
                    aircraft: true,
                    flight: { include: { route: true } }
                  }
                }
              }
            }
          }
        },
        payment: true
      }
    })

    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (booking.user_id !== session.userId && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Detail error", error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}
