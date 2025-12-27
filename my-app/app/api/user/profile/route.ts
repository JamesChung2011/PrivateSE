import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// GET /api/user/profile - Get current user profile
export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.app_user.findUnique({
      where: { user_id: session.userId },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone: true,
        avatar_url: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, phone, avatar_url } = body

    // Update user
    const updatedUser = await prisma.app_user.update({
      where: { user_id: session.userId },
      data: {
        full_name,
        phone,
        avatar_url,
      },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone: true,
        avatar_url: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    )
  }
}
