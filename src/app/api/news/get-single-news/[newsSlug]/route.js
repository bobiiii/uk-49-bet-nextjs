// /api/news/update-news/[newsId]/route.js

import { startDB } from "@/app/api/_utils/startDb";
import { NewsModel } from "@/app/api/_utils/newsModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await startDB();

  const { newsSlug } = await params;
if (!newsSlug) {
    return NextResponse.json({ error: "News slug is required" }, { status: 400 });
  }
  

  try {
    
    
    const news = await NewsModel.findOne({ slug: newsSlug });

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }
    return NextResponse.json(
      { status: "Success", data: news },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
