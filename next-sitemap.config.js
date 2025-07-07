/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASEURL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  
  exclude: ["/dynamic-urls.xml", "/admin/*", "/admin", "/login/*", "/login"],

  additionalPaths: async (config) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASEURL;

    const staticPaths = [
      '/about',
      '/contact',
      '/faq',
      '/guide',
      '/privacy',
      '/tools',
      '/news',
    ];

    const staticPages = staticPaths.map((path) => ({
      loc: `${baseUrl}${path}`,
      lastmod: new Date().toISOString(),
      changefreq: path === '/news' ? 'weekly' : 'daily',
      priority: 0.8,
    }));

    return staticPages;
  },

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' },
      { userAgent: '*', disallow: '/admin/login' },
    ],
    additionalSitemaps: [
        // This file will be generated from above static paths
      `${process.env.NEXT_PUBLIC_BASEURL}dynamic-urls.xml`,      // Manually or programmatically generated
    ],
  },
};
