"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Seat {
  id: string
  row: number
  col: string // A, B, C, D, E, F
  price: number
  class: "Economy" | "Business" | "First"
  status: "available" | "occupied" | "selected"
}

interface SeatMapProps {
  passengers: number
  onSeatsSelected: (seats: Seat[]) => void
  onBack: () => void
  instanceId?: string
}

// Mock Seat Data Generator
const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  const rows = 20
  const cols = ["A", "B", "C", "D", "E", "F"]

  for (let r = 1; r <= rows; r++) {
    cols.forEach((c) => {
      // Logic for seat class
      let seatClass: "First" | "Business" | "Economy" = "Economy"
      let price = 50
      if (r <= 2) {
        seatClass = "First"
        price = 200
      } else if (r <= 5) {
        seatClass = "Business"
        price = 120
      }

      // Randomly occupy some seats
      const isOccupied = Math.random() < 0.3

      seats.push({
        id: `${r}${c}`,
        row: r,
        col: c,
        price,
        class: seatClass,
        status: isOccupied ? "occupied" : "available",
      })
    })
  }
  return seats
}

export function SeatMap({ passengers, onSeatsSelected, onBack, instanceId }: SeatMapProps) {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSeats = async () => {
      if (!instanceId) {
        setSeats(generateSeats())
        return
      }
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`/api/flights/instances/${instanceId}/seats`)
        if (!res.ok) {
          throw new Error("Unable to load seat map")
        }
        const data = (await res.json()) as Seat[]
        // If API returns no seats (e.g., aircraft missing seats), fall back to mock map
        if (!data || data.length === 0) {
          setSeats(generateSeats())
          setError("Seat data unavailable for this aircraft. Showing sample layout.")
        } else {
          setSeats(data)
        }
      } catch (err: any) {
        setError(err.message || "Failed to load seats")
        // Fall back to mock data so users can continue
        setSeats(generateSeats())
      } finally {
        setLoading(false)
      }
    }
    fetchSeats()
  }, [instanceId])

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied") return

    if (selectedSeatIds.includes(seat.id)) {
      // Deselect
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id))
      setSeats((prev) =>
        prev.map((s) => (s.id === seat.id ? { ...s, status: "available" } : s))
      )
    } else {
      // Select (Limit to number of passengers)
      if (selectedSeatIds.length < passengers) {
        setSelectedSeatIds((prev) => [...prev, seat.id])
        setSeats((prev) =>
          prev.map((s) => (s.id === seat.id ? { ...s, status: "selected" } : s))
        )
      } else {
         // Optional: Swap selection logic could go here
         alert(`You can only select ${passengers} seat(s).`)
      }
    }
  }

  const handleConfirm = () => {
    if (selectedSeatIds.length !== passengers) {
      alert(`Please select ${passengers} seat(s) to proceed.`)
      return
    }
    const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id))
    onSeatsSelected(selectedSeats)
  }

  const renderSeat = (seat: Seat) => {
    // Gap for aisle between C and D
    const isAisle = seat.col === "C"

    return (
      <div key={seat.id} className={cn("flex items-center", isAisle && "mr-8")}>
        <button
          onClick={() => handleSeatClick(seat)}
          disabled={seat.status === "occupied"}
          className={cn(
            "w-8 h-8 m-1 rounded-t-lg rounded-b-md text-[10px] font-medium transition-all flex items-center justify-center border",
            seat.status === "available" && "bg-white border-blue-200 hover:bg-blue-50 text-blue-900",
            seat.status === "occupied" && "bg-neutral-200 border-transparent text-neutral-400 cursor-not-allowed",
            seat.status === "selected" && "bg-primary border-primary text-white shadow-md transform scale-105",
            seat.class === "First" && seat.status === "available" && "border-purple-200 bg-purple-50 text-purple-900",
            seat.class === "Business" && seat.status === "available" && "border-indigo-200 bg-indigo-50 text-indigo-900"
          )}
        >
          {seat.id}
        </button>
      </div>
    )
  }

  // Group seats by row for rendering
  const rows = Array.from(new Set(seats.map((s) => s.row)))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Select Seats</h2>
          <p className="text-neutral-500">
             Select {passengers} seat{passengers > 1 ? "s" : ""} for your trip
          </p>
        </div>
        <div className="flex gap-4 text-sm">
           <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-blue-200 rounded"></div> Available</div>
           <div className="flex items-center gap-2"><div className="w-4 h-4 bg-primary rounded"></div> Selected</div>
           <div className="flex items-center gap-2"><div className="w-4 h-4 bg-neutral-200 rounded"></div> Occupied</div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Map Container */}
        <Card className="flex-1 p-8 bg-neutral-50 border border-border flex flex-col items-center overflow-y-auto max-h-[600px]">
          {/* Cockpit Indicator */}
          <div className="w-full max-w-[300px] h-16 border-t-4 border-l-4 border-r-4 border-neutral-300 rounded-t-full mb-8 flex items-center justify-center text-neutral-400 font-mono text-sm bg-white/50">
             COCKPIT
          </div>
          
          <div className="space-y-2">
            {rows.map((rowNum) => {
              const rowSeats = seats.filter((s) => s.row === rowNum)
              return (
                <div key={rowNum} className="flex justify-center">
                  <div className="w-6 text-center text-xs text-neutral-400 pt-2 mr-2">{rowNum}</div>
                  {rowSeats.map(renderSeat)}
                </div>
              )
            })}
          </div>
          {loading && <div className="mt-4 text-sm text-neutral-500">Loading seats...</div>}
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </Card>

        {/* Legend / Info Sidebar */}
        <div className="w-64 space-y-4">
           <Card className="p-4 border border-border">
              <h3 className="font-semibold mb-2">Selected Seats</h3>
              {selectedSeatIds.length === 0 ? (
                 <p className="text-sm text-neutral-500">No seats selected</p>
              ) : (
                 <div className="space-y-2">
                    {seats.filter(s => selectedSeatIds.includes(s.id)).map(seat => (
                       <div key={seat.id} className="flex justify-between text-sm">
                          <span>Seat {seat.id}</span>
                          <span className="font-medium">${seat.price}</span>
                       </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                       <span>Total Extra</span>
                       <span>${seats.filter(s => selectedSeatIds.includes(s.id)).reduce((acc, s) => acc + s.price, 0)}</span>
                    </div>
                 </div>
              )}
           </Card>
           
           <Button onClick={handleConfirm} className="w-full bg-primary hover:bg-primary-dark text-white">
              Confirm Selection
           </Button>
           <Button variant="outline" onClick={onBack} className="w-full">
              Back
           </Button>
        </div>
      </div>
    </div>
  )
}
