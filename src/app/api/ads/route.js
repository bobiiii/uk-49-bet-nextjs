import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  const body = await req.json()
  const { adsContent } = body

  // ✅ Validation
  if (!adsContent || typeof adsContent !== 'string' || adsContent.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'adsContent is required and must be a non-empty string' },
      { status: 400 }
    )
  }

  if (adsContent.length > 500) {
    return NextResponse.json(
      { success: false, error: 'adsContent is too long (max 500 characters)' },
      { status: 400 }
    )
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'ads.txt')

    // ✅ Overwrites if exists, or creates new if missing
    fs.writeFileSync(filePath, adsContent, 'utf8')

    return NextResponse.json({ success: true, message: 'ads.txt updated successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
