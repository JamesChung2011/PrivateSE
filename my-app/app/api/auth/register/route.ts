import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { attachSessionCookie, createSessionToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, phone, role = "customer" } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // --- THE ROLE LOGIC TRAP FIX ---
    // 1. Look up the role_id based on the string provided
    // This translates "customer" -> 4 (or whatever the ID is in your DB)
    const roleRecord = await prisma.role.findFirst({
      where: { name: role.toLowerCase() } 
    })

    if (!roleRecord) {
      return NextResponse.json(
        { error: `Invalid role specified: ${role}` },
        { status: 400 }
      )
    }

    // 2. Check for existing user
    const existingUser = await prisma.app_user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Create the user using the found role_id
    const newUser = await prisma.app_user.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name: name,
        phone: phone || null,
        role_id: roleRecord.role_id, // <--- USING THE ID
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        is_active: true
      }
    })

    // 5. Return user without password
    const { password_hash: _, ...userWithoutPass } = newUser

    const token = await createSessionToken({
      userId: newUser.user_id,
      role: roleRecord.name,
      name: newUser.full_name,
      email: newUser.email,
    })

    const response = NextResponse.json(
      { ...userWithoutPass, role: roleRecord.name },
      { status: 201 }
    )
    attachSessionCookie(response, token)
    return response

  } catch (error: any) {
    console.error("Registration Error:", error)
    
    // Ensure we always return JSON, even on errors
    const errorMessage = error?.message || "Internal Server Error"
    return NextResponse.json(
      { error: errorMessage },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
