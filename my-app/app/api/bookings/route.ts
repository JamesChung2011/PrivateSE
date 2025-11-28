import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // For now, allow passing userId as query param in dev: ?userId=...
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        flight: true,
        refunds: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}