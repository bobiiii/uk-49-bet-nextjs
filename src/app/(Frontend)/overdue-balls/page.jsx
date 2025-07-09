export const dynamic = "force-dynamic";

import React from 'react';
import LotteryBalls from '@/components/LotteryBalls';
import { Clock, Calendar, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { getLunchtimeApiCall, getTeatimeApiCall } from '@/lib/apis';
import { getOverdueNumbersDetailed, parseDrawDate } from '@/utils/functions';



export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/overdue-balls`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "Overdue Balls",
    description: data?.description || "Overdue Balls",
    keywords: data?.keywords || ["Overdue Balls"],
    openGraph: {
      title: data?.ogTitle || "Overdue Balls",
      description: data?.ogDescription || "Overdue Balls",
      url: process.env.NEXT_PUBLIC_BASEURL + "overdue-balls",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Overdue Balls",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Overdue Balls",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}



async function page() {
  // Mock data for overdue numbers
   const lunchData = await getLunchtimeApiCall();
   const teaData = await getTeatimeApiCall();

  const allDraws = [...lunchData, ...teaData]; // Combined
  const sortedResults = allDraws.sort((a, b) => {
        const dateA = parseDrawDate(a.d_date);
        const dateB = parseDrawDate(b.d_date);
        return dateB - dateA; // Newest first
      });
const overdueNumbers = getOverdueNumbersDetailed(sortedResults);

  const topOverdueNumbers = overdueNumbers.slice(0, 6).map(item => item.number);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Clock className="h-8 w-8 text-purple-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Overdue Balls</h1>
          </div>
          <p className="text-xl text-gray-600">Numbers that haven't appeared in recent UK49s draws</p>
        </div>

        {/* Top Overdue Numbers Display */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 mb-8 border-2 border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Top 6 Overdue Numbers</h2>
          <div className="flex justify-center mb-6">
            <LotteryBalls numbers={topOverdueNumbers} size="large" />
          </div>
          <p className="text-center text-gray-600">
            These numbers haven't appeared for the longest time in recent draws
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Analysis Period</p>
                <p className="text-2xl font-bold text-gray-900">100 Draws</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Most Overdue</p>
                <p className="text-2xl font-bold text-gray-900">13</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Max Days Overdue</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Numbers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-purple-50 border-b">
            <h3 className="text-xl font-bold text-gray-900">Complete Overdue Numbers List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueNumbers.map((item, index) => (
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
                      {item.daysSinceLastSeen} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.lastSeen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.daysSinceLastSeen > 40 ? 'bg-red-100 text-red-800' :
                        item.daysSinceLastSeen > 30 ? 'bg-orange-100 text-orange-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                        {item.daysSinceLastSeen > 40 ? '🚨 Critical' :
                          item.daysSinceLastSeen > 30 ? '⚠️ High' : '⏰ Overdue'}
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
            href="/cold-balls"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Cold Balls
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
