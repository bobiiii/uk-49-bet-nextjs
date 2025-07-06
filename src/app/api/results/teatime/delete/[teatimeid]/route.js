import { NextResponse } from "next/server";
import {startDB} from '@/app/api/_utils/startDb';
import { TeatimeModel } from "@/app/api/_utils/TeatimeModel";



export async function DELETE(req,{params}) {
  try {
    await startDB();

    const { teatimeid } = await params;
    
    if (!teatimeid) {
        return NextResponse.json({ error: "Missing teatimeid parameter" }, { status: 400 });
    }
   
      // delete by specific _id
      await TeatimeModel.findByIdAndDelete(teatimeid);
      return NextResponse.json({ message: `Deleted Lunchtime result with id ${teatimeid}` });
   
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
