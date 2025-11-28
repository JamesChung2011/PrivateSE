
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const bookingId = params.bookingId

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId parameter" },
        { status: 400 }
      )
    }

    // 1. Kiểm tra trạng thái và lấy thông tin thanh toán
    const booking = await prisma.booking.findUnique({
      where: { booking_id: bookingId },
      include: {
        payment: {
          where: { status: 'Paid' }, 
          select: { payment_id: true, amount: true }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.status !== 'Confirmed' && booking.status !== 'Pending') {
      return NextResponse.json({ error: "Booking cannot be cancelled in current status" }, { status: 400 })
    }

    const firstPayment = booking.payment[0] 
    if (!firstPayment) {
        return NextResponse.json({ error: "Cannot find associated payment to process refund." }, { status: 400 })
    }

    // 2. Thực hiện giao dịch (transaction) để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      // a. Cập nhật trạng thái Booking
      const updatedBooking = await tx.booking.update({
        where: { booking_id: bookingId },
        data: { status: 'Cancelled' },
      })
      
      // b. Tạo yêu cầu hoàn tiền (Refund Request)
      const refundRequest = await tx.refund.create({
        data: {
          payment_id: firstPayment.payment_id,
          amount: firstPayment.amount, 
          reason: 'Customer requested cancellation',
          status: 'Requested',
        }
      })

      // c. Cập nhật trạng thái tất cả Tickets trong Booking (optional, but good practice)
      await tx.ticket.updateMany({
        where: { 
            passenger: {
                booking_id: bookingId
            }
        },
        data: { status: 'Cancelled' }
      })
      
      return { updatedBooking, refundRequest }
    })

    return NextResponse.json(
      {
        message: "Booking successfully cancelled and refund request initiated.",
        newStatus: result.updatedBooking.status,
        refundAmount: firstPayment.amount,
        refundStatus: result.refundRequest.status
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Cancel booking API error:", error)
    return NextResponse.json(
      { error: "Failed to process cancellation and refund request" },
      { status: 500 }
    )
  }
}