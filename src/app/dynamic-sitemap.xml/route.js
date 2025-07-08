import { getServerSideSitemap } from 'next-sitemap';
import { NextResponse } from 'next/server';
import { startDB } from '@/app/api/_utils/startDb';
import { LunchtimeModel } from '@/app/api/_utils/lunchtimeModel';
import { TeatimeModel } from '@/app/api/_utils/TeatimeModel';

export async function GET() {
  await startDB();

  try {
    // ✅ Get latest document from both models (based on updatedAt)
    const [latestLunch, latestTea] = await Promise.all([
      LunchtimeModel.findOne().sort({ updatedAt: -1 }).lean(),
      TeatimeModel.findOne().sort({ updatedAt: -1 }).lean(),
    ]);

    const lunchTime = latestLunch?.updatedAt ? new Date(latestLunch.updatedAt) : null;
    const teaTime = latestTea?.updatedAt ? new Date(latestTea.updatedAt) : null;

    // ✅ Get the most recent of both
    const lastmod = (() => {
      if (lunchTime && teaTime) return lunchTime > teaTime ? lunchTime.toISOString() : teaTime.toISOString();
      return (lunchTime || teaTime || new Date()).toISOString();
    })();

    const baseUrl = process.env.NEXT_PUBLIC_BASEURL?.replace(/\/$/, '');

 const dynamicPaths = [
      '/',
      '/results',
      '/statistics',
      '/cold-balls',
      '/hot-balls',
      '/overdue-balls',
      '/history',
      '/predictions',
    ].map((path) => ({
      loc: `${baseUrl}${path}`,
      lastmod,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.8,
    }));



    return getServerSideSitemap([...dynamicPaths]);
  } catch (err) {
    console.error('❌ Sitemap generation error:', err);
    return new NextResponse('Sitemap generation failed', { status: 500 });
  }
}
