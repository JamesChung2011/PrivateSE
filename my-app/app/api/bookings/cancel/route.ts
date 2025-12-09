import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId } = body

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    // 1. Get booking details
    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
      include: { payment: true }
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.status === "Cancelled") {
      return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 })
    }

    // 2. Cancel and Refund Transaction
    await prisma.$transaction(async (tx) => {
      // Update status
      await tx.booking.update({
        where: { booking_id: bookingId },
        data: { status: "Cancelled" }
      })

      // Create refund record if paid
      if (booking.payment.length > 0) {
        const payment = booking.payment[0]
        await tx.refund.create({
          data: {
            payment_id: payment.payment_id,
            amount: payment.amount,
            reason: "Customer requested cancellation",
            status: "Processing"
          }
        })
      }
    })

    return NextResponse.json({ message: "Booking cancelled successfully" })

  } catch (error: any) {
    console.error("Cancel error:", error)
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
  }
}