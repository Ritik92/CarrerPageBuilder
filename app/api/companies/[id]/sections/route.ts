  import { NextRequest, NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import { createContentSectionSchema } from '@/lib/validations/contentSection';

  // POST /api/companies/:id/sections
  export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id: companyId } = await params;
      const body = await request.json();
      
      const validation = createContentSectionSchema.safeParse({ ...body, companyId });
      if (!validation.success) {
        return NextResponse.json(
          { success: false, error: 'Validation failed', details: validation.error.format() },
          { status: 400 }
        );
      }

      const section = await prisma.contentSection.create({
        data: validation.data,
      });

      return NextResponse.json({ success: true, data: section }, { status: 201 });
    } catch (error: any) {
      if (error.code === 'P2003') {
        return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

  // GET /api/companies/:id/sections
  export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id: companyId } = await params;

      const sections = await prisma.contentSection.findMany({
        where: { companyId },
        orderBy: { order: 'asc' },
      });

      return NextResponse.json({ success: true, data: sections });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }