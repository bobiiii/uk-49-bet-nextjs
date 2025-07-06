import {startDB} from '@/app/api/_utils/startDb';
import { ResultModel } from "@/app/api/_utils/resultModel";
import { NextResponse } from 'next/server';


export async function GET() {
  await startDB();
  try {
    const results = await ResultModel.find();
    if (!results || results.length === 0) {
      return NextResponse.json({ error: "No results found." }, { status: 404 });
    }
    return NextResponse.json({status: "Success", message: "Request Successfull", data: results});
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

