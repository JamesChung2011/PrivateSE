"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"

export interface FlightSearchParams {
  from: string
  to: string
  departDate: string
  returnDate?: string
  passengers: number
  tripType: "oneway" | "roundtrip"
}

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void
}

export function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("roundtrip")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departDate, setDepartDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")

  const handleSearch = () => {
    if (!from || !to || !departDate) {
      alert("Please fill in all required fields")
      return
    }

    onSearch({
      from,
      to,
      departDate,
      returnDate: tripType === "roundtrip" ? returnDate : undefined,
      passengers: Number.parseInt(passengers),
      tripType,
    })
  }

  return (
    <Card className="p-8 border border-border bg-gradient-to-br from-neutral-50 to-white">
      {/* Trip Type Selection */}
      <div className="flex gap-6 mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="roundtrip"
            checked={tripType === "roundtrip"}
            onChange={(e) => setTripType(e.target.value as "oneway" | "roundtrip")}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-neutral-700">Round Trip</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="oneway"
            checked={tripType === "oneway"}
            onChange={(e) => setTripType(e.target.value as "oneway" | "roundtrip")}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-neutral-700">One Way</span>
        </label>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">From</label>
          <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-white hover:border-primary/50 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Departure city"
              value={from}
              onChange={(e) => setFrom(e.target.value.toUpperCase())}
              maxLength="3"
              className="flex-1 border-0 p-0 text-neutral-700 placeholder-neutral-400 bg-transparent font-medium outline-none"
            />
          </div>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">To</label>
          <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-white hover:border-primary/50 transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Arrival city"
              value={to}
              onChange={(e) => setTo(e.target.value.toUpperCase())}
              maxLength="3"
              className="flex-1 border-0 p-0 text-neutral-700 placeholder-neutral-400 bg-transparent font-medium outline-none"
            />
          </div>
        </div>

        {/* Depart Date */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Depart</label>
          <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-white hover:border-primary/50 transition-colors">
            <Calendar className="w-4 h-4 text-primary" />
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="flex-1 border-0 p-0 text-neutral-700 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Return Date */}
        {tripType === "roundtrip" && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Return</label>
            <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-white hover:border-primary/50 transition-colors">
              <Calendar className="w-4 h-4 text-primary" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="flex-1 border-0 p-0 text-neutral-700 bg-transparent outline-none"
              />
            </div>
          </div>
        )}

        {/* Passengers */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Passengers</label>
          <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-white hover:border-primary/50 transition-colors">
            <Users className="w-4 h-4 text-primary" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="flex-1 border-0 p-0 text-neutral-700 bg-transparent outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        className="w-full bg-primary hover:bg-primary-dark text-white h-12 text-base font-semibold gap-2"
      >
        <ArrowRight className="w-5 h-5" />
        Search Flights
      </Button>
    </Card>
  )
}
