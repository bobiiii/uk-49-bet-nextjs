export const dynamic = "force-dynamic";
import React from 'react';
import LotteryBalls from '@/components/LotteryBalls';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import Link from 'next/link';
import { getAdditionalStats, getDrawPatternStats, getHotColdOverdueNumbers, getNumberFrequencyStats, parseDrawDate } from '@/utils/functions';
import { getLunchtimeApiCall, getTeatimeApiCall } from '@/lib/apis';


export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/statistics`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "Statistics",
    description: data?.description || "Statistics",
    keywords: data?.keywords || ["Statistics"],
    openGraph: {
      title: data?.ogTitle || "Statistics",
      description: data?.ogDescription || "Statistics",
      url: process.env.NEXT_PUBLIC_BASEURL + "statistics",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Statistics",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Statistics",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}

async function page() {

  const lunchData = await getLunchtimeApiCall();
  const teaData = await getTeatimeApiCall();

  const allResults = [...lunchData, ...teaData]; // Combine both
  const sortedResults = allResults.sort((a, b) => {
    const dateA = parseDrawDate(a.d_date);
    const dateB = parseDrawDate(b.d_date);
    return dateB - dateA; // Newest first
  });
  const { hotNumbers, coldNumbers, overdueNumbers } = getHotColdOverdueNumbers(sortedResults);



  const topFrequencies = getNumberFrequencyStats(sortedResults); // Last 50 allResults
  const stats = getAdditionalStats(sortedResults);
  const patternStats = getDrawPatternStats(sortedResults);



  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">UK49s Statistics</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive analysis of UK49s lottery numbers including frequency patterns,
              hot and cold numbers, and statistical trends to help improve your chances.
            </p>
          </div>

          {/* Quick Analysis Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/hot-balls" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Hot Numbers</h3>
              </div>
              <p className="text-gray-600 mb-4">Most frequently drawn numbers</p>
              <div className="flex justify-center mb-4">
                <LotteryBalls numbers={hotNumbers} />
              </div>
              <div className="text-center">
                <span className="text-red-600 font-semibold">View Hot Balls →</span>
              </div>
            </Link>

            <Link href="/cold-balls" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <TrendingDown className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Cold Numbers</h3>
              </div>
              <p className="text-gray-600 mb-4">Least frequently drawn numbers</p>
              <div className="flex justify-center mb-4">
                <LotteryBalls numbers={coldNumbers} />
              </div>
              <div className="text-center">
                <span className="text-blue-600 font-semibold">View Cold Balls →</span>
              </div>
            </Link>

            <Link href="/overdue-balls" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Overdue Numbers</h3>
              </div>
              <p className="text-gray-600 mb-4">Numbers due for appearance</p>
              <div className="flex justify-center mb-4">
                <LotteryBalls numbers={overdueNumbers} />
              </div>
              <div className="text-center">
                <span className="text-purple-600 font-semibold">View Overdue Balls →</span>
              </div>
            </Link>
          </div>

          {/* Detailed Statistics */}
          {/* <div className="grid lg:grid-cols-2 gap-8 mb-8"> */}
          <div className="w-full mb-8">
            {/* Number Frequency Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Number Frequency (Last 50 Draws)</h3>
              <div className="space-y-3">
                {topFrequencies.map((item) => (
                  <div key={item.number} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {item.number}
                      </div>
                      <span className="font-medium">Number {item.number}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{item.count}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Draw Patterns */}
            {/* <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Draw Patterns</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Most Common Sum Range</span>
                  <span className="text-blue-600 font-bold">{patternStats.mostCommonRange}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Average Draw Sum</span>
                  <span className="text-blue-600 font-bold">{patternStats.averageDrawSum}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Consecutive Numbers</span>
                  <span className="text-blue-600 font-bold">{patternStats.avgConsecutive} avg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">High/Low Split</span>
                  <span className="text-blue-600 font-bold">{patternStats.avgHighLowSplit}</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Additional Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Draws</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDraws}</p>


              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Most Drawn</p>
                <p className="text-2xl font-bold text-gray-900">{stats.mostDrawn}</p>

              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Least Drawn</p>
                <p className="text-2xl font-bold text-gray-900">{stats.leastDrawn}</p>

              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Odd/Even</p>
                <p className="text-2xl font-bold text-gray-900">{stats.oddEvenRatio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
