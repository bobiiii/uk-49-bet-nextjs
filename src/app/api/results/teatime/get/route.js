import {startDB} from '@/app/api/_utils/startDb';
import { TeatimeModel } from "@/app/api/_utils/TeatimeModel";
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    await startDB();

    const results = await TeatimeModel.find().lean();


      if (!results || results.length === 0) {
      return NextResponse.json(
        { message: "No teatime results found", data: [] },
        { status: 200 }
      );
    }

    const sorted = results.sort((a, b) => {
  const cleanedDateA = a.d_date
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/, '')
    .replace(/(\d+)(st|nd|rd|th)/, '$1')
    .trim();
  const cleanedDateB = b.d_date
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/, '')
    .replace(/(\d+)(st|nd|rd|th)/, '$1')
    .trim();

  const dateA = new Date(cleanedDateA);
  const dateB = new Date(cleanedDateB);

  return dateB - dateA; // descending
});


    return NextResponse.json(sorted, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
