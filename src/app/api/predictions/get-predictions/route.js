import { startDB } from "@/app/api/_utils/startDb";
import {PredictionModel} from "@/app/api/_utils/predictionModel";
import { NextResponse } from "next/server";

export async function GET() {
  await startDB();

  try {
    const predictions = await PredictionModel.find().sort({ createdAt: -1 });

if (!predictions || predictions.length === 0) {
      return NextResponse.json(
        { status: "Error", message: "No predictions found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "Success",
      data: predictions,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 }
    );
  }
}
