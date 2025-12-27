"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Users } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface FlightSearchParams {
  from: string
  to: string
  departDate: Date
  returnDate?: Date
  passengers: number
  tripType: "one-way" | "round-trip"
}

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void
}

export function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  // Store date as string YYYY-MM-DD for native input
  const [departDate, setDepartDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [returnDate, setReturnDate] = useState<string>("")
  const [passengers, setPassengers] = useState(1)
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!from || !to || !departDate) return

    onSearch({
      from,
      to,
      departDate: new Date(departDate),
      returnDate: tripType === "round-trip" && returnDate ? new Date(returnDate) : undefined,
      passengers,
      tripType
    })
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Selection */}
        <RadioGroup 
          defaultValue="one-way" 
          value={tripType} 
          onValueChange={(val: string) => setTripType(val as "one-way" | "round-trip")}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="one-way" id="one-way" />
            <Label htmlFor="one-way" className="cursor-pointer">One-way</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="round-trip" id="round-trip" />
            <Label htmlFor="round-trip" className="cursor-pointer">Round-trip</Label>
          </div>
        </RadioGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* From */}
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                id="from"
                placeholder="Origin City (e.g. NYC)"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="pl-9 border-border"
                required
              />
            </div>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <Input
                id="to"
                placeholder="Destination (e.g. LAX)"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="pl-9 border-border"
                required
              />
            </div>
          </div>

          {/* Dates - Using Native HTML Input for reliability */}
          <div className={`space-y-2 ${tripType === "round-trip" ? "col-span-1" : "lg:col-span-1"}`}>
            <Label htmlFor="departDate">Departure</Label>
            <Input 
              type="date"
              id="departDate"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="border-border"
              required
            />
          </div>

          {tripType === "round-trip" && (
            <div className="space-y-2 col-span-1">
              <Label htmlFor="returnDate">Return</Label>
              <Input 
                type="date"
                id="returnDate"
                value={returnDate}
                min={departDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="border-border"
                required
              />
            </div>
          )}

          {/* Passengers & Search Button */}
          <div className={`space-y-2 ${tripType === "round-trip" ? "lg:col-span-4 flex items-end justify-between gap-4" : "lg:col-span-1"}`}>
             <div className={tripType === "round-trip" ? "w-1/4" : "w-full"}>
                <Label htmlFor="passengers">Passengers</Label>
                <div className="relative mt-2">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <Input
                    id="passengers"
                    type="number"
                    min={1}
                    max={9}
                    value={passengers}
                    onChange={(e) => setPassengers(Number.parseInt(e.target.value))}
                    className="pl-9 border-border"
                  />
                </div>
             </div>

             <Button 
                type="submit" 
                className={`bg-primary hover:bg-primary-dark text-white ${tripType === "round-trip" ? "w-3/4" : "w-full mt-8"}`}
              >
               Search Flights
             </Button>
          </div>
        </div>
      </form>
    </div>
  )
}