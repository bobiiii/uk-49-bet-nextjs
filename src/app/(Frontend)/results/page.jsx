
import Results from '@/components/PagesComp/Result';
import { getMetaData } from '@/lib/apis';
import React from 'react';



// export const metadata = {
//   title: "Latest UK49s Results Today - Live Draw Numbers",
//   description: "View the latest UK49s lottery results for today's Lunchtime and Teatime draws. Get live winning numbers, prize breakdowns, and recent draw results updated daily.",

//   openGraph: {
//     title: 'Sample  OG Title Results',
//     description: 'Sample  Og Desc',
//     url: process.env.NEXT_PUBLIC_BASEURL + "/results",
//     type: "website",
//     images: [
//       {
//         url: 'https://lovable.dev/opengraph-image-p98pqg.png',
//         secureUrl: 'https://lovable.dev/opengraph-image-p98pqg.png',
//         width: 1200,
//         height: 630,
//         alt: 'Preview image for Sample Site',
//       }
//     ],



//     site_name: process.env.NEXT_PUBLIC_SITENAME,
//   },
//   keywords:
//     [
//       "UK49s results today, latest UK49s results, UK49s winning numbers, lunchtime results, teatime results, UK49s live results, lottery results today"
//     ],
//   alternates: {
//     canonical: process.env.NEXT_PUBLIC_BASEURL + "/results",
//   },

// };


export async function generateMetadata() {
  // Replace this with your actual API call
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/metadata/get-metadata/results`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  const result = await response.json()
  const data = result?.data

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.ogTitle,
      description: data.ogDescription,
      url: process.env.NEXT_PUBLIC_BASEURL + "results",
      type: "website",
      images: [
        {
          url: 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data.ogImageAlt || "Preview image",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME,
    },
    alternates: {
      canonical: data?.canonical,
    },
  };
}


function page() {


  return (

    <>
      <Results />
    </>

  );
};

export default page;
