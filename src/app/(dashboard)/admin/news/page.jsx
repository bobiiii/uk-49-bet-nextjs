"use client";
// import AdminNews from '@/components/PagesComp/AdminNews';
import dynamic from 'next/dynamic';
const AdminNews = dynamic(() => import('@/components/PagesComp/AdminNews'), {
    ssr: false,
    loading: () => <p>Loading News Manager...</p>, // Optional: custom loading state
});
import React from 'react'

function page() {
    return (
        <>
            {/* <NewsManager /> */}
            <AdminNews />
        </>
    )
}

export default page
