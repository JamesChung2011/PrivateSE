"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export interface FlightFilters {
  airlines: string[]
  maxPrice: number
  stops: number[]
  departureTimeRange: [number, number]
}

interface FlightFiltersProps {
  onFilterChange: (filters: FlightFilters) => void
}

const airlines = ["FlightHub Air", "Sky Express", "Air Global", "Eagle Airways"]
const timeSlots = ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 24:00"]

export function FlightFilters({ onFilterChange }: FlightFiltersProps) {
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [selectedStops, setSelectedStops] = useState<number[]>([0, 1, 2])

  const handleAirlineChange = (airline: string) => {
    const updated = selectedAirlines.includes(airline)
      ? selectedAirlines.filter((a) => a !== airline)
      : [...selectedAirlines, airline]
    setSelectedAirlines(updated)
    onFilterChange({ airlines: updated, maxPrice, stops: selectedStops, departureTimeRange: [0, 24] })
  }

  const handlePriceChange = (value: number[]) => {
    setMaxPrice(value[0])
    onFilterChange({
      airlines: selectedAirlines,
      maxPrice: value[0],
      stops: selectedStops,
      departureTimeRange: [0, 24],
    })
  }

  const handleStopsChange = (stops: number) => {
    const updated = selectedStops.includes(stops) ? selectedStops.filter((s) => s !== stops) : [...selectedStops, stops]
    setSelectedStops(updated)
    onFilterChange({ airlines: selectedAirlines, maxPrice, stops: updated, departureTimeRange: [0, 24] })
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="font-semibold text-neutral-900 mb-6">Filters</h3>

      {/* Price Range */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-neutral-700 mb-4 block">Max Price: ${maxPrice}</Label>
        <Slider min={0} max={1000} step={50} value={[maxPrice]} onValueChange={handlePriceChange} className="w-full" />
      </div>

      {/* Stops */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-neutral-700 mb-3">Number of Stops</h4>
        <div className="space-y-3">
          {[0, 1, 2].map((stop) => (
            <label key={stop} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={selectedStops.includes(stop)} onCheckedChange={() => handleStopsChange(stop)} />
              <span className="text-sm text-neutral-700">
                {stop === 0 ? "Nonstop" : `${stop} Stop${stop > 1 ? "s" : ""}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-neutral-700 mb-3">Airlines</h4>
        <div className="space-y-3">
          {airlines.map((airline) => (
            <label key={airline} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedAirlines.includes(airline)}
                onCheckedChange={() => handleAirlineChange(airline)}
              />
              <span className="text-sm text-neutral-700">{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <h4 className="text-sm font-medium text-neutral-700 mb-3">Departure Time</h4>
        <div className="space-y-3">
          {timeSlots.map((slot) => (
            <label key={slot} className="flex items-center gap-3 cursor-pointer">
              <Checkbox />
              <span className="text-sm text-neutral-700">{slot}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  )
}
