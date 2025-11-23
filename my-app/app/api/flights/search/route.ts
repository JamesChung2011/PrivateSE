import { NextResponse } from "next/server"

// Mock flight data
const mockFlights = [
  {
    id: "FL001",
    airline: "FlightHub Air",
    departure: "NYC",
    arrival: "LAX",
    departTime: "08:00",
    arrivalTime: "11:30",
    duration: "3h 30m",
    route: "NYC → LAX",
    price: 245,
    stops: 0,
    aircraft: "Boeing 737",
    availableSeats: 12,
  },
  {
    id: "FL002",
    airline: "Sky Express",
    departure: "NYC",
    arrival: "LAX",
    departTime: "10:15",
    arrivalTime: "13:45",
    duration: "3h 30m",
    route: "NYC → LAX",
    price: 199,
    stops: 0,
    aircraft: "Airbus A320",
    availableSeats: 8,
  },
  {
    id: "FL003",
    airline: "Air Global",
    departure: "NYC",
    arrival: "LAX",
    departTime: "14:00",
    arrivalTime: "17:30",
    duration: "3h 30m",
    route: "NYC → LAX",
    price: 189,
    stops: 0,
    aircraft: "Boeing 787",
    availableSeats: 5,
  },
  {
    id: "FL004",
    airline: "Eagle Airways",
    departure: "NYC",
    arrival: "LAX",
    departTime: "16:30",
    arrivalTime: "20:00",
    duration: "3h 30m",
    route: "NYC → LAX",
    price: 229,
    stops: 1,
    aircraft: "Airbus A321",
    availableSeats: 15,
  },
  {
    id: "FL005",
    airline: "FlightHub Air",
    departure: "NYC",
    arrival: "LAX",
    departTime: "19:00",
    arrivalTime: "22:30",
    duration: "3h 30m",
    route: "NYC → LAX",
    price: 179,
    stops: 0,
    aircraft: "Boeing 737",
    availableSeats: 20,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")?.toUpperCase()
    const to = searchParams.get("to")?.toUpperCase()
    const date = searchParams.get("date")

    if (!from || !to || !date) {
      return NextResponse.json(
        { error: "Missing required parameters: from, to, date" },
        { status: 400 }
      )
    }

    // Filter mock flights based on origin and destination
    const filteredFlights = mockFlights.filter(
      (flight) => flight.departure === from && flight.arrival === to
    )

    return NextResponse.json(filteredFlights)
  } catch (error: any) {
    console.error("Flight search error:", error)
    return NextResponse.json(
      { error: "Failed to search flights" },
      { status: 500 }
    )
  }
}

