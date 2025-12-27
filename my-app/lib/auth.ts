import { NextResponse } from "next/server"
import { jwtVerify, SignJWT } from "jose"

const SESSION_COOKIE = "session"
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me")

export interface Session {
  userId: string
  role: string
  name?: string
  email?: string
}

export async function createSessionToken(session: Session) {
  return new SignJWT({
    role: session.role,
    name: session.name,
    email: session.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export function attachSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE)
}

export async function getSessionFromRequest(request: Request): Promise<Session | null> {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null
  const token = parseCookie(cookieHeader)[SESSION_COOKIE]
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      userId: (payload.sub as string) || "",
      role: (payload.role as string) || "",
      name: payload.name as string | undefined,
      email: payload.email as string | undefined,
    }
  } catch {
    return null
  }
}

export function requireRole(session: Session | null, allowed: string[]) {
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (allowed.length && !allowed.includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

function parseCookie(cookieHeader: string) {
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=")
    acc[key] = rest.join("=")
    return acc
  }, {})
}
