import React from 'react';



export const metadata = {
  title: "Complete UK49s Results History & Archive",
  description: "Browse the complete UK49s lottery history archive with advanced search and filtering options. Find historical results by date, draw type, and more from our comprehensive database.",

  openGraph: {
    title: 'Sample  OG Title',
    description: 'Sample  Og Desc',
    url: process.env.NEXT_PUBLIC_BASEURL,
    type: "website",
    images: [
      {
        url: 'https://infusiontechnologies.co/ogImages/homepageOg.webp',
        secureUrl: 'https://infusiontechnologies.co/ogImages/homepageOg.webp',
        width: 1200,
        height: 630,
        alt: 'Preview image for Sample Site',
      }
    ],



    site_name: process.env.NEXT_PUBLIC_SITENAME,
  },
  keywords:
    [
      "UK49s history, lottery archive, historical results, search results, filter results, complete history, UK49s database, past draws"
    ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASEURL + "/history",
  },

};



const page = () => {

  return (
    <>
      <History />
    </>
  );
};

export default page;
