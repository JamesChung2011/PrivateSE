import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/notifications - Lấy danh sách thông báo
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Lấy thông báo từ bảng 'notification'
    const notifications = await prisma.notification.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        sent_at: 'desc' // Sắp xếp theo sent_at (mới nhất trước)
      },
      take: 20, // Lấy 20 thông báo gần nhất
      select: {
        notification_id: true,
        message: true,
        is_read: true,
        sent_at: true
      }
    })

    return NextResponse.json(notifications)
  } catch (error: any) {
    console.error("Get notifications error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Đánh dấu đã đọc
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await prisma.notification.update({
      where: { 
        notification_id: parseInt(id) // Chuyển id sang kiểu Int vì schema định nghĩa là Int
      },
      data: { is_read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}