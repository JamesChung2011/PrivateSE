import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, amount, paymentMethod, cardDetails } = body

    // 1. Basic Validation (In a real app, you'd validate card length/Luhn algorithm here)
    if (!bookingId || !amount || !cardDetails) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      )
    }

    // 2. SIMULATE EXTERNAL PAYMENT GATEWAY CALL
    // In real life, you would send 'cardDetails' to Stripe/PayPal here.
    // We simulate a delay and a random success/fail chance.
    await new Promise((resolve) => setTimeout(resolve, 2000)) // 2s delay

    // Simulate a 10% chance of card decline for realism
    const isApproved = Math.random() > 0.1 
    
    if (!isApproved) {
      return NextResponse.json(
        { error: "Transaction declined by bank" },
        { status: 402 } // Payment Required
      )
    }

    // 3. Generate a Fake Transaction Reference
    // This is what we store instead of the card number
    const transactionRef = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // 4. Database Transaction: Create Payment AND Update Booking Status
    // We use $transaction to ensure both happen or neither happens
    const result = await prisma.$transaction(async (tx) => {
      // Create the payment record
      const payment = await tx.payment.create({
        data: {
          booking_id: bookingId,
          amount: amount,
          method: paymentMethod || "Credit Card",
          transaction_ref: transactionRef, // <--- SAFE TO STORE
          status: "Paid"
        }
      })

      // Update the booking status
      await tx.booking.update({
        where: { booking_id: bookingId },
        data: { status: "Confirmed" }
      })

      return payment
    })

    return NextResponse.json({ 
      success: true, 
      transactionId: result.transaction_ref,
      message: "Payment processed successfully" 
    })

  } catch (error) {
    console.error("Payment Error:", error)
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    )
  }
}