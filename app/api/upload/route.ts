import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';

const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024, // 5MB
  video: 500 * 1024 * 1024, // 500MB
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const maxSize = MAX_FILE_SIZE[fileType];

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${fileType === 'image' ? '5MB' : '500MB'}` },
        { status: 400 }
      );
    }

    const url = await uploadToS3(file, folder);
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}