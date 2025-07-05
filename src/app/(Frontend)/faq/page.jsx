
import Faq from '@/components/PagesComp/Faq';
import React from 'react';



export const metadata = {
  title: "faq",
  description: 'faq',

  openGraph: {
    title: 'Sample  OG Title FAQ',
    description: 'Sample  Og Desc',
    url: process.env.NEXT_PUBLIC_BASEURL + "/faq",
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
      "faq"
    ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/faq",
  },

};




const page = () => {
  return (
    <>
      <Faq />
    </>
  )
};

export default page;
