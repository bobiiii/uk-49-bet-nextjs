
import Predictions from '@/components/PagesComp/Predictions';
import React from 'react';



export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/predictions`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "Predictions",
    description: data?.description || "Predictions",
    keywords: data?.keywords || ["Predictions"],
    openGraph: {
      title: data?.ogTitle || "Predictions",
      description: data?.ogDescription || "Predictions",
      url: process.env.NEXT_PUBLIC_BASEURL + "predictions",
      type: "website",
      images: [
        {
          url: data?.ogImageId || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImageId || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Predictions",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Predictions",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}


function page() {

  return (
    <>
      <Predictions />
    </>
  );
};

export default page;
