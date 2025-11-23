import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, amount, paymentMethod, cardDetails } = body

    if (!bookingId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, amount, paymentMethod" },
        { status: 400 }
      )
    }

    // Mock payment processing - generate a random transaction ID
    const mockTransactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const mockTransactionRef = `REF-${Math.random().toString(36).substring(2, 12).toUpperCase()}`

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful payment response
    return NextResponse.json(
      {
        transactionId: mockTransactionId,
        transactionRef: mockTransactionRef,
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

