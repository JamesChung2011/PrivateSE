"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { FlightSearchForm, type FlightSearchParams } from "@/components/flight-search-form"
import { FlightFilters, type FlightFiltersState } from "@/components/flight-filters"
import { FlightCard, type Flight } from "@/components/flight-card"
import { PassengerDetailsForm, type PassengerInfo } from "@/components/passenger-details-form"
import { SeatMap, type Seat } from "@/components/ui/seat-map"
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
import { ArrowLeft, Loader2, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BookFlightPage() {
  // Wizard State: search -> select -> passengers -> seats -> confirm
  const [step, setStep] = useState<"search" | "select" | "passengers" | "seats" | "confirm">("search")
  
  // Data State
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  
  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // 1. Handle Search
  const handleSearch = async (params: FlightSearchParams) => {
    setIsLoading(true)
    setError("")
    setSearchParams(params)

    try {
      const query = new URLSearchParams({
        from: params.from,
        to: params.to,
        date: params.departDate.toISOString(),
        passengers: params.passengers.toString()
      })

      const response = await fetch(`/api/flights/search?${query}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch flights")
      }

      const data = await response.json()
      const sorted = [...data].sort((a: Flight, b: Flight) => a.price - b.price)
      setFlights(sorted)
      setStep("select")

    } catch (err) {
      console.error(err)
      setError("Could not find flights. Please check your dates or route.")
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Handle Filter/Sort Change
  const handleFilterChange = (filters: FlightFiltersState) => {
     // In a real app, this would filter 'flights' state or refetch API
     // For now, we'll just log it or do basic client-side sort
     let sorted = [...flights]
     if (filters.sortBy === "price_asc") sorted.sort((a, b) => a.price - b.price)
     if (filters.sortBy === "price_desc") sorted.sort((a, b) => b.price - a.price)
     // Add more sort logic as needed
     setFlights(sorted)
  }

  // 3. Handle Flight Selection
  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    setStep("passengers") 
  }

  // 4. Handle Passenger Info
  const handlePassengerSubmit = (info: PassengerInfo[]) => {
    setPassengerInfo(info)
    setStep("seats") // Move to seat selection
  }
  
  // 5. Handle Seat Selection
  const handleSeatsConfirmed = (seats: Seat[]) => {
     setSelectedSeats(seats)
     setStep("confirm")
  }

  // 6. Confirm & Pay
  const handleConfirmBooking = async () => {
    if (!selectedFlight || !searchParams || !user) {
      alert("Please sign in to complete your booking")
      return
    }
    if (selectedSeats.length !== searchParams.passengers) {
      alert("Please select seats for all passengers")
      return
    }
    
    // Calculate total including seats
    const seatTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0)
    const flightTotal = selectedFlight.price * searchParams.passengers
    const taxes = flightTotal * 0.1
    const fees = 20
    const finalTotal = flightTotal + seatTotal + taxes + fees

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          userId: user.id,
          passengers: passengerInfo,
          seats: selectedSeats.map(s => s.id),
          totalAmount: finalTotal
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Booking failed")
      }

      const params = new URLSearchParams({
        bookingId: data.bookingId,
        amount: finalTotal.toString(),
        route: selectedFlight.route,
        date: searchParams.departDate.toISOString(),
        pax: searchParams.passengers.toString(),
      })
      router.push(`/dashboard/customer/payment?${params.toString()}`)

    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }
  
  // Calculation Helpers for Confirmation
  const calculateCosts = () => {
     if (!selectedFlight || !searchParams) return { flightTotal: 0, seatTotal: 0, taxes: 0, fees: 0, grandTotal: 0 }
     
     const flightTotal = selectedFlight.price * searchParams.passengers
     const seatTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0)
     const taxes = flightTotal * 0.10 // 10% tax
     const fees = 25 // Flat fee
     const grandTotal = flightTotal + seatTotal + taxes + fees
     
     return { flightTotal, seatTotal, taxes, fees, grandTotal }
  }
  
  const costs = calculateCosts()

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
                {searchParams.tripType === "round-trip" && " (Round Trip)"}
                {" • "}{searchParams.passengers} Passenger{searchParams.passengers > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FlightFilters onFilterChange={handleFilterChange} />
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

      {/* Step 4: Seat Selection */}
      {step === "seats" && searchParams && selectedFlight && (
         <SeatMap 
            passengers={searchParams.passengers} 
            instanceId={selectedFlight.id}
            onSeatsSelected={handleSeatsConfirmed}
            onBack={() => setStep("passengers")}
         />
      )}

      {/* Step 5: Confirmation Dialog */}
      <Dialog open={step === "confirm"} onOpenChange={(open) => !open && setStep("seats")}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>Review full price breakdown before payment</DialogDescription>
          </DialogHeader>

          {selectedFlight && searchParams && (
            <div className="space-y-4">
              {/* Flight Summary */}
              <Card className="p-4 bg-neutral-50 border border-border">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-semibold text-sm text-primary">Flight Details</h3>
                   <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">{searchParams.tripType}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-neutral-500">Airline</p>
                    <p className="font-medium">{selectedFlight.airline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Route</p>
                    <p className="font-medium">{selectedFlight.route}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-xs text-neutral-500">Seats</p>
                     <p className="font-medium">{selectedSeats.map(s => s.id).join(", ")}</p>
                  </div>
                </div>
              </Card>

              {/* Transparent Price Breakdown */}
              <Card className="p-4 bg-white border border-border">
                <h3 className="font-semibold text-sm mb-3">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Base Fare (x{searchParams.passengers})</span>
                    <span>${costs.flightTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Seat Selection</span>
                    <span>${costs.seatTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Taxes & Surcharges (10%)</span>
                    <span>${costs.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Booking Fees</span>
                    <span>${costs.fees.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${costs.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 items-start text-xs text-neutral-500 bg-neutral-50 p-2 rounded">
                   <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                   <p>Includes all applicable taxes and fees. No hidden charges.</p>
                </div>
              </Card>
            </div>
          )}

          <DialogFooter className="gap-3 sm:justify-between">
            <Button variant="outline" onClick={() => setStep("seats")}>
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
