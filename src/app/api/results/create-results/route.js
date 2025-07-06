import {startDB} from '@/app/api/_utils/startDb';
import { ResultModel } from "@/app/api/_utils/resultModel";
import { NextResponse } from 'next/server';

export async function POST(request) {
  
  try {
    const data = await request.json();

    const { drawType, drawDate,  numbers, bonus } = data;

    // Field validations
    if (!drawType || !["Lunchtime", "Teatime"].includes(drawType)) {
      return NextResponse.json({ error: "Invalid or missing drawType. Must be 'Lunchtime' or 'Teatime'." }, { status: 400 });
    }

    if (!drawDate || isNaN(new Date(drawDate).getTime())) {
      return NextResponse.json({ error: "Invalid or missing drawDate." }, { status: 400 });
    }

    // if (!drawTime || typeof drawTime !== "string") {
    //   return NextResponse.json({ error: "Invalid or missing drawTime." }, { status: 400 });
    // }

    if (!Array.isArray(numbers) || numbers.length !== 6 || numbers.some(n => typeof n !== "number" || n < 1 || n > 49)) {
      return NextResponse.json({ error: "Invalid numbers. Must be an array of 6 numbers between 1 and 49." }, { status: 400 });
    }

    if (!bonus || typeof bonus !== "number" || bonus < 1 || bonus > 49) {
      return NextResponse.json({ error: "Invalid bonus number. Must be between 1 and 49." }, { status: 400 });
    }

    await startDB();

    // all good, save
    const result = await ResultModel.create({
      drawType,
      drawDate,
    //   drawTime,
      numbers,
      bonus
    });
        if (!result) {
          return NextResponse.json(
            { error: "Unable to add result." },
            { status: 404 }
          );
        }

    return NextResponse.json({status: "Success", message:"Result added successfully", data: result});

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
