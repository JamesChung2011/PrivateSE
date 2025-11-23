"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
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
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BookFlightPage() {
  // Wizard State: search -> select -> passengers -> confirm
  const [step, setStep] = useState<"search" | "select" | "passengers" | "confirm">("search")
  
  // Data State
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  
  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { user } = useUser()
  const router = useRouter()

  // 1. Handle Search (Fetch from API)
  const handleSearch = async (params: FlightSearchParams) => {
    setIsLoading(true)
    setError("")
    setSearchParams(params)

    try {
      const query = new URLSearchParams({
        from: params.from,
        to: params.to,
        date: params.departDate,
        passengers: params.passengers.toString()
      })

      const response = await fetch(`/api/flights/search?${query}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch flights")
      }

      const data = await response.json()
      setFlights(data)
      setStep("select")

    } catch (err) {
      console.error(err)
      setError("Could not find flights. Please check your dates or route.")
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Handle Flight Selection
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setStep("passengers") // Proceed to passenger details
  }

  // 3. Handle Passenger Info Submit
  const handlePassengerSubmit = (info: PassengerInfo[]) => {
    setPassengerInfo(info)
    setStep("confirm")
  }

  // 4. Create Booking (API Call)
  const handleConfirmBooking = async () => {
    if (!selectedFlight || !searchParams || !user) {
      alert("Please sign in to complete your booking")
      return
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId: selectedFlight.id, // UUID from database
          userId: user.id,
          passengers: passengerInfo
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Booking failed")
      }

      // Redirect to Payment with real Booking ID
      router.push(`/dashboard/customer/payment?bookingId=${data.bookingId}`)

    } catch (err: any) {
      alert(`Error: ${err.message}`)
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

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Search Form */}
      {step === "search" && (
        <div className="relative">
          <FlightSearchForm onSearch={handleSearch} />
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl z-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
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
                {" • "}{searchParams.passengers} Passenger{searchParams.passengers > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FlightFilters onFilterChange={() => {}} />
            </div>
            <div className="lg:col-span-3 space-y-4">
              {flights.length === 0 ? (
                <Card className="p-8 text-center border-dashed">
                  <p className="text-neutral-500">No flights found for this route and date.</p>
                  <Button variant="link" onClick={() => setStep("search")}>Try another date</Button>
                </Card>
              ) : (
                <>
                  <p className="text-sm text-neutral-600">{flights.length} flights found</p>
                  {flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
                  ))}
                </>
              )}
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

      {/* Step 4: Confirmation Dialog */}
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
    </div>
  )
}