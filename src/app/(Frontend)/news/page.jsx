import React from 'react';
import News from '@/components/PagesComp/News';



export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/news`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "News",
    description: data?.description || "News",
    keywords: data?.keywords || ["News"],
    openGraph: {
      title: data?.ogTitle || "News",
      description: data?.ogDescription || "News",
      url: process.env.NEXT_PUBLIC_BASEURL + "news",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "News",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "News",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}

function page() {

  return (
    <>
      <News />
    </>
  );
};

export default page;
