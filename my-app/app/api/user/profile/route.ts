import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/user/profile - Get current user profile
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

    const user = await prisma.app_user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone: true,
        avatar_url: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
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
    const body = await request.json()
    const { userId, full_name, phone, avatar_url } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

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

    // Update user
    const updatedUser = await prisma.app_user.update({
      where: { user_id: userId },
      data: {
        full_name,
        phone,
        avatar_url
      },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        phone: true,
        avatar_url: true,
        role: {
          select: {
            name: true
          }
        }
      }
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