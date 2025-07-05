
import Results from '@/components/PagesComp/Result';
import React from 'react';



export const metadata = {
  title: "Latest UK49s Results Today - Live Draw Numbers",
  description: "View the latest UK49s lottery results for today's Lunchtime and Teatime draws. Get live winning numbers, prize breakdowns, and recent draw results updated daily.",

  openGraph: {
    title: 'Sample  OG Title',
    description: 'Sample  Og Desc',
    url: process.env.NEXT_PUBLIC_BASEURL,
    type: "website",
    images: [
      {
        url: 'https://infusiontechnologies.co/ogImages/homepageOg.webp',
        secureUrl: 'https://infusiontechnologies.co/ogImages/homepageOg.webp',
        width: 1200,
        height: 630,
        alt: 'Preview image for Sample Site',
      }
    ],



    site_name: process.env.NEXT_PUBLIC_SITENAME,
  },
  keywords:
    [
      "UK49s results today, latest UK49s results, UK49s winning numbers, lunchtime results, teatime results, UK49s live results, lottery results today"
    ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/results",
  },

};


function page() {


  return (

    <>
      <Results />
    </>

  );
};

export default page;
