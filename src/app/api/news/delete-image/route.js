import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "news", filename);
    await fs.unlink(filePath);

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
