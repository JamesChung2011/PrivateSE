import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { flightId, userId, passengers } = body

    if (!flightId || !userId || !passengers || !Array.isArray(passengers)) {
      return NextResponse.json(
        { error: "Missing required fields: flightId, userId, passengers" },
        { status: 400 }
      )
    }

    // Mock booking creation - generate a random booking ID
    const mockBookingId = `BK${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    const mockBookingCode = `PNR${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Simulate a small delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return mock booking response
    return NextResponse.json(
      {
        bookingId: mockBookingId,
        bookingCode: mockBookingCode,
        status: "Pending",
        message: "Booking created successfully",
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

