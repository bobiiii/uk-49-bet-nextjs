import { NextResponse } from 'next/server';
import { startDB } from '@/app/api/_utils/startDb';
import { VerificationModel } from '@/app/api/_utils/verificationModel';

export async function POST(req) {
  try {
    await startDB();

    const body = await req.json();
    const { google } = body;

    if (!google) {
      return NextResponse.json(
        { success: false, message: 'Verification code must be provided.' },
        { status: 400 }
      );
    }

    const updated = await VerificationModel.findOneAndUpdate(
      {}, // Match the first document (assuming single config doc)
      { google },
      {
        new: true,       // Return the updated document
        upsert: true,    // Create if not exists
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Verification code saved successfully.',
      data: updated,
    });
  } catch (err) {
    console.error('Upsert Verification Code Error:', err);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
