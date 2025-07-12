import { MetadataModel } from "@/app/api/_utils/metadataModel";
import { NextResponse } from "next/server";
import { startDB } from "@/app/api/_utils/startDb";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
// import { updateImageToDrive } from "@/app/api/_utils/imageHandlers";

export async function PUT(req, { params }) {
  try {
    const {metadataId} = await params;

    // Validate metadataId
    if (!mongoose.isValidObjectId(metadataId)) {
      return NextResponse.json(
        { error: "Please provide a valid metadataId" },
        { status: 400 }
      );
    }

    await startDB();

    // Parse FormData
    const formData = await req.formData();
    const updates = {}; // Object to store the fields to update

const metadata = await MetadataModel.findById(metadataId);

if (!metadata) {
return NextResponse.json(
{ error: "No Metadata found" },
{ status: 404 }
);
}



  const newOgImage = formData.get("ogImage"); // `ogImage` is the name of the file input
    if (newOgImage && newOgImage.name) {
      // 2. Delete old image from disk
      if (metadata.ogImageId) {
        const oldImagePath = path.join(process.cwd(), "public", "metadata", path.basename(metadata.ogImageId));
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn("Old image not found or already deleted:", err.message);
        }
      }

      // 3. Save new image to disk
      const buffer = Buffer.from(await newOgImage.arrayBuffer());
      const newFileName = `${Date.now()}_${newOgImage.name}`;
      const newImagePath = path.join(process.cwd(), "public", "metadata", newFileName);
      await fs.writeFile(newImagePath, buffer);

      // 4. Set updated image path
      updates.ogImageId = `${process.env.NEXT_PUBLIC_BASEURL}api/public/metadata/${newFileName}`;
    }


    if (formData.has("entityType")) {
      const entityType = formData.get("entityType");
      updates.entityType = entityType;
    }

    if (formData.has("title")) {
      const title = formData.get("title");
      updates.title = title;
    }

    if (formData.has("description")) {
      const description = formData.get("description");
      updates.description = description;
    }

    if (formData.has("canonical")) {
      const canonical = formData.get("canonical");
      updates.canonical = canonical;
    }

        if (formData.has("keywords")) {
      const keywords = JSON.parse(formData.get("keywords"));
      updates.keywords = keywords;
    }


    if (formData.has("ogTitle")) {
      const ogTitle = formData.get("ogTitle");
      updates.ogTitle = ogTitle;
    }

    if (formData.has("ogDescription")) {
      const ogDescription = formData.get("ogDescription");
      updates.ogDescription = ogDescription;
    }


    if (formData.has("ogImageIdAlt")) {
      const ogImageIdAlt = formData.get("ogImageIdAlt");
      updates.ogImageIdAlt = ogImageIdAlt;
    }

    // Check if at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // Find and update the metadata
    const updatedMetadata = await MetadataModel.findByIdAndUpdate(
      metadataId,
      updates,
      { new: true, runValidators: true } 
    );

    if (!updatedMetadata) {
      return NextResponse.json(
        { error: "No Metadata found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "Success",
      message: "Metadata updated successfully",
      data: updatedMetadata,
    });
  } catch (error) {
    console.error("Error in UPDATE-metadata route: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
