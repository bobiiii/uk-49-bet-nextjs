import path from 'path';
import { NextResponse } from "next/server";
import { startDB } from "@/app/api/_utils/startDb";
import { MetadataModel } from "@/app/api/_utils/metadataModel";
import fs from 'fs';

// import { uploadImageToDrive } from "@/app/api/_utils/imageHandlers";

const METADATA_DIR = path.join(process.cwd(), 'public', 'metadata');
if (!fs.existsSync(METADATA_DIR)) {
  fs.mkdirSync(METADATA_DIR, { recursive: true });
}

export async function POST(req) {
  try {
    await startDB();
    const formData = await req.formData();
    const entityType = formData.get("entityType");
    const file = formData.get("ogImage");
    const keywords = JSON.parse(formData.get("keywords") || "[]");
    const title = formData.get("title");
    const description = formData.get("description");
    const canonical = formData.get("canonical");
    const ogTitle = formData.get("ogTitle");
    const ogDescription = formData.get("ogDescription");
    const ogImageAlt = formData.get("ogImageAlt");

    if (

      !entityType ||
      !title ||
      !description ||
      !canonical ||
      !keywords ||
      !ogTitle ||
      !ogDescription ||
      !ogImageAlt
    ) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 500 }
      );
    }



    const existingMetadata = await MetadataModel.findOne({ entityType });

    if (existingMetadata) {
      return NextResponse.json(
        { error: "Metadata Already Exists" },
        { status: 500 }
      );
    }


  if (!file) {
      return NextResponse.json({ status: 'error', message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const fileName = `ogImage${ext}`;
    const filePath = path.join(METADATA_DIR, fileName);

    fs.writeFileSync(filePath, buffer);

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASEURL}/metadata/${fileName}`;

    const metadata = await MetadataModel.create({
      entityType,
      title,
      description,
      canonical,
      keywords,
      ogTitle,
      ogDescription,
      ogImageId: ogImageUrl,
      ogImageAlt,
    });

    if (!metadata) {
      return NextResponse.json(
        { error: "Failed to create Metadata" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { status: "Success", message: "Metadata Created Successfully", data: metadata },
    );

  } catch (error) {
    console.error("Error in create-metadata route: ", error);
    return NextResponse.json(

      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
