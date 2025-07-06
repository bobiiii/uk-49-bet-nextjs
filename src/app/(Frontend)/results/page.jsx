
import Results from '@/components/PagesComp/Result';
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
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/results`
  console.log("url", url);

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  const result = await response.json()
  const data = result?.data

  return {
    title: data?.title || "UK49s Results & Predictions",
    description: data?.description || "Check latest Lunchtime and Teatime UK49s draws, hot and cold numbers, and predictions.",
    keywords: data?.keywords || ["UK49s", "lottery results", "UK predictions", "hot numbers"],
    openGraph: {
      title: data?.ogTitle || "UK49s - Free Predictions",
      description: data?.ogDescription || "Explore the latest UK49s results and smart number picks.",
      url: process.env.NEXT_PUBLIC_BASEURL + "results",
      type: "website",
      images: [
        {
          url: 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "UK49s Image",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "UK49s",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
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
