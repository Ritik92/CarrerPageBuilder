// middleware.ts
import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token")

  const isLoggedIn = !!token
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isProtected = pathname.includes("/edit") || pathname.includes("/preview")

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
}