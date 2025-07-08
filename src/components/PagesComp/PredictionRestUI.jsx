"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brain, TrendingUp, Target, Lightbulb, RefreshCw, Star, Calendar, Trophy } from 'lucide-react';
import { getPredictionsApiCall } from '@/lib/apis';
function PredictionRestUI() {
    // Mock prediction data - reduced to 3 numbers
    const hotColdPredictions = {
        hot: [7, 14, 23, 31, 42],
        cold: [1, 8, 19, 25, 38],
        overdue: [3, 11, 27, 35, 49]
    };

    const patternPredictions = {
        consecutive: [14, 15, 16],
        sum: '120-140',
        oddEven: '3 Odd, 3 Even',
        highLow: '3 High, 3 Low'
    };



    return (
        <>

            {/* Disclaimer - Moved below predictions */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-6 sm:mb-8">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    </div>
                    <div className="ml-2 sm:ml-3">
                        <p className="text-xs sm:text-sm text-yellow-700">
                            <strong>Disclaimer:</strong> These predictions are based on statistical analysis and should be used for entertainment purposes only.
                            Lottery draws are random and past results do not guarantee future outcomes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Winning Strategy Section */}
            <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
                    Winning Strategy
                </h3>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 sm:p-6 border border-yellow-200">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center"> Choosing Hot Numbers is the Best Strategy!</h4>
                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700">
                        <p>
                            Our extensive analysis of <Link href="/history" className="text-blue-600 hover:text-blue-800 underline">UK49s historical data</Link> reveals that <Link href="/hot-balls" className="text-blue-600 hover:text-blue-800 underline">hot numbers</Link> (frequently drawn numbers)
                            are statistically more likely to appear in upcoming draws. These numbers have shown consistent patterns and momentum.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-white rounded-lg p-4 border border-yellow-300">
                                <h5 className="font-semibold text-gray-900 mb-2">Why Hot Numbers Work:</h5>
                                <ul className="space-y-1 text-sm">
                                    <li>• Statistical momentum favors frequent numbers</li>
                                    <li>• Hot numbers show consistent draw patterns</li>
                                    <li>• Higher probability based on recent trends</li>
                                    <li>• Proven strategy by lottery experts</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-yellow-300">
                                <h5 className="font-semibold text-gray-900 mb-2">Recommended Approach:</h5>
                                <ul className="space-y-1 text-sm">
                                    <li>• Select 4-5 numbers from hot numbers list</li>
                                    <li>• Add 1-2 cold numbers for balance</li>
                                    <li>• Focus on numbers drawn in last 30 days</li>
                                    <li>• Combine with our AI predictions for best results</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
                            <p className="text-center font-medium text-yellow-800">
                                💡 Pro Tip: Use our hot numbers analysis below to identify the most frequently drawn numbers and increase your winning chances!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hot & Cold Analysis */}
            <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-red-600" />
                    Hot & Cold Number Analysis
                </h3>

                <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Hot Numbers */}
                    <div className="bg-red-50 rounded-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Hot Numbers</h4>
                        <p className="text-sm text-gray-600 text-center mb-3 sm:mb-4">Most drawn in last 30 days</p>
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <LotteryBalls numbers={hotColdPredictions.hot} size="small" mobileLayout={true} />
                        </div>
                        <p className="text-xs text-center text-gray-500">Consider including these numbers</p>
                    </div>

                    {/* Cold Numbers */}
                    <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Cold Numbers</h4>
                        <p className="text-sm text-gray-600 text-center mb-3 sm:mb-4">Least drawn in last 30 days</p>
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <LotteryBalls numbers={hotColdPredictions.cold} size="small" mobileLayout={true} />
                        </div>
                        <p className="text-xs text-center text-gray-500">Due for appearance</p>
                    </div>

                    {/* Overdue Numbers */}
                    <div className="bg-green-50 rounded-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">Overdue Numbers</h4>
                        <p className="text-sm text-gray-600 text-center mb-3 sm:mb-4">Haven't appeared recently</p>
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <LotteryBalls numbers={hotColdPredictions.overdue} size="small" mobileLayout={true} />
                        </div>
                        <p className="text-xs text-center text-gray-500">Statistically likely to appear</p>
                    </div>
                </div>
            </div>

            {/* Pattern Analysis */}
            <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Target className="h-6 w-6 mr-2 text-green-600" />
                    Pattern Analysis
                </h3>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Number Patterns */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Number Patterns</h4>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm sm:text-base">Consecutive Numbers:</span>
                                <div className="flex space-x-1">
                                    <LotteryBalls numbers={patternPredictions.consecutive} size="small" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm sm:text-base">Sum Range:</span>
                                <span className="font-medium text-sm sm:text-base">{patternPredictions.sum}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm sm:text-base">Odd/Even Split:</span>
                                <span className="font-medium text-sm sm:text-base">{patternPredictions.oddEven}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm sm:text-base">High/Low Split:</span>
                                <span className="font-medium text-sm sm:text-base">{patternPredictions.highLow}</span>
                            </div>
                        </div>
                    </div>

                    {/* Strategy Tips */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Winning Strategy Tips</h4>
                        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span>Mix hot and cold numbers for balanced selection</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span>Include at least one number from each decade (1-10, 11-20, etc.)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span>Consider overdue numbers for potential wins</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span>Avoid picking all consecutive or all same-ending numbers</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span>Play consistently with your chosen strategy</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
                    UK Predictions FAQ
                </h3>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="faq-1">
                        <AccordionTrigger className="text-left">How accurate are the UK49s number tips?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Our number tips are based on past results and trend analysis. They can help guide your choices, but UK49s is still a random game. No tips can promise a win.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-2">
                        <AccordionTrigger className="text-left">What is the best strategy for choosing UK49s numbers?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Many players use a mix of hot and cold numbers. You can also try overdue balls or follow recent draw patterns. Smart picks and balanced selections often give better coverage.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-3">
                        <AccordionTrigger className="text-left">How often are the UK49s number suggestions updated?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            We update our tips and draw insights every day. Fresh suggestions are shared before both lunchtime and teatime draws, based on the latest data.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-4">
                        <AccordionTrigger className="text-left">Should I play the same numbers every day?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Some players repeat the same numbers, but adjusting your picks based on the <Link href="/" className="text-blue-600 hover:text-blue-800 underline">latest 49s draw </Link> trends or lucky number tips can be more effective.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-5">
                        <AccordionTrigger className="text-left">What's the difference between lunchtime and teatime predictions?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Lunchtime and teatime draws are separate, and their patterns can differ. We share unique insights and smart number picks for each draw to help you decide better.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-6">
                        <AccordionTrigger className="text-left">Can I use more than one strategy at the same time?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Yes! Many players mix different UK49s approaches—like hot/cold analysis, overdue numbers, and even personal picks—to make more informed choices.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-7">
                        <AccordionTrigger className="text-left">Are there any guaranteed ways to win?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            No, UK49s is a game of chance. Our number suggestions and draw insights help guide you, but winning still depends on luck. Always play responsibly.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-8">
                        <AccordionTrigger className="text-left">Can I rely only on daily number picks to win?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Tips and strategies can help, but nothing is guaranteed. Using number suggestions is a great support tool, but luck plays the biggest role in winning.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-9">
                        <AccordionTrigger className="text-left">Why do the smart picks change every day?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            We update our suggestions daily based on the newest draw numbers. This helps show the most current number trends and gives players up-to-date advice.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="faq-10">
                        <AccordionTrigger className="text-left">Should I follow my gut or trust number trends?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                            Some players trust their own feeling, others follow draw forecasts. Many find that using both—gut instinct and smart tips—offers a balanced way to play.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    )
}

export default PredictionRestUI
