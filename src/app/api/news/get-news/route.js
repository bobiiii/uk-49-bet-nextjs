import { startDB } from "@/app/api/_utils/startDb";
import { NextResponse } from "next/server";
import { NewsModel } from "../../_utils/newsModel";

export async function GET() {
    await startDB();

    try {
        const news = await NewsModel.find().sort({ createdAt: -1 });

        if (!news || news.length === 0) {
            return NextResponse.json(
                { status: "Error", message: "No news found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "Success",
            data: news,
        });
    } catch (error) {
        return NextResponse.json(
            { status: "Error", message: error.message },
            { status: 500 }
        );
    }
}
