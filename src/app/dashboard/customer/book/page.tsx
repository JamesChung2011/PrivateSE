"use client"

import { useState } from "react"
import { FlightSearchForm, type FlightSearchParams } from "@/components/flight-search-form"
import { FlightFilters } from "@/components/flight-filters"
import { FlightCard, type Flight } from "@/components/flight-card"
import { PassengerDetailsForm, type PassengerInfo } from "@/components/passenger-details-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

// Mock flight data
const mockFlights: Flight[] = [
  {
    id: "FL001",
    airline: "FlightHub Air",
    departure: "2025-02-15",
    arrival: "2025-02-15",
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
    departure: "2025-02-15",
    arrival: "2025-02-15",
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
    departure: "2025-02-15",
    arrival: "2025-02-15",
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
    departure: "2025-02-15",
    arrival: "2025-02-15",
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
    departure: "2025-02-15",
    arrival: "2025-02-15",
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

export default function BookFlightPage() {
  // Wizard State
  const [step, setStep] = useState<"search" | "select" | "passengers" | "confirm">("search")
  
  // Data State
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo[]>([])
  const [flights] = useState(mockFlights)

  // Handlers
  const handleSearch = (params: FlightSearchParams) => {
    setSearchParams(params)
    setStep("select")
  }

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setStep("passengers")
  }

  const handlePassengerSubmit = (info: PassengerInfo[]) => {
    setPassengerInfo(info)
    setStep("confirm")
  }

  const handleConfirmBooking = async () => {
    // This is where you will eventually call the backend API
    // const response = await fetch('/api/bookings', { method: 'POST', body: JSON.stringify({ ... }) })
    
    if (selectedFlight && searchParams) {
      alert(
        `Booking confirmed!\nFlight: ${selectedFlight.id}\nPassengers: ${passengerInfo.map(p => p.fullName).join(", ")}`
      )
      // Reset flow
      setStep("search")
      setSelectedFlight(null)
      setSearchParams(null)
      setPassengerInfo([])
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {step === "search" && (
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Book Your Flight</h1>
          <p className="text-neutral-500 mt-1">Find and book your perfect flight in minutes</p>
        </div>
      )}

      {/* Step 1: Search Form */}
      {step === "search" && (
        <FlightSearchForm onSearch={handleSearch} />
      )}

      {/* Step 2: Flight Selection */}
      {step === "select" && searchParams && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("search")}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {searchParams.from} → {searchParams.to}
              </h2>
              <p className="text-sm text-neutral-500">
                {new Date(searchParams.departDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                {searchParams.passengers} Passenger{searchParams.passengers > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FlightFilters onFilterChange={() => {}} />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <p className="text-sm text-neutral-600">{flights.length} flights found</p>
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Passenger Details */}
      {step === "passengers" && searchParams && selectedFlight && (
        <PassengerDetailsForm 
          passengerCount={searchParams.passengers}
          onSubmit={handlePassengerSubmit}
          onBack={() => setStep("select")}
        />
      )}

      {/* Step 4: Confirmation Dialog (Now controlled via state step) */}
      <Dialog open={step === "confirm"} onOpenChange={(open) => !open && setStep("passengers")}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>Review details before payment</DialogDescription>
          </DialogHeader>

          {selectedFlight && searchParams && (
            <div className="space-y-4">
              {/* Flight Summary */}
              <Card className="p-4 bg-neutral-50 border border-border">
                <h3 className="font-semibold text-sm mb-3 text-primary">Flight Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-neutral-500">Airline</p>
                    <p className="font-medium">{selectedFlight.airline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Route</p>
                    <p className="font-medium">{selectedFlight.route}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Departure</p>
                    <p className="font-medium">{selectedFlight.departTime} - {selectedFlight.departure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Duration</p>
                    <p className="font-medium">{selectedFlight.duration}</p>
                  </div>
                </div>
              </Card>

              {/* Passenger Summary */}
              <Card className="p-4 bg-neutral-50 border border-border">
                <h3 className="font-semibold text-sm mb-3 text-primary">Passengers ({passengerInfo.length})</h3>
                <div className="space-y-2">
                  {passengerInfo.map((p, i) => (
                    <div key={i} className="text-sm flex justify-between border-b border-neutral-200 pb-1 last:border-0 last:pb-0">
                      <span className="font-medium">{p.fullName}</span>
                      <span className="text-neutral-500">{p.dob}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Price Breakdown */}
              <Card className="p-4 bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Price</p>
                    <p className="text-2xl font-bold text-primary">${selectedFlight.price * searchParams.passengers}</p>
                  </div>
                  <div className="text-right text-sm text-neutral-600">
                    {selectedFlight.price} x {searchParams.passengers}
                  </div>
                </div>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-3 sm:justify-between">
            <Button variant="outline" onClick={() => setStep("passengers")}>
              Back
            </Button>
            <Button onClick={handleConfirmBooking} className="bg-primary hover:bg-primary-dark text-white">
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promotional Card (Only show on search step) */}
      {step === "search" && (
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Special Offer</h3>
          <p className="text-neutral-700 mb-4">
            Get 20% off on your next booking with code SPRING20 on flights over $200!
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-lg bg-white border border-border font-mono font-semibold text-neutral-900">
              SPRING20
            </span>
            <span className="text-neutral-600">Copy code</span>
          </div>
        </Card>
      )}
    </div>
  )
}