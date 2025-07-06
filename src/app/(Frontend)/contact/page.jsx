
import React from 'react';
import Contact from '@/components/PagesComp/Contact';




export async function generateMetadata() {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/contact`

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  let data = null

  const result = await response.json()
  data = result?.data


  return {
    title: data?.title || "Contact",
    description: data?.description || "Contact",
    keywords: data?.keywords || ["Contact"],
    openGraph: {
      title: data?.ogTitle || "Contact",
      description: data?.ogDescription || "Contact",
      url: process.env.NEXT_PUBLIC_BASEURL + "contact",
      type: "website",
      images: [
        {
          url: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          secureUrl: data?.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png',
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Contact",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Contact",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  }
}

function page() {


  return (
    <>
      <Contact />
    </>
  );
};

export default page;
