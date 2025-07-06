import { startDB } from '@/app/api/_utils/startDb';
import { ResultModel } from "@/app/api/_utils/resultModel";
import { NextResponse } from 'next/server';
import { data } from 'autoprefixer';

export async function DELETE(request, { params }) {
  try {
    const { resultId } = await params;

    if (!resultId) {
      return NextResponse.json(
        { error: "Missing resultId parameter." },
        { status: 400 }
      );
    }

    await startDB();

    const deleted = await ResultModel.findByIdAndDelete(resultId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Result not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {status: "Success", message: "Result deleted successfully.", data: deleted },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
