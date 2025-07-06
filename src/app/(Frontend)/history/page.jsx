import History from '@/components/PagesComp/History';
import React from 'react';



export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/history`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "History",
    description: data?.description || "History",
    keywords: data?.keywords || ["History"],
    openGraph: {
      title: data?.ogTitle || "History",
      description: data?.ogDescription || "History",
      url: process.env.NEXT_PUBLIC_BASEURL + "history",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "History",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "History",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}



const page = () => {

  return (
    <>
      <History />
    </>
  );
};

export default page;
