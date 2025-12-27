import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

export const dynamic = "force-dynamic"

// GET /api/notifications - list notifications for current user
export async function GET(request: Request) {
  try {
    const useMock = new URL(request.url).searchParams.get("mock") === "true"

    if (useMock) {
      const mock = [
        {
          notification_id: 1,
          message: "Your flight AA100 is confirmed for tomorrow.",
          is_read: false,
          sent_at: new Date().toISOString(),
        },
        {
          notification_id: 2,
          message: "Gate change: Flight DL300 now departs from Gate B12.",
          is_read: false,
          sent_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          notification_id: 3,
          message: "A new refund request needs your review.",
          is_read: true,
          sent_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        },
      ]
      return NextResponse.json(mock)
    }

    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: session.userId,
      },
      orderBy: {
        sent_at: "desc",
      },
      take: 20,
      select: {
        notification_id: true,
        message: true,
        is_read: true,
        sent_at: true,
      },
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

// PATCH /api/notifications - mark as read
export async function PATCH(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }

    await prisma.notification.update({
      where: {
        notification_id: parseInt(id),
        user_id: session.userId,
      },
      data: { is_read: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// POST /api/notifications - create a notification (supports mock)
export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, message, mock } = await request.json()
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (mock) {
      return NextResponse.json(
        {
          notification_id: Date.now(),
          message,
          is_read: false,
          sent_at: new Date().toISOString(),
        },
        { status: 201 }
      )
    }

    const created = await prisma.notification.create({
      data: {
        user_id: userId || session.userId,
        message,
        is_read: false,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error: any) {
    console.error("Create notification error:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
