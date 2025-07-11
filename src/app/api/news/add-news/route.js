import { startDB } from "@/app/api/_utils/startDb";
import { NewsModel } from "@/app/api/_utils/newsModel"; // path adjust karna ho to karo
import { NextResponse } from "next/server";

export async function POST(request) {
    await startDB(); // connect to MongoDB

    try {
        const data = await request.json();
        console.log("data", data);

        const {
            title,
            excerpt,
            content,
            date,
            time,
            author,
            category,
            status,     // optional: default is 'Published'
            featured,   // true or false (Boolean)
        } = data;

        // Validate required fields
        if (
            !title ||
            !excerpt ||
            !content ||
            !date ||
            !time ||
            !author ||
            !category ||
            typeof featured !== "boolean"
        ) {
            return NextResponse.json(
                { status: "Error", message: "All required fields must be provided correctly." },
                { status: 400 }
            );
        }

        // Save to DB
        const news = await NewsModel.create({
            title,
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
