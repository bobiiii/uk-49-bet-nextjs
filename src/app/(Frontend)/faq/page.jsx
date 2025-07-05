
import Faq from '@/components/PagesComp/Faq';
import React from 'react';



export const metadata = {
  title: "faq",
  description: 'faq',

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
