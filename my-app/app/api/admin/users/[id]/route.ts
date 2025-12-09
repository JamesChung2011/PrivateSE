import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// PATCH /api/admin/users/[id] - Update user status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const userId = resolvedParams.id
    const body = await request.json()
    const { is_active } = body

    // Check if user exists
    const existingUser = await prisma.app_user.findUnique({
      where: { user_id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent deactivating own account (optional safety check, assuming caller check is done in UI)
    // You might want to get the current logged-in user from session here to verify

    // Update user
    const updatedUser = await prisma.app_user.update({
      where: { user_id: userId },
      data: {
        is_active: is_active
      },
      select: {
        user_id: true,
        full_name: true,
        is_active: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    )
  }
}