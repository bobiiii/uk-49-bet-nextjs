// /api/news/update-news/[newsId]/route.js

import { startDB } from "@/app/api/_utils/startDb";
import { NewsModel } from "@/app/api/_utils/newsModel";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    await startDB();

    const { newsId } = params;
    console.log("newsId", newsId);

    if (!newsId) {
        return NextResponse.json(
            { status: "Error", message: "News ID is required." },
            { status: 400 }
        );
    }

    try {
        const updates = await request.json();

        // Remove undefined fields so only provided fields are updated
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, v]) => v !== undefined)
        );

        const updated = await NewsModel.findByIdAndUpdate(newsId, filteredUpdates, {
            new: true,
        });

        if (!updated) {
            return NextResponse.json(
                { status: "Error", message: "News article not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "Success",
            message: "News article updated successfully.",
            data: updated,
        });
    } catch (error) {
        return NextResponse.json(
            { status: "Error", message: error.message },
            { status: 500 }
        );
    }
}
