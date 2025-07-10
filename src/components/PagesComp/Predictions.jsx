"use client"
import React, { useState, useEffect } from 'react';
import LotteryBalls from '@/components/LotteryBalls';
import { Brain, Star, Calendar } from 'lucide-react';
import { getPredictionsApiCall } from '@/lib/apis';
import PredictionRestUI from './PredictionRestUI';


function Predictions() {
    const [adminPredictions, setAdminPredictions] = useState([]);
    const [todayPredictions, setTodayPredictions] = useState([]);
    const [yesterDayPredictions, setYesterDayPredictions] = useState([]);




    useEffect(() => {

        const fetchPredictions = async () => {

            const res = await getPredictionsApiCall()
            const data = res?.data
            setAdminPredictions(data)

        }
        fetchPredictions()
    }, []);



    const filterLatestPerDrawType = (predictions = []) => {
        const latestMap = {};

        predictions.forEach((prediction) => {
            const draw = prediction.drawType;
            if (

                !latestMap[draw] ||
                new Date(prediction.createdAt) > new Date(latestMap[draw].createdAt)
            ) {
                latestMap[draw] = prediction;
            }
        });

        return Object.values(latestMap);
    };


    useEffect(() => {

        const today1 = new Date().toLocaleDateString("en-CA").split('T')[0];
        const todayData = adminPredictions?.filter((item) =>
            item?.date?.split("T")[0] === today1 && item?.status === "Active"
        );

        setTodayPredictions(filterLatestPerDrawType(todayData));
    }, [adminPredictions]);


    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const yesterday = date.toLocaleDateString("en-CA")

        const yesterDayData = adminPredictions?.filter((item) =>
            item?.date?.split('T')[0] === yesterday && item?.status === "Active"
        );

        setYesterDayPredictions(filterLatestPerDrawType(yesterDayData))
    }, [adminPredictions]);


    const formatDate = (rawDate) => {
        return new Date(rawDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };


    // const getLatestPublishedTime = (predictions = []) => {
    //     if (predictions.length === 0) return "No predictions available";

    //     const latest = [...predictions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    //     return `${formatDate(latest.date)} at ${new Date(latest.createdAt).toLocaleTimeString("en-GB", {
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: true
    //     })}`;
    // };





    return (
        <>
            <main className='page-gradient'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0 sm:pt-8 sm:pb-1 ">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">UK49s Predictions</h1>
                        <p className="text-lg sm:text-xl text-gray-600">These are the free UK 49 predictions for lottery players in South Africa and the UK. Winning with these predictions depends entirely on luck. </p>

                    </div>


                    {/* Todays */}
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 text-center '>
                        Today's Predictions
                    </h1>
                    {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 mb-4">
                        <div className="flex items-center justify-center">
                            <Calendar className="h-6 w-6 mr-3 text-blue-600" />
                            <span className="text-xl font-semibold text-blue-900">
                                Published: {getLatestPublishedTime(todayPredictions)}

                            </span>
                        </div>
                    </div> */}

                    {todayPredictions?.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8 p-4 sm:p-6 sm:mt-5 mt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                                    <Brain className="h-6 w-6 mr-2 text-blue-600" />
                                    Star49s Predictions
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">

                                {
                                    todayPredictions?.map((item, index) => {
                                        return (
                                            <div key={index}
                                                className={`${item?.drawType === "Lunchtime" ? "bg-gradient-to-br from-blue-50 to-blue-100" : "bg-gradient-to-br from-purple-50 to-purple-100"}  rounded-lg p-4 sm:p-6`}

                                            >
                                                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center"
                                                >{item?.drawType} Draw</h4>
                                                <div className="flex justify-center mb-3 sm:mb-4">
                                                    <LotteryBalls
                                                        numbers={item?.numbers}
                                                        size="medium"
                                                        mobileLayout={true}
                                                    />
                                                </div>
                                                <div className="text-center mb-1">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5  mr-2" />
                                                        <span className="font-extrabold text-sm sm:text-base ">
                                                            {/* {new Date(item?.date).toLocaleDateString('en-GB').replaceAll('/', '-')}{" "}
                                                            at{" "}
                                                            {new Date(item?.createdAt).toLocaleTimeString('en-GB', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })} */}
                                                            {item?.date?.split("T")[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2" />
                                                        <span className="font-medium text-sm sm:text-base">
                                                            Confidence: {item?.confidenceLevel}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8 p-4 sm:p-6 sm:mt-5 mt-4">
                            <div className="text-center py-8">
                                <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Predictions Available</h3>
                                <p className="text-gray-600">Predictions will be published by our admin team.</p>
                            </div>
                        </div>
                    )}

                    {/* YesterDay */}
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 text-center '>
                        Yesterday's Predictions
                    </h1>
                    {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 mb-4">
                        <div className="flex items-center justify-center">
                            <Calendar className="h-6 w-6 mr-3 text-blue-600" />
                            <span className="text-xl font-semibold text-blue-900">
                                Published: {getLatestPublishedTime(yesterDayPredictions)}

                            </span>
                        </div>
                    </div> */}

                    {yesterDayPredictions?.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8 p-4 sm:p-6 sm:mt-5 mt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                                    <Brain className="h-6 w-6 mr-2 text-blue-600" />
                                    Star49s Predictions
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                {
                                    yesterDayPredictions?.map((item, index) => {
                                        return (
                                            <div key={index}
                                                className={`${item?.drawType === "Lunchtime" ? "bg-gradient-to-br from-blue-50 to-blue-100" : "bg-gradient-to-br from-purple-50 to-purple-100"}  rounded-lg p-4 sm:p-6`}

                                            >
                                                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center"
                                                >{item?.drawType} Draw</h4>
                                                <div className="flex justify-center mb-3 sm:mb-4">
                                                    <LotteryBalls
                                                        numbers={item?.numbers}
                                                        size="medium"
                                                        mobileLayout={true}
                                                    />
                                                </div>
                                                <div className="text-center mb-1">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5  mr-2" />
                                                        <span className="font-extrabold text-sm sm:text-base">
                                                            {/* {new Date(item?.date).toLocaleDateString('en-GB').replaceAll('/', '-')}{" "}
                                                            at{" "}
                                                            {new Date(item?.createdAt).toLocaleTimeString('en-GB', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })} */}
                                                            {item?.date?.split("T")[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2" />
                                                        <span className="font-medium text-sm sm:text-base">
                                                            Confidence: {item?.confidenceLevel}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md mb-6 sm:mb-8 p-4 sm:p-6 sm:mt-5 mt-4">
                            <div className="text-center py-8">
                                <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2"> No Predictions Available</h3>
                                <p className="text-gray-600">Predictions will be published by our admin team.</p>
                            </div>
                        </div>
                    )}
                </div>
                <PredictionRestUI />
            </main>
        </>
    );
};

export default Predictions;
