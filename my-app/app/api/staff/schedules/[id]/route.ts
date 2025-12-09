import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/staff/schedules/[id] - Get single schedule
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const scheduleId = resolvedParams.id

    const schedule = await prisma.staff_schedule.findUnique({
      where: { schedule_id: scheduleId },
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

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(schedule)
  } catch (error: any) {
    console.error("Get schedule error:", error)
    return NextResponse.json(
      { error: "Failed to fetch schedule", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/staff/schedules/[id] - Update schedule
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const scheduleId = resolvedParams.id
    const body = await request.json()
    const { shift_start, shift_end, role, status } = body

    // Check if schedule exists
    const existingSchedule = await prisma.staff_schedule.findUnique({
      where: { schedule_id: scheduleId }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      )
    }

    // Check for overlapping schedules (exclude current schedule)
    if (shift_start && shift_end) {
      const overlapping = await prisma.staff_schedule.findFirst({
        where: {
          schedule_id: { not: scheduleId },
          user_id: existingSchedule.user_id,
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
    }

    // Update schedule
    const updatedSchedule = await prisma.staff_schedule.update({
      where: { schedule_id: scheduleId },
      data: {
        ...(shift_start && { shift_start: new Date(shift_start) }),
        ...(shift_end && { shift_end: new Date(shift_end) }),
        ...(role && { role }),
        ...(status && { status })
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

    return NextResponse.json(updatedSchedule)
  } catch (error: any) {
    console.error("Update schedule error:", error)
    return NextResponse.json(
      { error: "Failed to update schedule", details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/staff/schedules/[id] - Delete schedule
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const scheduleId = resolvedParams.id

    // Check if schedule exists
    const existingSchedule = await prisma.staff_schedule.findUnique({
      where: { schedule_id: scheduleId }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      )
    }

    // Delete schedule
    await prisma.staff_schedule.delete({
      where: { schedule_id: scheduleId }
    })

    return NextResponse.json(
      { message: "Schedule deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Delete schedule error:", error)
    return NextResponse.json(
      { error: "Failed to delete schedule", details: error.message },
      { status: 500 }
    )
  }
}