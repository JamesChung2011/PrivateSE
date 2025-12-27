"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export interface FlightFiltersState {
  airlines: string[]
  maxPrice: number
  stops: number[]
  departureTimeRange: [number, number]
  sortBy: string
}

interface FlightFiltersProps {
  onFilterChange: (filters: FlightFiltersState) => void
}

const airlines = ["FlightHub Air", "Sky Express", "Air Global", "Eagle Airways"]
const timeSlots = ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 24:00"]

export function FlightFilters({ onFilterChange }: FlightFiltersProps) {
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [selectedStops, setSelectedStops] = useState<number[]>([0, 1, 2])
  const [sortBy, setSortBy] = useState("price_asc")

  const updateFilters = (updates: Partial<FlightFiltersState>) => {
    onFilterChange({
      airlines: selectedAirlines,
      maxPrice,
      stops: selectedStops,
      departureTimeRange: [0, 24],
      sortBy,
      ...updates
    })
  }

  const handleAirlineChange = (airline: string) => {
    const updated = selectedAirlines.includes(airline)
      ? selectedAirlines.filter((a) => a !== airline)
      : [...selectedAirlines, airline]
    setSelectedAirlines(updated)
    updateFilters({ airlines: updated })
  }

  const handlePriceChange = (value: number[]) => {
    setMaxPrice(value[0])
    updateFilters({ maxPrice: value[0] })
  }

  const handleStopsChange = (stops: number) => {
    const updated = selectedStops.includes(stops) ? selectedStops.filter((s) => s !== stops) : [...selectedStops, stops]
    setSelectedStops(updated)
    updateFilters({ stops: updated })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateFilters({ sortBy: value })
  }

  return (
    <div className="space-y-6">
      {/* Sort By */}
      <Card className="p-4 border border-border">
         <h4 className="text-sm font-medium text-neutral-700 mb-3">Sort Results By</h4>
         <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="duration_asc">Duration: Shortest</SelectItem>
              <SelectItem value="departure_asc">Departure: Earliest</SelectItem>
            </SelectContent>
         </Select>
      </Card>

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
    </div>
  )
}