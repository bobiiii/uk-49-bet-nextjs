import { startDB } from "@/app/api/_utils/startDb";
import { NextResponse } from "next/server";
import { UserModel } from "../../_utils/userModel";

export async function GET() {
    await startDB();

    try {
        const users = await UserModel.find().sort({ createdAt: -1 });

        if (!users || users.length === 0) {
            return NextResponse.json(
                { status: "Error", message: "No User found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: "Success",
            data: users,
        });
    } catch (error) {
        return NextResponse.json(
            { status: "Error", message: error.message },
            { status: 500 }
        );
    }
}
