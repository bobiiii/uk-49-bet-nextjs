import { startDB } from "@/app/api/_utils/startDb";
import {PredictionModel} from "@/app/api/_utils/predictionModel";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  await startDB();

  try {
    const { predictionId } = await params;

    if (!predictionId) {
      return NextResponse.json(
        { status: "Error", message: "Missing predictionId parameter" },
        { status: 400 }
      );
    }

    const deleted = await PredictionModel.findByIdAndDelete(predictionId);

    if (!deleted) {
      return NextResponse.json(
        { status: "Error", message: "Prediction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "Success",
      message: "Prediction deleted successfully",
data: deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 }
    );
  }
}
