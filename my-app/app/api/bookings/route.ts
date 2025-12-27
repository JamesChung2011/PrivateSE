import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

interface PassengerPayload {
  fullName: string
  dob: string
}

// POST /api/bookings - create booking used by the booking wizard
export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { flightId, passengers, seats = [], totalAmount } = body
    const seatLabels: string[] = Array.isArray(seats) ? seats.map((s: unknown) => String(s)) : []

    if (!flightId || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: flightId, passengers[]" },
        { status: 400 }
      )
    }

    // Ensure flight instance exists
    const instance = await prisma.flight_instance.findUnique({
      where: { instance_id: flightId },
      include: { flight: { include: { route: true } }, aircraft: true },
    })

    if (!instance) {
      return NextResponse.json({ error: "Flight instance not found" }, { status: 404 })
    }

    // Optional seat validation: ensure provided seats belong to the instance aircraft and are free
    if (seatLabels.length > 0 && instance.aircraft_id) {
      const validSeats = await prisma.aircraft_seat.findMany({
        where: { aircraft_id: instance.aircraft_id, seat_label: { in: seatLabels } },
        select: { seat_label: true },
      })
      const validLabels = new Set(validSeats.map((s) => s.seat_label))

      // If no seats are defined in DB for this aircraft, allow provided labels up to total seat count
      if (validSeats.length > 0) {
        const invalid = seatLabels.filter((s) => !validLabels.has(s))
        if (invalid.length > 0) {
          return NextResponse.json(
            { error: "Invalid seats for this aircraft", seats: invalid },
            { status: 400 }
          )
        }
      } else {
        const totalSeats = instance.aircraft?.total_seats ?? 0
        if (totalSeats > 0 && seatLabels.length > totalSeats) {
          return NextResponse.json(
            { error: "Too many seats selected for this aircraft", seats: seatLabels },
            { status: 400 }
          )
        }
      }

      // Check if seats already ticketed for this instance
      const taken = await prisma.ticket.findMany({
        where: { instance_id: instance.instance_id, seat_label: { in: seatLabels } },
        select: { seat_label: true },
      })
      if (taken.length > 0) {
        return NextResponse.json(
          { error: "Some seats are already taken", seats: taken.map((t) => t.seat_label) },
          { status: 409 }
        )
      }
    }

    // Simple booking code generator (10 chars max as per schema)
    const bookingCode = `BK${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    const result = await prisma.$transaction(async (tx) => {
      // Create booking shell
      const booking = await tx.booking.create({
        data: {
          booking_code: bookingCode.slice(0, 10),
          user_id: session.userId,
          status: "Pending",
          created_at: new Date(),
        },
      })

      // Insert passengers
      const passengerRecords = await Promise.all(
        (passengers as PassengerPayload[]).map((p) =>
          tx.passenger.create({
            data: {
              booking_id: booking.booking_id,
              full_name: p.fullName,
              dob: p.dob ? new Date(p.dob) : null,
            },
          })
        )
      )

      // Issue tickets (best-effort seat matching to provided array order)
      await Promise.all(
        passengerRecords.map((passenger, idx) =>
          tx.ticket.create({
            data: {
              passenger_id: passenger.passenger_id,
              instance_id: instance.instance_id,
              seat_label: seatLabels[idx] || null,
              price: instance.base_price,
              status: "Issued",
            },
          })
        )
      )

      // Record payment intent if provided
      if (typeof totalAmount === "number" && !Number.isNaN(totalAmount)) {
        await tx.payment.create({
          data: {
            booking_id: booking.booking_id,
            amount: totalAmount,
            method: "Online",
            transaction_ref: null,
            status: "Pending",
          },
        })
      }

      return booking
    })

    return NextResponse.json(
      {
        bookingId: result.booking_id,
        bookingCode: result.booking_code,
        status: result.status,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Create booking error:", error)
    return NextResponse.json(
      { error: "Failed to create booking", details: error.message },
      { status: 500 }
    )
  }
}
