import path from 'path';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name.replace(/\s+/g, '_').toLowerCase();
    const fileName = `${Date.now()}_${originalName}`;

    const filePath = path.join(process.cwd(), 'public', 'news', fileName);
    await writeFile(filePath, buffer);

    // return relative path so it can be used in frontend like <img src="/news/..." />
    return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_BASEURL}api/public/news/${fileName}` }, { status: 200 });
  } catch (err) {
    console.error('Image upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
