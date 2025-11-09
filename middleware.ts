// middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isHomePage = pathname === "/"

  // If logged in and trying to access auth pages, redirect to home
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Allow access to home page for everyone
  if (isHomePage) {
    return NextResponse.next()
  }

  // Allow access to public careers pages
  if (pathname.includes("/careers")) {
    return NextResponse.next()
  }

  // Protect edit and preview pages
  if (pathname.includes("/edit") || pathname.includes("/preview")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
}