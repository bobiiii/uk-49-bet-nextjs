

import Tools from '@/components/PagesComp/Tools';
import React from 'react';


export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/tools`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "Tools",
    description: data?.description || "Tools",
    keywords: data?.keywords || ["Tools"],
    openGraph: {
      title: data?.ogTitle || "Tools",
      description: data?.ogDescription || "Tools",
      url: process.env.NEXT_PUBLIC_BASEURL + "tools",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Tools",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Tools",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}


function page() {

  return (
    <>
      <Tools />
    </>
  );
};

export default page;
