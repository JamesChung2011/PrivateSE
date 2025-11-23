"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentFormProps {
  amount: number
  bookingId: string
  onSuccess?: (transactionId: string) => void
  isLoading?: boolean
}

export function PaymentForm({ amount, bookingId, onSuccess, isLoading = false }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^\d]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Frontend Validation
    if (cardNumber.replace(/\s/g, "").length < 15) {
      setError("Invalid card number length")
      return
    }
    if (cvv.length < 3) {
      setError("Invalid CVV")
      return
    }

    setProcessing(true)

    try {
      // API call to process payment
      const response = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount,
          paymentMethod: "Credit Card",
          cardDetails: {
            number: cardNumber,
            expiry: expiryDate,
            cvv: cvv,
            name: cardholderName
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment failed")
      }

      if (onSuccess) onSuccess(data.transactionId)
    } catch (err: any) {
      setError(err.message || "Something went wrong with the payment")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card className="p-6 border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Booking Amount */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-neutral-600">Total Amount Due</p>
              <p className="text-3xl font-bold text-primary">${amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Booking ID</p>
              <p className="font-mono font-medium text-sm">{bookingId}</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cardholder Name */}
        <div>
          <Label htmlFor="cardholder" className="text-sm font-medium text-neutral-700">
            Cardholder Name
          </Label>
          <Input
            id="cardholder"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="John Doe"
            className="mt-2 border-border"
            disabled={processing}
            required
          />
        </div>

        {/* Card Number */}
        <div>
          <Label htmlFor="card-number" className="text-sm font-medium text-neutral-700">
            Card Number
          </Label>
          <div className="relative">
            <Input
              id="card-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="mt-2 border-border font-mono pl-10"
              disabled={processing}
              maxLength={19}
              required
            />
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 pt-2" />
          </div>
          <p className="text-xs text-neutral-500 mt-1">Visa, Mastercard, Amex</p>
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry" className="text-sm font-medium text-neutral-700">
              Expiry Date
            </Label>
            <Input
              id="expiry"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/YY"
              className="mt-2 border-border font-mono"
              disabled={processing}
              maxLength={5}
              required
            />
          </div>
          <div>
            <Label htmlFor="cvv" className="text-sm font-medium text-neutral-700">
              CVV
            </Label>
            <Input
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.slice(0, 4))}
              placeholder="123"
              type="password"
              className="mt-2 border-border font-mono"
              disabled={processing}
              maxLength={4}
              required
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
          <Lock className="w-4 h-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={processing || isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white h-11"
        >
          {processing || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Secure Payment...
            </>
          ) : (
            `Pay $${amount.toFixed(2)} Now`
          )}
        </Button>
      </form>
    </Card>
  )
}
