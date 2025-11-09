// app/api/auth/check-slug/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      )
    }

    const existingCompany = await prisma.company.findUnique({
      where: { slug },
    })

    return NextResponse.json({
      available: !existingCompany,
    })
  } catch (error) {
    console.error("Check slug error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}