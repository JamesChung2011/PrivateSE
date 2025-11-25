"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane } from "lucide-react"

export interface Flight {
  id: string
  airline: string
  departure: string
  arrival: string
  departTime: string
  arrivalTime: string
  duration: string
  route: string
  price: number
  stops: number
  aircraft: string
  availableSeats: number
}

interface FlightCardProps {
  flight: Flight
  onSelect: (flight: Flight) => void
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  return (
    <Card className="p-6 border border-border hover:shadow-md transition-all hover:border-primary/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Flight Info */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            {/* Departure */}
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{flight.departTime}</p>
              <p className="text-sm text-neutral-500 mt-1">{flight.route.split(" → ")[0]}</p>
            </div>

            {/* Flight Path */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 flex-1 bg-neutral-200 rounded-full" />
                <Plane className="w-4 h-4 text-primary" />
                <div className="h-1 flex-1 bg-neutral-200 rounded-full" />
              </div>
              <p className="text-xs text-neutral-500 text-center">{flight.duration}</p>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{flight.arrivalTime}</p>
              <p className="text-sm text-neutral-500 mt-1">{flight.route.split(" → ")[1]}</p>
            </div>
          </div>

          {/* Flight Details */}
          <div className="space-y-2">
            <p className="text-sm text-neutral-700">
              <span className="font-medium">{flight.airline}</span> • {flight.aircraft}
            </p>
            <div className="flex flex-wrap gap-2">
              {flight.stops === 0 && <Badge className="bg-success/10 text-success border-success/20">Nonstop</Badge>}
              {flight.stops > 0 && (
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  {flight.stops} Stop{flight.stops > 1 ? "s" : ""}
                </Badge>
              )}
              <Badge className="bg-info/10 text-info border-info/20" variant="outline">
                {flight.availableSeats} seats
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Price & Action */}
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">${flight.price}</div>
            <p className="text-xs text-neutral-500 mt-1">per passenger</p>
          </div>
          <Button
            onClick={() => onSelect(flight)}
            className="bg-primary hover:bg-primary-dark text-white w-full md:w-auto"
          >
            Select Flight
          </Button>
        </div>
      </div>
    </Card>
  )
}
