import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const PROTECTED_API_PREFIXES = [
  "/api/bookings",
  "/api/payments",
  "/api/notifications",
  "/api/expenses",
  "/api/user",
  "/api/admin",
  "/api/staff",
  "/api/flights",
  "/api/routes",
]

const PROTECTED_PAGES = ["/dashboard"]

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me")

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      userId: payload.sub as string | undefined,
      role: (payload.role as string | undefined) ?? "",
    }
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow auth endpoints, public API, assets
  // Allow auth endpoints, public API, assets
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/" ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next()
  }

  // Allow public GETs for search/routes/seat availability
  if (
    req.method === "GET" &&
    (pathname.startsWith("/api/flights/search") ||
      pathname.startsWith("/api/routes") ||
      pathname.startsWith("/api/flights/instances"))
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get("session")?.value
  const session = token ? await verifyToken(token) : null

  const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isProtectedPage = PROTECTED_PAGES.some((prefix) => pathname.startsWith(prefix))

  if (!session && (isProtectedApi || isProtectedPage)) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
}
