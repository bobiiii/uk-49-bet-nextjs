import React from 'react';
import News from '@/components/PagesComp/News';



export const metadata = {
  title: "news",
  description: 'news',

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
      "news"
    ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/news",
  },

};


function page() {

  return (
    <>
      <News />
    </>
  );
};

export default page;
