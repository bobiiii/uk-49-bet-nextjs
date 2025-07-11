import { startDB } from "@/app/api/_utils/startDb";
import { NextResponse } from "next/server";
import { NewsModel } from "@/app/api/_utils/newsModel";

export async function DELETE(request, { params }) {
    await startDB();

    try {
        const { newsId } = await params;

        if (!newsId) {
            return NextResponse.json(
                { status: "Error", message: "Missing newsId parameter" },
                { status: 400 }
            );
        }

        const deleted = await NewsModel.findByIdAndDelete(newsId);

        if (!deleted) {
            return NextResponse.json(
                { status: "Error", message: "News not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "Success",
            message: "News deleted successfully",
            data: deleted,
        });
    } catch (error) {
        return NextResponse.json(
            { status: "Error", message: error.message },
            { status: 500 }
        );
    }
}
