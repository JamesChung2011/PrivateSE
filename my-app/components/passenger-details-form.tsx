"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, User } from "lucide-react"

export interface PassengerInfo {
  id: number
  fullName: string
  dob: string
}

interface PassengerDetailsFormProps {
  passengerCount: number
  onSubmit: (passengers: PassengerInfo[]) => void
  onBack: () => void
}

export function PassengerDetailsForm({ passengerCount, onSubmit, onBack }: PassengerDetailsFormProps) {
  // Initialize state with empty passengers based on count
  const [passengers, setPassengers] = useState<PassengerInfo[]>(
    Array.from({ length: passengerCount }).map((_, i) => ({
      id: i + 1,
      fullName: "",
      dob: "",
    }))
  )

  const handleInputChange = (id: number, field: keyof PassengerInfo, value: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Basic validation
    const isValid = passengers.every((p) => p.fullName.trim() !== "" && p.dob !== "")
    if (!isValid) {
      alert("Please fill in all passenger details.")
      return
    }
    onSubmit(passengers)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Passenger Details</h2>
          <p className="text-sm text-neutral-500">
            Please enter the information for all {passengerCount} passenger{passengerCount > 1 ? "s" : ""}.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {passengers.map((passenger, index) => (
          <Card key={passenger.id} className="p-6 border border-border">
            <div className="flex items-center gap-2 mb-4 text-primary font-medium">
              <User className="w-4 h-4" />
              <span>Passenger {index + 1}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${passenger.id}`}>Full Name (as on ID)</Label>
                <Input
                  id={`name-${passenger.id}`}
                  placeholder="e.g. Nguyen Van A"
                  value={passenger.fullName}
                  onChange={(e) => handleInputChange(passenger.id, "fullName", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`dob-${passenger.id}`}>Date of Birth</Label>
                <Input
                  id={`dob-${passenger.id}`}
                  type="date"
                  value={passenger.dob}
                  onChange={(e) => handleInputChange(passenger.id, "dob", e.target.value)}
                  required
                  max={new Date().toISOString().split("T")[0]} // Cannot be in future
                />
              </div>
            </div>
          </Card>
        ))}

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white gap-2 px-8">
            Continue to Payment
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}