// Sitemap Generator for Wine Website
// This script generates an XML sitemap based on Firestore wine data

(function() {
  'use strict';

  // Configuration
  const SITE_URL = 'https://yourdomain.com'; // Replace with your actual domain
  const FIRESTORE_CONFIG = {
    // Add your Firebase config here
  };

  // Generate sitemap XML
  function generateSitemapXML(wines) {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static pages -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${SITE_URL}/index.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

    // Add wine pages
    wines.forEach(wine => {
      const url = `${SITE_URL}/wine.html?wine=${encodeURIComponent(wine.slug)}&year=${wine.year}`;

      sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${wine.lastModified || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;

      // Add image if available
      if (wine.image) {
        sitemap += `
    <image:image>
      <image:loc>${SITE_URL}${wine.image}</image:loc>
      <image:caption>${wine.nameChinese} ${wine.nameEnglish} ${wine.year}</image:caption>
      <image:title>${wine.nameChinese} ${wine.nameEnglish}</image:title>
    </image:image>`;
      }

      sitemap += `
  </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
  }

  // Mock function to fetch all wines from Firestore
  // Replace this with actual Firestore query
  async function fetchAllWines() {
    // Example Firestore query:
    // const snapshot = await db.collection('wines').get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Mock data for demonstration
    return [
      {
        slug: 'chateau-lafite',
        nameChinese: '拉菲酒莊',
        nameEnglish: 'Chateau Lafite Rothschild',
        year: '2015',
        image: '/images/chateau-lafite-2015.webp',
        lastModified: '2024-01-15T10:00:00Z'
      },
      {
        slug: 'chateau-lafite',
        nameChinese: '拉菲酒莊',
        nameEnglish: 'Chateau Lafite Rothschild',
        year: '2016',
        image: '/images/chateau-lafite-2016.webp',
        lastModified: '2024-01-15T10:00:00Z'
      },
      {
        slug: 'chateau-margaux',
        nameChinese: '瑪歌酒莊',
        nameEnglish: 'Chateau Margaux',
        year: '2018',
        image: '/images/chateau-margaux-2018.webp',
        lastModified: '2024-01-15T10:00:00Z'
      }
    ];
  }

  // Generate and save sitemap
  async function generateSitemap() {
    try {
      console.log('Generating sitemap...');

      const wines = await fetchAllWines();
      const sitemapXML = generateSitemapXML(wines);

      // In a real application, you would save this to your server
      // For demonstration, we'll create a downloadable file
      const blob = new Blob([sitemapXML], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      console.log('Sitemap generated successfully!');

      return sitemapXML;

    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  }

  // Generate robots.txt content
  function generateRobotsTxt() {
    return `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Block admin areas (if any)
Disallow: /admin/
Disallow: /private/

# Allow wine images
Allow: /images/wines/
Allow: /css/
Allow: /js/`;
  }

  // Export functions for use
  window.SitemapGenerator = {
    generateSitemap,
    generateRobotsTxt,
    fetchAllWines
  };

})();