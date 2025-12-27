import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, amount, paymentMethod, cardDetails } = body

    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, amount, paymentMethod" },
        { status: 400 }
      )
    }

    // Ensure booking exists
    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
      include: { payment: true },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.user_id !== session.userId && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Mock payment processing - generate a random transaction ID
    const mockTransactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const mockTransactionRef = `REF-${Math.random().toString(36).substring(2, 12).toUpperCase()}`

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Persist payment and booking status
    const savedPayment = await prisma.$transaction(async (tx) => {
      // If a pending payment exists, update it; otherwise create new
      const existing = booking.payment.find((p) => p.status === "Pending")
      const payment = existing
        ? await tx.payment.update({
            where: { payment_id: existing.payment_id },
            data: {
              amount,
              method: paymentMethod,
              transaction_ref: mockTransactionRef,
              status: "Paid",
              processed_at: new Date(),
            },
          })
        : await tx.payment.create({
            data: {
              booking_id: booking.booking_id,
              amount,
              method: paymentMethod,
              transaction_ref: mockTransactionRef,
              status: "Paid",
              processed_at: new Date(),
            },
          })

      await tx.booking.update({
        where: { booking_id: booking.booking_id },
        data: { status: "Confirmed" },
      })

      return payment
    })

    // Mock successful payment response
    return NextResponse.json(
      {
        transactionId: mockTransactionId,
        transactionRef: savedPayment.transaction_ref,
        status: "Paid",
        amount: amount,
        message: "Payment processed successfully",
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      { error: "Failed to process payment" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

