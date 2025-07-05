

import Tools from '@/components/PagesComp/Tools';
import React from 'react';


export const metadata = {
  title: "Tools",
  description: "Tools",

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
      "Tools"
    ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/tools",
  },

};




function page() {

  return (
    <>
      <Tools />
    </>
  );
};

export default page;
