import { MetadataModel } from "@/app/api/_utils/metadataModel";
import { NextResponse } from "next/server";
import { startDB } from "@/app/api/_utils/startDb";
import mongoose from "mongoose";
import { UserModel } from "@/app/api/_utils/userModel";
// import { deleteImageFromDrive } from "@/app/api/_utils/imageHandlers";

export async function DELETE(req, { params }) {
    try {
        const { userId } = await params;
        if (!mongoose.isValidObjectId(userId)) {

            return NextResponse.json(
                { error: "Please provide valid UserId" },
                { status: 400 }
            );
        }

        await startDB();
        const userdata = await UserModel.findByIdAndDelete(userId);


        if (!userdata) {
            return NextResponse.json({ error: "No user found" }, { status: 404 });
        }
        return NextResponse.json({
            status: "Success",
            message: "User DELETE Request Successfully",
            data: userdata,
        });
    } catch (error) {
        console.error("Error in DELETE-USER route: ", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
