import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const slug = await params.slug;

  if (!slug || slug.length === 0) {
    return new NextResponse("File path missing", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", ...slug);
  try {
    const file = await fs.readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentTypeMap[ext] || "application/octet-stream",
      },
    });
  } catch (error) {
    return new NextResponse("File not found", { status: 404 });
  }
}
