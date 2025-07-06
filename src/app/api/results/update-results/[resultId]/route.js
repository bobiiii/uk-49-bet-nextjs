import { startDB } from '@/app/api/_utils/startDb';
import { ResultModel } from "@/app/api/_utils/resultModel";
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { resultId } = await params;
    const data = await request.json();

    await startDB();

    const updateFields = {};

    // Conditionally validate and collect only the provided fields
    if (data.drawType !== undefined) {
      if (!["Lunchtime", "Teatime"].includes(data.drawType)) {
        return NextResponse.json(
          { error: "Invalid drawType. Must be 'Lunchtime' or 'Teatime'." },
          { status: 400 }
        );
      }
      updateFields.drawType = data.drawType;
    }

    if (data.drawDate !== undefined) {
      if (isNaN(new Date(data.drawDate).getTime())) {
        return NextResponse.json(
          { error: "Invalid drawDate." },
          { status: 400 }
        );
      }
      updateFields.drawDate = data.drawDate;
    }

    if (data.drawTime !== undefined) {
      if (typeof data.drawTime !== "string") {
        return NextResponse.json(
          { error: "drawTime must be a string." },
          { status: 400 }
        );
      }
      updateFields.drawTime = data.drawTime;
    }

    if (data.numbers !== undefined) {
      if (
        !Array.isArray(data.numbers) ||
        data.numbers.length !== 6 ||
        data.numbers.some((n) => typeof n !== "number" || n < 1 || n > 49)
      ) {
        return NextResponse.json(
          { error: "numbers must be an array of 6 numbers between 1 and 49." },
          { status: 400 }
        );
      }
      updateFields.numbers = data.numbers;
    }

    if (data.bonus !== undefined) {
      if (typeof data.bonus !== "number" || data.bonus < 1 || data.bonus > 49) {
        return NextResponse.json(
          { error: "bonus must be a number between 1 and 49." },
          { status: 400 }
        );
      }
      updateFields.bonus = data.bonus;
    }

    // if no fields were sent
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 }
      );
    }

    const updatedResult = await ResultModel.findByIdAndUpdate(
      resultId,
      updateFields,
      { new: true }
    );

    if (!updatedResult) {
      return NextResponse.json(
        { error: "Result not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "Success", message:"Result updated successfully", data: updatedResult});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
