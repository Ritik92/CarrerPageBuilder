import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createJobSchema } from '@/lib/validations/job';

// POST /api/companies/:companyId/jobs
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params;
    const body = await request.json();
    
    const validation = createJobSchema.safeParse({ ...body, companyId });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: validation.data,
    });

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET /api/companies/:companyId/jobs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params;
    const { searchParams } = new URL(request.url);

    const location = searchParams.get('location');
    const jobType = searchParams.get('jobType');
    const workPolicy = searchParams.get('workPolicy');
    const department = searchParams.get('department');
    const status = searchParams.get('status') || 'open';
    const search = searchParams.get('search');

    const jobs = await prisma.job.findMany({
      where: {
        companyId,
        ...(location && { location: { contains: location, mode: 'insensitive' } }),
        ...(jobType && { jobType }),
        ...(workPolicy && { workPolicy }),
        ...(department && { department }),
        ...(status && { status }),
        ...(search && { title: { contains: search, mode: 'insensitive' } }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}