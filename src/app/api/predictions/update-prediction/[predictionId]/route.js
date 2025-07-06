import { startDB } from "@/app/api/_utils/startDb";
import {PredictionModel} from "@/app/api/_utils/predictionModel";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  await startDB();

  try {
    const { predictionId } = await params;
    const data = await request.json();

    // Build updates object dynamically
    const updates = {};

    if (data.date) updates.date = data.date;
    if (data.drawType) updates.drawType = data.drawType;
    if (data.numbers) {
      if (data.numbers.length !== 3 || data.numbers.some(n => n < 1 || n > 49)) {
        return NextResponse.json(
          { status: "Error", message: "Numbers must be exactly 3 between 1–49" },
          { status: 400 }
        );
      }
      updates.numbers = data.numbers;
    }
    if (data.confidenceLevel) updates.confidenceLevel = data.confidenceLevel;
    if (data.status) updates.status = data.status;

    const updatedPrediction = await PredictionModel.findByIdAndUpdate(
      predictionId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedPrediction) {
      return NextResponse.json(
        { status: "Error", message: "Prediction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "Success",
      message: "Prediction updated successfully",
      data: updatedPrediction,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 }
    );
  }
}
