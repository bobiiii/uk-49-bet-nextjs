
import Predictions from '@/components/PagesComp/Predictions';
import React from 'react';



export const metadata = {
  title: "UK49s Predictions & Number Analysis - AI Powered",
  description: "Get expert UK49s predictions using advanced AI algorithms and statistical analysis. View hot numbers, cold numbers, pattern analysis and number generation tools for better lottery picks.",

  openGraph: {
    title: 'Sample  OG Title',
    description: 'Sample  Og Desc',
    url: process.env.NEXT_PUBLIC_BASEURL,
    type: "website",
    images: [
      {
        url: 'https://lovable.dev/opengraph-image-p98pqg.png',
        secureUrl: 'https://lovable.dev/opengraph-image-p98pqg.png',
        width: 1200,
        height: 630,
        alt: 'Preview image for Sample Site',
      }
    ],



    site_name: process.env.NEXT_PUBLIC_SITENAME,
  },
  keywords:
    [
      "UK49s predictions, lottery predictions, AI predictions, hot numbers, cold numbers, lottery analysis, number patterns, UK49s tips, lottery strategy"
    ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/predictions",
  },

};



function page() {

  return (
    <>
      <Predictions />
    </>
  );
};

export default page;
