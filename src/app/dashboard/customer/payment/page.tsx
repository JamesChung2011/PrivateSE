"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PaymentForm } from "@/components/payment-form"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface PendingBooking {
  id: string
  amount: number
  route: string
  date: string
  passengers: number
}

export default function PaymentPage() {
  const [completedPayment, setCompletedPayment] = useState(false)
  const [selectedBooking] = useState<PendingBooking>({
    id: "8a9623a7-9ce6-4373-a415-a95c4f49593c", //testing ONLY
    amount: 980,
    route: "NYC → LAX",
    date: "2025-02-15",
    passengers: 2,
  })

  const handlePaymentSuccess = () => {
    setCompletedPayment(true)
    // In a real app, this would update the booking status
    setTimeout(() => {
      // Could redirect or show a success screen
    }, 1000)
  }

  if (completedPayment) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/customer">
          <Button variant="outline" className="gap-2 border-border mb-6 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="p-8 text-center border border-border">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Payment Successful!</h1>
          <p className="text-neutral-600 mb-6">Your booking has been confirmed and payment processed.</p>

          <Card className="p-6 bg-neutral-50 border border-border mb-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Booking ID</p>
                <p className="font-semibold text-neutral-900">{selectedBooking.id}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Paid</p>
                <p className="font-semibold text-neutral-900">${selectedBooking.amount}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Route</p>
                <p className="font-semibold text-neutral-900">{selectedBooking.route}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Departure</p>
                <p className="font-semibold text-neutral-900">{selectedBooking.date}</p>
              </div>
            </div>
          </Card>

          <p className="text-sm text-neutral-600 mb-6">
            A confirmation email has been sent to your registered email address with your e-ticket and booking details.
          </p>

          <div className="flex gap-3 justify-center">
            <Link href="/dashboard/customer/bookings">
              <Button className="bg-primary hover:bg-primary-dark text-white">View My Bookings</Button>
            </Link>
            <Link href="/dashboard/customer">
              <Button variant="outline" className="border-border bg-transparent">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard/customer">
          <Button variant="outline" className="gap-2 border-border mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900 mt-4">Complete Payment</h1>
        <p className="text-neutral-500 mt-1">Secure checkout for your flight booking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <PaymentForm
            amount={selectedBooking.amount}
            bookingId={selectedBooking.id}
            onSuccess={handlePaymentSuccess}
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Route</span>
                <span className="font-medium text-neutral-900">{selectedBooking.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Date</span>
                <span className="font-medium text-neutral-900">{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Passengers</span>
                <span className="font-medium text-neutral-900">{selectedBooking.passengers}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">${selectedBooking.amount}</span>
              </div>
            </div>
          </Card>

          {/* Security Info */}
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-2">🔒 Secure Payment</p>
            <p className="text-xs text-blue-800">Your payment is encrypted with industry-standard SSL technology</p>
          </Card>

          {/* Support */}
          <Card className="p-4 bg-neutral-50 border border-border">
            <p className="text-sm font-medium text-neutral-900 mb-2">Need Help?</p>
            <p className="text-xs text-neutral-600 mb-3">Contact our support team for payment assistance</p>
            <Link href="/dashboard/customer/support">
              <Button size="sm" variant="outline" className="w-full border-border bg-transparent">
                Chat with Support
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
