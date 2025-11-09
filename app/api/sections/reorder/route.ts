import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reorderSectionsSchema } from '@/lib/validations/contentSection';

// PATCH /api/sections/reorder
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = reorderSectionsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    // Bulk update using transaction
    await prisma.$transaction(
      validation.data.sections.map(({ id, order }) =>
        prisma.contentSection.update({
          where: { id },
          data: { order },
        })
      )
    );

    return NextResponse.json({ success: true, message: 'Sections reordered' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}