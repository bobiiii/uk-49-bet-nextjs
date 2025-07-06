import { NextResponse } from "next/server";
import {startDB} from '@/app/api/_utils/startDb';
import { LunchtimeModel } from "@/app/api/_utils/lunchtimeModel";



export async function DELETE(req,{params}) {
  try {
    await startDB();

    const { lunchtimeid } = await params;
    
    if (!lunchtimeid) {
        return NextResponse.json({ error: "Missing lunchtimeid parameter" }, { status: 400 });
    }
   
      // delete by specific _id
      await LunchtimeModel.findByIdAndDelete(lunchtimeid);
      return NextResponse.json({ message: `Deleted Lunchtime result with id ${lunchtimeid}` });
   
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
