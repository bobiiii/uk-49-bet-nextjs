// app/api/verification-code/route.js
import { NextResponse } from "next/server";
import { VerificationModel } from "@/app/api/_utils/verificationModel"; // adjust path
import { startDB } from "@/app/api/_utils/startDb"; // your MongoDB init util

export async function GET() {
  try {
    await startDB();

    // Get the latest verification record
    const record = await VerificationModel.findOne()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      googleVerificationCode: record?.google || null,
    });
  } catch (error) {
    console.error("Verification API Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
