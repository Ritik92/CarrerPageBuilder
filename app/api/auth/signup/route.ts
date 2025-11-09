// app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name, companyName, slug } = await req.json()

    // Validate required fields
    if (!email || !password || !companyName || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Check if slug is taken
    const existingCompany = await prisma.company.findUnique({
      where: { slug },
    })

    if (existingCompany) {
      return NextResponse.json(
        { error: "Slug is already taken" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and company in a transaction
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        company: {
          create: {
            name: companyName,
            slug,
          },
        },
      },
      include: {
        company: true,
      },
    })

    return NextResponse.json(
      { 
        message: "User created successfully",
        slug: user.company?.slug 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}