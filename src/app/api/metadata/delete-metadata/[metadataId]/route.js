import { MetadataModel } from "@/app/api/_utils/metadataModel";
import { NextResponse } from "next/server";
import { startDB } from "@/app/api/_utils/startDb";
import mongoose from "mongoose";
import { deleteImageFromDrive } from "@/app/api/_utils/imageHandlers";

export async function DELETE(req, { params }) {
  try {
    const {metadataId} = await params;
    if (!mongoose.isValidObjectId(metadataId)) {

      return NextResponse.json(
        { error: "Please provide valid metadataId" },
        { status: 400 }
      );
    }

    await startDB();
    const metadata = await MetadataModel.findByIdAndDelete( metadataId );

    // await deleteImageFromDrive(metadata.ogImageId);
    
    if (!metadata) {
      return NextResponse.json({ error: "No Metadata found" }, { status: 404 });
    }
    return NextResponse.json({
      status: "Success",
      message: "Metadata DELETE Request Successfull",
      data: metadata,
    });
  } catch (error) {
    console.error("Error in DELETE-metadata route: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
