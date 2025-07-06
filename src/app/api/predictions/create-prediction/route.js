import { startDB } from "@/app/api/_utils/startDb";
import {PredictionModel} from "@/app/api/_utils/predictionModel"; // adjust path if different
import { NextResponse } from "next/server";

export async function POST(request) {
  await startDB(); // connect to MongoDB

  try {
    const data = await request.json();

    const { date, drawType, numbers, confidenceLevel, status } = data;

    // Validate minimal fields
    if (
      !date ||
      !drawType ||
      !numbers ||
      numbers.length !== 3 ||
      !confidenceLevel
    ) {
      return NextResponse.json(
        { status: "Error", message: "All required fields must be provided." },
        { status: 400 }
      );
    }

    // Save to DB
    const prediction = await PredictionModel.create({
      date,
      drawType,
      numbers,
      confidenceLevel,
      status,
    });

    return NextResponse.json({
      status: "Success",
      message: "Prediction added successfully",
      data: prediction,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 }
    );
  }
}
