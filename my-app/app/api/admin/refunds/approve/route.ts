import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// POST /api/admin/refunds/approve - Approve or Reject a refund
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { refundId, action } = body // action: 'approve' or 'reject'

    if (!refundId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid request. 'refundId' and valid 'action' are required." },
        { status: 400 }
      )
    }

    const status = action === 'approve' ? 'Approved' : 'Rejected'

    // Update refund status
    const updatedRefund = await prisma.refund.update({
      where: { refund_id: refundId },
      data: {
        status: status,
        processed_at: new Date() // Update timestamp to now
      }
    })

    return NextResponse.json({ 
      message: `Refund ${status.toLowerCase()} successfully`, 
      refund: updatedRefund 
    })

  } catch (error: any) {
    console.error("Process refund error:", error)
    return NextResponse.json(
      { error: "Failed to process refund", details: error.message },
      { status: 500 }
    )
  }
}