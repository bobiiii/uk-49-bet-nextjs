
import Faq from '@/components/PagesComp/Faq';
import React from 'react';



export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/faq`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "Faq",
    description: data?.description || "Faq",
    keywords: data?.keywords || ["Faq"],
    openGraph: {
      title: data?.ogTitle || "Faq",
      description: data?.ogDescription || "Faq",
      url: process.env.NEXT_PUBLIC_BASEURL + "faq",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Faq",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Faq",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}




const page = () => {
  return (
    <>
      <Faq />
    </>
  )
};

export default page;
