import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionFromRequest, requireRole } from "@/lib/auth"

// POST: create expense (owner/admin)
export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequest(req)
    const guard = requireRole(session, ["owner", "admin"])
    if (guard) return guard

    const body = await req.json()
    const { category, amount, description } = body

    if (!category || amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const numericAmount = Number(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 })
    }

    const expense = await prisma.expenses.create({
      data: {
        category,
        amount: numericAmount,
        description,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error: any) {
    console.error("Create expense error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET: list expenses (owner/admin)
export async function GET(request: Request) {
  try {
    const session = await getSessionFromRequest(request)
    const guard = requireRole(session, ["owner", "admin"])
    if (guard) return guard

    const expenses = await prisma.expenses.findMany({
      orderBy: { recorded_at: "desc" },
    })

    return NextResponse.json(expenses)
  } catch (error: any) {
    console.error("Get expenses error:", error)
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}
