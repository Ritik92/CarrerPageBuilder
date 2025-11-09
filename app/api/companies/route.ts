import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const company = await prisma.company.create({
      data: body,
    });

    return NextResponse.json({ success: true, data: company }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const companies = await prisma.company.findMany({
    include: { _count: { select: { jobs: true, contentSections: true } } }
  });
  return NextResponse.json({ success: true, data: companies });
}