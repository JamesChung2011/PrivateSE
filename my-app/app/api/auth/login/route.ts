import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { attachSessionCookie, createSessionToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await prisma.app_user.findUnique({
      where: { email },
      include: { role: true },
    })

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.is_active === false) {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 })
    }

    const token = await createSessionToken({
      userId: user.user_id,
      role: user.role?.name || "customer",
      name: user.full_name,
      email: user.email,
    })

    const response = NextResponse.json(
      {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: user.role?.name,
        avatar_url: user.avatar_url,
      },
      { status: 200 }
    )

    attachSessionCookie(response, token)
    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
