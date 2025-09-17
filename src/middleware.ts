import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./lib/auth"

export async function middleware(req: NextRequest) {
  const session = await auth()
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard") ||
                      req.nextUrl.pathname.startsWith("/pickups") ||
                      req.nextUrl.pathname.startsWith("/points") ||
                      req.nextUrl.pathname.startsWith("/profile") ||
                      req.nextUrl.pathname.startsWith("/admin")
  if (isProtected && !session?.user) {
    const url = new URL("/auth/sign-in", req.url)
    url.searchParams.set("from", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/pickups/:path*", "/points/:path*", "/profile/:path*", "/admin/:path*"]
}
