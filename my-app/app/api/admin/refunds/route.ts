import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/admin/refunds - Get all pending refunds
export async function GET(request: Request) {
  try {
    const refunds = await prisma.refund.findMany({
      where: {
        status: "Pending" // Only fetch pending refunds
      },
      include: {
        payment: {
          include: {
            booking: {
              include: {
                app_user: {
                  select: {
                    full_name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        processed_at: 'desc' // Actually this should be created_at if available, using processed_at for now as per schema
      }
    })

    // Transform data for easier frontend consumption
    const transformedRefunds = refunds.map(refund => ({
      refund_id: refund.refund_id,
      amount: refund.amount,
      reason: refund.reason,
      status: refund.status,
      request_date: refund.processed_at, // Using processed_at as timestamp
      customer_name: refund.payment?.booking?.app_user?.full_name || "Unknown",
      customer_email: refund.payment?.booking?.app_user?.email || "Unknown",
      booking_code: refund.payment?.booking?.booking_code || "N/A"
    }))

    return NextResponse.json(transformedRefunds)
  } catch (error: any) {
    console.error("Get refunds error:", error)
    return NextResponse.json(
      { error: "Failed to fetch refunds", details: error.message },
      { status: 500 }
    )
  }
}