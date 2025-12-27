import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest, requireRole } from "@/lib/auth"

// GET /api/staff/schedules - Get staff schedules for logged in user
export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["staff", "owner", "admin"])
    if (guard || !session) return guard ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || session.userId
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.shift_start = { gte: new Date(startDate) }
    }
    if (endDate) {
      dateFilter.shift_end = { lte: new Date(endDate) }
    }

    // Get staff schedules for the user
    const schedules = await prisma.staff_schedule.findMany({
      where: {
        user_id: userId,
        ...dateFilter
      },
      include: {
        app_user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            role: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        shift_start: 'asc'
      }
    })

    // Transform data for frontend
    const transformedSchedules = schedules.map(schedule => ({
      schedule_id: schedule.schedule_id,
      shift_start: schedule.shift_start,
      shift_end: schedule.shift_end,
      role: schedule.role,
      status: schedule.status,
      user: {
        id: schedule.app_user?.user_id,
        name: schedule.app_user?.full_name,
        email: schedule.app_user?.email,
        role: schedule.app_user?.role?.name
      }
    }))

    return NextResponse.json(transformedSchedules)
  } catch (error: any) {
    console.error("Get staff schedules error:", error)
    return NextResponse.json(
      { error: "Failed to fetch staff schedules", details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/staff/schedules - Create new staff schedule
export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["staff", "owner", "admin"])
    if (guard) return guard

    const body = await request.json()
    const { user_id, shift_start, shift_end, role, status } = body

    // Validate required fields
    if (!user_id || !shift_start || !shift_end) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, shift_start, shift_end" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.app_user.findUnique({
      where: { user_id }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check for overlapping schedules
    const overlapping = await prisma.staff_schedule.findFirst({
      where: {
        user_id,
        OR: [
          {
            shift_start: {
              lte: new Date(shift_end)
            },
            shift_end: {
              gte: new Date(shift_start)
            }
          }
        ]
      }
    })

    if (overlapping) {
      return NextResponse.json(
        { error: "Schedule overlaps with existing schedule" },
        { status: 409 }
      )
    }

    // Create new schedule
    const newSchedule = await prisma.staff_schedule.create({
      data: {
        user_id,
        shift_start: new Date(shift_start),
        shift_end: new Date(shift_end),
        role,
        status: status || "Scheduled"
      },
      include: {
        app_user: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(newSchedule, { status: 201 })
  } catch (error: any) {
    console.error("Create staff schedule error:", error)
    return NextResponse.json(
      { error: "Failed to create staff schedule", details: error.message },
      { status: 500 }
    )
  }
}
