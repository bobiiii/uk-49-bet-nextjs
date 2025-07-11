export const dynamic = "force-dynamic";
import React from 'react';
import LotteryBalls from '@/components/LotteryBalls';
import { TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { getColdNumbersDetailed,  parseDrawDate } from '@/utils/functions';
import { getLunchtimeApiCall, getTeatimeApiCall } from '@/lib/apis';


export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/cold-balls`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "Cold Balls",
    description: data?.description || "Cold Balls",
    keywords: data?.keywords || ["Cold Balls"],
    openGraph: {
      title: data?.ogTitle || "Cold Balls",
      description: data?.ogDescription || "Cold Balls",
      url: process.env.NEXT_PUBLIC_BASEURL + "cold-balls",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Cold Balls",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Cold Balls",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}


async function page() {


    const lunchData = await getLunchtimeApiCall();
    const teaData = await getTeatimeApiCall();
  
    const allDraws = [...lunchData, ...teaData];
    const sortedResults = allDraws.sort((a, b) => {
        const dateA = parseDrawDate(a.d_date);
        const dateB = parseDrawDate(b.d_date);
        return dateB - dateA; // Newest first
      });
    const coldNumbers = getColdNumbersDetailed(sortedResults);
  

  const topColdNumbers = coldNumbers.slice(0, 6).map(item => item.number);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingDown className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Cold Balls</h1>
          </div>
          <p className="text-xl text-gray-600">Least frequently drawn numbers in recent UK49s draws</p>
        </div>

        {/* Top Cold Numbers Display */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 mb-8 border-2 border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Top 6 Cold Numbers</h2>
          <div className="flex justify-center mb-6">
            <LotteryBalls numbers={topColdNumbers} size="large" />
          </div>
          <p className="text-center text-gray-600">
            These numbers have appeared least frequently in the last 100 draws
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Analysis Period</p>
                <p className="text-2xl font-bold text-gray-900">100 Draws</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Coldest Number</p>
                <p className="text-2xl font-bold text-gray-900">{coldNumbers[0].number}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Min Frequency</p>
                <p className="text-2xl font-bold text-gray-900">{coldNumbers[0].frequency}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cold Numbers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b">
            <h3 className="text-xl font-bold text-gray-900">Complete Cold Numbers List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coldNumbers.map((item, index) => (
                  <tr key={item.number} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <LotteryBalls numbers={[item.number]} size="small" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.frequency} times
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.lastSeen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ❄️ Cold
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/hot-balls"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            View Hot Balls
          </Link>
          <Link
            href="/overdue-balls"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            View Overdue Balls
          </Link>
          <Link
            href="/statistics"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Statistics
          </Link>
        </div>
      </div>
    </>
  );
};

export default page;
