
import React from 'react';
import Contact from '@/components/PagesComp/Contact';



export const metadata = {
  title: "contact",
  description: 'contact',

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
      "contact"
    ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/contact",
  },

};


function page() {


  return (
    <>
      <Contact />
    </>
  );
};

export default page;
