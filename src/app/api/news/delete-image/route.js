import path from 'path';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();

    // Expecting something like "/news/123_image.jpg"
    const filename = url.replace('/news/', '');
    const filePath = path.join(process.cwd(), 'public', 'news', filename);

    await fs.unlink(filePath);

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
