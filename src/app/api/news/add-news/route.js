import { startDB } from "@/app/api/_utils/startDb";
import { NewsModel } from "@/app/api/_utils/newsModel"; // path adjust karna ho to karo
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      title,
      slug, 
      excerpt,
      content,
      date,
      time,
      author,
      category,
      status, // optional: default is 'Published'
      featured, // true or false (Boolean)
    } = data;

    // Validate required fields
    if (
      !title ||
        !slug || 
      !excerpt ||
      !content ||
      !date ||
      !time ||
      !author ||
      !category ||
      typeof featured !== "boolean"
    ) {
      return NextResponse.json(
        {
          status: "Error",
          message: "All required fields must be provided correctly.",
        },
        { status: 400 }
      );
    }
    await startDB(); // connect to MongoDB

    // Check if news with the same slug already exists
    const existingNews = await NewsModel.findOne({ slug });
    if (existingNews) {
      return NextResponse.json(
        {
          status: "Error",
          message: "A news article with this slug already exists.",
        },
        { status: 409 }
      );
    }

    // Save to DB
    const news = await NewsModel.create({
      title,
      slug, 
      excerpt,
      content,
      date,
      time,
      author,
      category,
      status: status || "Published", // default
      featured,
    });

    return NextResponse.json({
      status: "Success",
      message: "News article added successfully",
      data: news,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 }
    );
  }
}
