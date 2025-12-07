"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RefundRequest {
  refund_id: string
  amount: string
  reason: string
  status: string
  request_date: string
  customer_name: string
  customer_email: string
  booking_code: string
}

export default function RefundApprovalPage() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchRefunds = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/refunds")
      if (!res.ok) throw new Error("Failed to fetch refund requests")
      const data = await res.json()
      setRefunds(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRefunds()
  }, [])

  const handleProcessRefund = async (refundId: string, action: 'approve' | 'reject') => {
    setProcessingId(refundId)
    try {
      const res = await fetch("/api/admin/refunds/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refundId, action }),
      })

      if (!res.ok) throw new Error("Failed to process refund")

      // Remove the processed refund from the list
      setRefunds(prev => prev.filter(r => r.refund_id !== refundId))
      
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Refund Requests</h1>
          <p className="text-neutral-500 mt-1">Review and approve customer refund requests</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchRefunds} 
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && refunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading requests...
                  </div>
                </TableCell>
              </TableRow>
            ) : refunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                  No pending refund requests found.
                </TableCell>
              </TableRow>
            ) : (
              refunds.map((refund) => (
                <TableRow key={refund.refund_id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-neutral-900">{refund.customer_name}</p>
                      <p className="text-xs text-neutral-500">{refund.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{refund.booking_code}</TableCell>
                  <TableCell className="font-bold text-neutral-900">
                    ${Number(refund.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-neutral-600" title={refund.reason}>
                    {refund.reason || "No reason provided"}
                  </TableCell>
                  <TableCell className="text-neutral-500 text-sm">
                    {new Date(refund.request_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={processingId === refund.refund_id}
                        onClick={() => handleProcessRefund(refund.refund_id, 'approve')}
                      >
                        {processingId === refund.refund_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span className="ml-1 sr-only sm:not-sr-only">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={processingId === refund.refund_id}
                        onClick={() => handleProcessRefund(refund.refund_id, 'reject')}
                      >
                        {processingId === refund.refund_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="ml-1 sr-only sm:not-sr-only">Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}