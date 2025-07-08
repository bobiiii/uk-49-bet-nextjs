"use client";
import React, { useEffect, useState } from 'react';
import LotteryBalls from '@/components/LotteryBalls';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';



function Results({formattedResults}) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(30);
  const [results, setResults] = useState(formattedResults);


  const filteredResults = results.filter(result => {
    if (selectedFilter === 'all') return true;
    return result.draw.toLowerCase() === selectedFilter;
  });

  const displayedResults = filteredResults.slice(0, displayCount);
  const hasMoreResults = displayCount < filteredResults.length;

  const loadMoreResults = () => {
    setDisplayCount(prev => Math.min(prev + 30, filteredResults.length));
  };

  const exportToCSV = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const websiteUrl = 'https://uk49sresults.com';

    const headers = ['Date', 'Draw', 'Time', 'Number 1', 'Number 2', 'Number 3', 'Number 4', 'Number 5', 'Number 6', 'Bonus Ball'];
    const csvContent = [
      `UK49s Results Export - ${currentDate}`,
      `Website: ${websiteUrl}`,
      '',
      headers.join(','),
      ...displayedResults.map(result => [
        result.date,
        result.draw,
        result.time,
        ...result.numbers,
        result.boosterBall
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `uk49s-results-${currentDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Lunchtime & Teatime Results</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          These are most recent 30 draws results of lunchtime and teatime. Here players can see the draw name, date, main numbers and booster balls of each draw.
          To find the <Link href="/" className="text-blue-600 hover:text-blue-800 underline">latest results</Link> visit homepage.
        </p>
        <Link href="/statistics" className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 font-medium">
          View Statistics →
        </Link>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {displayedResults.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${result.draw === 'Lunchtime'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
                  }`}>
                  {result.draw} Results
                </div>
                <div className="flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center text-gray-900">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="font-bold text-lg">{result.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{result.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <LotteryBalls
                  numbers={result.numbers}
                  boosterBall={result.boosterBall}
                  size="medium"
                  mobileLayout={true}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMoreResults && (
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={loadMoreResults}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto"
          >
            Load More Results ({filteredResults.length - displayCount} remaining)
          </button>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Facts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="text-center sm:text-left">
            <span className="font-medium text-gray-700 block sm:inline">Total Results Shown:</span>
            <span className="text-blue-600 font-bold block sm:inline sm:ml-2">{displayedResults.length}</span>
          </div>
          <div className="text-center sm:text-left">
            <span className="font-medium text-gray-700 block sm:inline">Latest Draw:</span>
            <span className="text-purple-600 font-bold block sm:inline sm:ml-2">{results[0]?.date} {results[0]?.draw}</span>
          </div>
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <span className="font-medium text-gray-700 block sm:inline">Available Results:</span>
            <span className="text-green-600 font-bold block sm:inline sm:ml-2">{filteredResults.length} Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
