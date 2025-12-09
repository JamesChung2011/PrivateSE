import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/admin/users - Get all users with their roles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    // Build query conditions
    const where: any = {}
    
    if (role && role !== "all") {
      where.role = {
        name: role
      }
    }

    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.app_user.findMany({
      where,
      select: {
        user_id: true,
        full_name: true,
        email: true,
        phone: true,
        avatar_url: true,
        is_active: true,
        created_at: true,
        role: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error: any) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    )
  }
}