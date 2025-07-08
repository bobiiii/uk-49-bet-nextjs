export const dynamic = "force-dynamic";
import Results from "@/components/PagesComp/Result";
import { getLunchtimeApiCall, getTeatimeApiCall } from "@/lib/apis";
import { formatResult } from "@/utils/functions";
import React from "react";

export async function generateMetadata() {
  // Replace this with your actual API call
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}metadata/get-metadata/results`;
  console.log("url", url);

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  let data = null;
  const result = await response.json();
  data = result?.data;

  return {
    title: data?.title || "Results",
    description: data?.description || "Results",
    keywords: data?.keywords || ["Results"],
    openGraph: {
      title: data?.ogTitle || "Results",
      description: data?.ogDescription || "Results",
      url: process.env.NEXT_PUBLIC_BASEURL + "results",
      type: "website",
      images: [
        {
          url: "https://lovable.dev/opengraph-image-p98pqg.png",
          secureUrl: "https://lovable.dev/opengraph-image-p98pqg.png",
          width: 1200,
          height: 630,
          alt: data?.ogImageAlt || "Results",
        },
      ],
      site_name: process.env.NEXT_PUBLIC_SITENAME || "Results",
    },
    alternates: {
      canonical: data?.canonical || process.env.NEXT_PUBLIC_BASEURL,
    },
  };
}

async function page() {
  // Assuming you're calling:
  const lunchData = await getLunchtimeApiCall();
  const teaData = await getTeatimeApiCall();

  const lunchResults = lunchData.map((item) => formatResult(item, "Lunchtime"));
  const teaResults = teaData.map((item) => formatResult(item, "Teatime"));

  const sortedLunch = lunchResults.sort(
    (a, b) => parseDMYtoDate(b.date) - parseDMYtoDate(a.date)
  );

  const sortedTea = teaResults.sort(
    (a, b) => parseDMYtoDate(b.date) - parseDMYtoDate(a.date)
  );
  // Interleave tea and lunch
  const maxLength = Math.max(sortedTea.length, sortedLunch.length);
  const interleavedResults = [];

  for (let i = 0; i < maxLength; i++) {
    if (sortedTea[i]) interleavedResults.push(sortedTea[i]);
    if (sortedLunch[i]) interleavedResults.push(sortedLunch[i]);
  }
  return (
    <>
      <Results formattedResults={interleavedResults} />
    </>
  );
}

export default page;
