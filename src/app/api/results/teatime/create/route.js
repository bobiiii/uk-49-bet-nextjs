import { NextResponse } from "next/server";
import {startDB} from '@/app/api/_utils/startDb';
import { TeatimeModel } from "@/app/api/_utils/TeatimeModel";


export async function POST(req) {
  try {
    await startDB();

    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    // find the latest saved date
    const latest = await TeatimeModel.findOne({}).sort({ d_date: -1 }).lean();
    const latestDate = latest?.d_date ? new Date(latest.d_date).getTime() : 0;

    let newerFound = false;
    let savedCount = 0;

    for (const row of data) {
      const currentDate = new Date(row.d_date).getTime();

      // check if already exists
      const exists = await TeatimeModel.findOne({ d_date: row.d_date });
      if (exists) {
        continue; // skip duplicates
      }

      if (currentDate > latestDate) {
        newerFound = true;
      }

      await TeatimeModel.create({
        balls: row.balls,
        d_date: row.d_date,
        resultTime: row.resultTime,
      });
      savedCount++;
    }

    return NextResponse.json(
      {
        status: "Success",
        message: `Saved ${savedCount} new result(s). ${
          newerFound ? "Newer results detected." : "No newer results."
        }`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
