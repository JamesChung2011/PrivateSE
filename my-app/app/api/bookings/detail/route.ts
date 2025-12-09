import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
  }

  try {
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
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Detail error", error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 })
  }
}