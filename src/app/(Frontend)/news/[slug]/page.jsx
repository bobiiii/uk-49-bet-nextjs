export const dynamic = "force-dynamic";
import React from "react";
import NewsArticle from "@/components/PagesComp/NewsArticle";
import { notFound } from "next/navigation";
import { getSingleNewsApiCall } from "@/lib/apis";

export const metadata = {
  title: "news",
  description: "news",

  openGraph: {
    title: "Sample  OG Title",
    description: "Sample  Og Desc",
    url: process.env.NEXT_PUBLIC_BASEURL,
    type: "website",
    images: [
      {
        url: "https://lovable.dev/opengraph-image-p98pqg.png",
        secureUrl: "https://lovable.dev/opengraph-image-p98pqg.png",
        width: 1200,
        height: 630,
        alt: "Preview image for Sample Site",
      },
    ],

    site_name: process.env.NEXT_PUBLIC_SITENAME,
  },
  keywords: ["news"],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/news",
  },
};

async function page({ params }) {
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }

const data = await getSingleNewsApiCall(slug)

  return (
    <>
      <NewsArticle data={data?.data || []} />
    </>
  );
}

export default page;
