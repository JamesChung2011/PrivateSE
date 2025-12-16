import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// POST: tạo expense
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { category, amount, description } = body

    if (!category || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const numericAmount = Number(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      )
    }

    const expense = await prisma.expenses.create({
      data: {
        category,
        amount: numericAmount,
        description,
        // recorded_at tự động
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error("Create expense error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET: lấy danh sách expenses (dùng sau)
export async function GET() {
  try {
    const expenses = await prisma.expenses.findMany({
      orderBy: { recorded_at: "desc" },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    )
  }
}
