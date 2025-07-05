import { MetadataModel } from "@/app/api/_utils/metadataModel";
import { NextResponse } from "next/server";
import { startDB } from "@/app/api/_utils/startDb";
// import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const {entityType} = await params;
    if (!entityType || typeof entityType !== "string") {

      return NextResponse.json(
        { error: "Please provide valid entityType" },
        { status: 400 }
      );
    }

    await startDB();
    const metadata = await MetadataModel.findOne({ entityType });


    if (!metadata?.title) {
      return NextResponse.json({ status: "Success", message: "No Metadata found" }, { status: 404 });
    }
    return NextResponse.json({
      status: "Success",
      message: "Metadata Request Successfull",
      data: metadata,
    });
  } catch (error) {
    console.error("Error in get-metadata route: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
