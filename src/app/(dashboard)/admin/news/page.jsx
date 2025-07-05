"use client";
import dynamic from 'next/dynamic';
const NewsManager = dynamic(() => import('@/components/PagesComp/AdminNews'), {
  ssr: false,
  loading: () => <p>Loading News Manager...</p>, // Optional: custom loading state
});
import React from 'react'

function page() {
    return (
        <>
            <NewsManager />
        </>
    )
}

export default page
