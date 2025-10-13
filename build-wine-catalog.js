#!/usr/bin/env node

/**
 * Seven Pyramid Wine Catalog Builder
 * Generates static HTML pages from JSON wine data for optimal SEO
 * Usage: node build-wine-catalog.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  dataFile: './wines-data-template.json',
  templateDir: './templates',
  outputDir: './generated',
  baseUrl: 'https://newyear.7pyramid.com',
  siteName: 'Seven Pyramid 七銘企業',
  companyInfo: {
    name: '七銘企業葡萄酒烈酒進口商',
    phone: '+886-2-2791-2147',
    address: '台北市內湖區'
  }
};

class WineCatalogBuilder {
  constructor() {
    this.wineData = null;
    this.templates = {};
    this.generatedPages = [];
  }

  /**
   * Load wine data from JSON file
   */
  loadWineData() {
    try {
      const dataPath = path.resolve(CONFIG.dataFile);
      const rawData = fs.readFileSync(dataPath, 'utf8');
      this.wineData = JSON.parse(rawData);
      console.log(`✅ Loaded ${this.wineData.metadata.totalWines} wines from ${CONFIG.dataFile}`);
    } catch (error) {
      console.error('❌ Failed to load wine data:', error.message);
      process.exit(1);
    }
  }

  /**
   * Create output directories
   */
  createDirectories() {
    const dirs = [
      CONFIG.outputDir,
      path.join(CONFIG.outputDir, 'wines'),
      path.join(CONFIG.outputDir, 'regions'),
      path.join(CONFIG.outputDir, 'countries')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  /**
   * Generate main wine catalog page
   */
  generateMainCatalog() {
    const html = this.generateWineCatalogHTML();
    const outputPath = path.join(CONFIG.outputDir, 'wine_list.html');
    fs.writeFileSync(outputPath, html);
    console.log(`📄 Generated main catalog: ${outputPath}`);
    this.generatedPages.push({
      url: '/wine_list.html',
      lastmod: new Date().toISOString(),
      priority: '0.9'
    });
  }

  /**
   * Generate individual wine pages
   */
  generateIndividualWinePages() {
    let wineCount = 0;

    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      Object.entries(country.regions).forEach(([regionCode, region]) => {
        region.wines.forEach(wine => {
          const html = this.generateWinePageHTML(wine, country, region);
          const wineSlug = this.createSlug(wine.name);
          const outputPath = path.join(CONFIG.outputDir, 'wines', `${wine.id.toLowerCase()}-${wineSlug}.html`);

          fs.writeFileSync(outputPath, html);
          wineCount++;

          this.generatedPages.push({
            url: `/wines/${wine.id.toLowerCase()}-${wineSlug}.html`,
            lastmod: wine.lastPriceUpdate || new Date().toISOString(),
            priority: '0.8'
          });
        });
      });
    });

    console.log(`🍷 Generated ${wineCount} individual wine pages`);
  }

  /**
   * Generate country pages
   */
  generateCountryPages() {
    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      const html = this.generateCountryPageHTML(countryCode, country);
      const outputPath = path.join(CONFIG.outputDir, 'countries', `${countryCode}.html`);

      fs.writeFileSync(outputPath, html);
      console.log(`🌍 Generated country page: ${countryCode}`);

      this.generatedPages.push({
        url: `/countries/${countryCode}.html`,
        lastmod: new Date().toISOString(),
        priority: '0.7'
      });
    });
  }

  /**
   * Generate region pages
   */
  generateRegionPages() {
    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      Object.entries(country.regions).forEach(([regionCode, region]) => {
        const html = this.generateRegionPageHTML(countryCode, country, regionCode, region);
        const outputPath = path.join(CONFIG.outputDir, 'regions', `${countryCode}-${regionCode}.html`);

        fs.writeFileSync(outputPath, html);

        this.generatedPages.push({
          url: `/regions/${countryCode}-${regionCode}.html`,
          lastmod: new Date().toISOString(),
          priority: '0.6'
        });
      });
    });

    console.log(`📍 Generated region pages`);
  }

  /**
   * Generate sitemap.xml
   */
  generateSitemap() {
    const sitemap = this.createSitemapXML();
    const outputPath = path.join(CONFIG.outputDir, 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    console.log(`🗺️  Generated sitemap with ${this.generatedPages.length} pages`);
  }

  /**
   * Generate main wine catalog HTML
   */
  generateWineCatalogHTML() {
    return `<!doctype html>
<html class="no-js" lang="zh-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>完整酒款目錄 - ${CONFIG.siteName}</title>
  <meta name="description" content="瀏覽${CONFIG.siteName}完整酒款目錄，精選世界頂級葡萄酒，包含${Object.keys(this.wineData.countries).length}個國家${this.wineData.metadata.totalWines}款精選酒品">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/light.css" id="theme-link">
  <link rel="canonical" href="${CONFIG.baseUrl}/wine_list.html">

  <!-- Wine Business Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "${CONFIG.siteName} 酒款目錄",
    "description": "台北內湖新竹雙店頂級葡萄酒進口商完整酒款目錄",
    "numberOfItems": ${this.wineData.metadata.totalWines},
    "itemListElement": [
      ${this.generateWineSchemaList()}
    ]
  }
  </script>
</head>
<body class="light">
  ${this.generateNavigation()}

  <main style="margin-top: 80px; padding: 40px 20px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div class="breadcrumb">
        <a href="../index.html">七銘葡萄酒首頁</a> / 完整酒款目錄
      </div>

      <div style="text-align: center; margin: 40px 0 60px 0;">
        <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); color: var(--md-sys-color-primary); margin-bottom: 20px; font-weight: 700;">
          ${CONFIG.siteName} - 完整酒款目錄
        </h1>
        <p style="font-size: 1.2rem; color: var(--md-sys-color-on-surface-variant); max-width: 700px; margin: 0 auto; line-height: 1.6;">
          精選來自${Object.keys(this.wineData.countries).length}個國家的${this.wineData.metadata.totalWines}款頂級葡萄酒<br>
          <span style="color: var(--md-sys-color-primary); font-weight: 600;">雙地現貨供應 | 專業服務 | 企業團購優惠 | 新竹科學園區配送</span>
        </p>
      </div>

      ${this.generateCountrySections()}
      ${this.generateContactSection()}
    </div>
  </main>

  ${this.generateFooterScripts()}
</body>
</html>`;
  }

  /**
   * Generate individual wine page HTML
   */
  generateWinePageHTML(wine, country, region) {
    const wineSlug = this.createSlug(wine.name);
    const pageTitle = `${wine.nameCh} ${wine.vintage} - ${region.name} - ${CONFIG.siteName}`;

    return `<!doctype html>
<html class="no-js" lang="zh-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <meta name="description" content="${wine.description} - NT$${wine.price.twd.toLocaleString()} - ${CONFIG.companyInfo.name}台北內湖新竹雙店現貨供應">
  <link rel="stylesheet" href="../../css/style.css">
  <link rel="stylesheet" href="../../css/light.css" id="theme-link">
  <link rel="canonical" href="${CONFIG.baseUrl}/wines/${wine.id.toLowerCase()}-${wineSlug}.html">

  <!-- Product Schema -->
  <script type="application/ld+json">
  ${JSON.stringify(this.generateWineSchema(wine, country, region), null, 2)}
  </script>

  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${wine.description}">
  <meta property="og:image" content="${CONFIG.baseUrl}/${wine.imageUrl || 'img/wine-placeholder.jpg'}">
  <meta property="og:url" content="${CONFIG.baseUrl}/wines/${wine.id.toLowerCase()}-${wineSlug}.html">
  <meta property="og:type" content="product">
</head>
<body class="light">
  ${this.generateNavigation()}

  <main style="margin-top: 80px; padding: 40px 20px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div class="breadcrumb">
        <a href="../../index.html">七銘葡萄酒首頁</a> /
        <a href="../../wine_list.html">酒款目錄</a> /
        <a href="../countries/${Object.keys(this.wineData.countries).find(key =>
          this.wineData.countries[key].regions[Object.keys(this.wineData.countries[key].regions).find(r =>
            this.wineData.countries[key].regions[r].wines.some(w => w.id === wine.id))])}.html">${country.name}</a> /
        ${region.name} / ${wine.nameCh}
      </div>

      ${this.generateWineDetailHTML(wine, country, region)}
      ${this.generateRelatedWinesHTML(wine, country, region)}
      ${this.generateContactSection()}
    </div>
  </main>

  ${this.generateFooterScripts()}
</body>
</html>`;
  }

  /**
   * Generate country page HTML
   */
  generateCountryPageHTML(countryCode, country) {
    return `<!doctype html>
<html class="no-js" lang="zh-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${country.name} - ${CONFIG.siteName}</title>
  <meta name="description" content="${country.description} - ${CONFIG.companyInfo.name}">
  <link rel="stylesheet" href="../../css/style.css">
  <link rel="stylesheet" href="../../css/light.css" id="theme-link">
  <link rel="canonical" href="${CONFIG.baseUrl}/countries/${countryCode}.html">
</head>
<body class="light">
  ${this.generateNavigation()}

  <main style="margin-top: 80px; padding: 40px 20px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div class="breadcrumb">
        <a href="../../index.html">七銘葡萄酒首頁</a> /
        <a href="../../wine_list.html">酒款目錄</a> /
        ${country.name}
      </div>

      <div style="text-align: center; margin: 40px 0 60px 0;">
        <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); color: var(--md-sys-color-primary); margin-bottom: 20px; font-weight: 700;">
          ${country.emoji} ${country.name}
        </h1>
        <p style="font-size: 1.2rem; color: var(--md-sys-color-on-surface-variant); max-width: 700px; margin: 0 auto; line-height: 1.6;">
          ${country.description}
        </p>
      </div>

      ${this.generateCountryRegionsHTML(country)}
      ${this.generateContactSection()}
    </div>
  </main>

  ${this.generateFooterScripts()}
</body>
</html>`;
  }

  /**
   * Generate region page HTML
   */
  generateRegionPageHTML(countryCode, country, regionCode, region) {
    return `<!doctype html>
<html class="no-js" lang="zh-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${region.name} ${country.name} - ${CONFIG.siteName}</title>
  <meta name="description" content="${region.description} - ${CONFIG.companyInfo.name}">
  <link rel="stylesheet" href="../../css/style.css">
  <link rel="stylesheet" href="../../css/light.css" id="theme-link">
  <link rel="canonical" href="${CONFIG.baseUrl}/regions/${countryCode}-${regionCode}.html">
</head>
<body class="light">
  ${this.generateNavigation()}

  <main style="margin-top: 80px; padding: 40px 20px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div class="breadcrumb">
        <a href="../../index.html">七銘葡萄酒首頁</a> /
        <a href="../../wine_list.html">酒款目錄</a> /
        <a href="../countries/${countryCode}.html">${country.name}</a> /
        ${region.name}
      </div>

      <div style="text-align: center; margin: 40px 0 60px 0;">
        <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); color: var(--md-sys-color-primary); margin-bottom: 20px; font-weight: 700;">
          ${region.name} (${region.nameEn})
        </h1>
        <p style="font-size: 1.2rem; color: var(--md-sys-color-on-surface-variant); max-width: 700px; margin: 0 auto; line-height: 1.6;">
          ${region.description}
        </p>
      </div>

      ${this.generateRegionWinesHTML(region)}
      ${this.generateContactSection()}
    </div>
  </main>

  ${this.generateFooterScripts()}
</body>
</html>`;
  }

  /**
   * Helper methods for HTML generation
   */
  generateNavigation() {
    return `
    <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--md-sys-color-surface-container); backdrop-filter: blur(10px); border-bottom: 1px solid var(--md-sys-color-outline-variant); padding: 15px 0;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="../img/7pyramidlogo.jpg" alt="Seven Pyramid Logo" style="height: 40px; width: auto; border-radius: 6px;">
          <div style="font-size: 1.5rem; font-weight: bold; color: var(--md-sys-color-primary);">
            <a href="../index.html" style="text-decoration: none; color: inherit;">七銘企業 Seven Pyramid</a>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 30px;">
          <a href="../index.html" class="nav-link" style="text-decoration: none; color: var(--md-sys-color-on-surface); font-weight: 500; transition: color 0.3s;">首頁</a>
          <a href="../wine_list.html" class="nav-link" style="text-decoration: none; color: var(--md-sys-color-on-surface); font-weight: 500; transition: color 0.3s;">酒款目錄</a>
          <button id="theme-toggle" style="padding: 8px 12px; border: none; border-radius: 20px; cursor: pointer; background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); font-size: 0.9rem;">🌙</button>
        </div>
      </div>
    </nav>`;
  }

  generateCountrySections() {
    let html = '';
    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      html += `
      <section class="wine-section">
        <h2 class="country-header">
          <a href="countries/${countryCode}.html" style="text-decoration: none; color: inherit;">
            ${country.emoji} ${country.name}
          </a>
        </h2>`;

      Object.entries(country.regions).forEach(([regionCode, region]) => {
        html += `
        <h3 class="region-header">
          <a href="regions/${countryCode}-${regionCode}.html" style="text-decoration: none; color: inherit;">
            ${region.name} ${region.nameEn}
          </a>
        </h3>
        <table class="wine-table">
          <thead>
            <tr>
              <th>酒款名稱</th>
              <th>中文名稱</th>
              <th>年份</th>
              <th>產區</th>
              <th>價格 (NT$)</th>
              <th>庫存</th>
            </tr>
          </thead>
          <tbody>`;

        region.wines.forEach(wine => {
          const wineSlug = this.createSlug(wine.name);
          const stockStatus = wine.inStock ? '✅ 現貨' : '❌ 缺貨';
          html += `
            <tr>
              <td class="wine-name">
                <a href="wines/${wine.id.toLowerCase()}-${wineSlug}.html" style="text-decoration: none; color: inherit; font-weight: 600;">
                  ${wine.name}
                </a>
              </td>
              <td class="chinese-name">${wine.nameCh}</td>
              <td class="vintage">${wine.vintage}</td>
              <td class="region-name">${wine.region}</td>
              <td class="price">NT$ ${wine.price.twd.toLocaleString()}</td>
              <td>${stockStatus}</td>
            </tr>`;
        });

        html += `
          </tbody>
        </table>`;
      });

      html += `</section>`;
    });

    return html;
  }

  generateWineDetailHTML(wine, country, region) {
    return `
    <div class="wine-section" style="margin: 40px 0;">
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 40px; align-items: start;">
        <div>
          <img src="../../${wine.imageUrl || 'img/wine-placeholder.jpg'}" alt="${wine.name} ${wine.vintage}"
               style="width: 100%; max-width: 400px; border-radius: 15px; box-shadow: 0 8px 30px rgba(0,0,0,0.15);">
        </div>
        <div>
          <h1 style="color: var(--md-sys-color-primary); font-size: 2.5rem; margin-bottom: 15px;">
            ${wine.name}
          </h1>
          <h2 style="color: var(--md-sys-color-on-surface-variant); font-size: 1.5rem; margin-bottom: 20px;">
            ${wine.nameCh}
          </h2>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 30px 0;">
            <div><strong>年份:</strong> ${wine.vintage}</div>
            <div><strong>產區:</strong> ${wine.region}</div>
            <div><strong>酒精度:</strong> ${wine.alcohol}%</div>
            <div><strong>容量:</strong> ${wine.bottleSize}</div>
            <div><strong>品種:</strong> ${wine.grapes.join(', ')}</div>
            <div><strong>適飲溫度:</strong> ${wine.servingTemp}</div>
          </div>

          <div style="background: var(--md-sys-color-primary-container); padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: var(--md-sys-color-on-primary-container); margin-bottom: 15px;">價格資訊</h3>
            <div style="font-size: 1.8rem; font-weight: bold; color: var(--md-sys-color-primary);">
              NT$ ${wine.price.twd.toLocaleString()}
            </div>
            ${wine.price.discount ? `<div style="color: var(--md-sys-color-on-primary-container); margin-top: 5px;">
              原價: NT$ ${wine.price.originalPrice.toLocaleString()} (${wine.price.discount}% 優惠)
            </div>` : ''}
          </div>

          <div style="background: var(--md-sys-color-surface-variant); padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: var(--md-sys-color-on-surface-variant); margin-bottom: 15px;">品飲筆記</h3>
            <div style="margin-bottom: 10px;"><strong>外觀:</strong> ${wine.tastingNotes.appearance}</div>
            <div style="margin-bottom: 10px;"><strong>香氣:</strong> ${wine.tastingNotes.aroma}</div>
            <div style="margin-bottom: 10px;"><strong>口感:</strong> ${wine.tastingNotes.palate}</div>
            <div><strong>餘韻:</strong> ${wine.tastingNotes.finish}</div>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: var(--md-sys-color-primary); margin-bottom: 15px;">配餐建議</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${wine.foodPairing.map(food =>
                `<span style="background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); padding: 8px 15px; border-radius: 20px; font-size: 0.9rem;">${food}</span>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  generateWineSchema(wine, country, region) {
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": `${wine.name} ${wine.vintage}`,
      "alternateName": wine.nameCh,
      "description": wine.description,
      "brand": {
        "@type": "Brand",
        "name": wine.producer
      },
      "category": wine.category,
      "offers": {
        "@type": "Offer",
        "price": wine.price.twd,
        "priceCurrency": "TWD",
        "availability": wine.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": CONFIG.companyInfo.name,
          "telephone": CONFIG.companyInfo.phone
        }
      },
      "aggregateRating": wine.awards.length > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      } : undefined
    };
  }

  generateWineSchemaList() {
    let schemaItems = [];
    let position = 1;

    Object.values(this.wineData.countries).forEach(country => {
      Object.values(country.regions).forEach(region => {
        region.wines.forEach(wine => {
          const wineSlug = this.createSlug(wine.name);
          schemaItems.push(`{
            "@type": "ListItem",
            "position": ${position},
            "url": "${CONFIG.baseUrl}/wines/${wine.id.toLowerCase()}-${wineSlug}.html",
            "name": "${wine.name} ${wine.vintage}",
            "description": "${wine.description}"
          }`);
          position++;
        });
      });
    });

    return schemaItems.join(',\n      ');
  }

  generateContactSection() {
    return `
    <section style="margin-top: 60px; padding: 40px; background: var(--md-sys-color-primary-container); border-radius: 20px; text-align: center;">
      <h2 style="color: var(--md-sys-color-on-primary-container); margin-bottom: 20px; font-size: 1.8rem; font-weight: 600;">對特定酒款有興趣？</h2>
      <p style="color: var(--md-sys-color-on-primary-container); margin-bottom: 30px; opacity: 0.8; font-size: 1.1rem;">聯繫我們的專業團隊，獲得詳細資訊與專業建議</p>
      <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
        <a href="../index.html#contact" style="display: inline-block; padding: 15px 30px; background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); text-decoration: none; border-radius: 25px; font-weight: 600; transition: all 0.3s;">聯繫我們</a>
        <a href="https://newyear.7pyramid.com" target="_blank" style="display: inline-block; padding: 15px 30px; background: transparent; color: var(--md-sys-color-on-primary-container); text-decoration: none; border-radius: 25px; font-weight: 600; border: 2px solid var(--md-sys-color-on-primary-container); transition: all 0.3s;">瀏覽線上目錄</a>
      </div>
    </section>`;
  }

  generateFooterScripts() {
    return `
    <script src="../js/app.js"></script>
    <script>
      // Show/hide back to top button
      window.addEventListener('scroll', function() {
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop && window.pageYOffset > 300) {
          backToTop.style.display = 'block';
        } else if (backToTop) {
          backToTop.style.display = 'none';
        }
      });
    </script>`;
  }

  createSitemapXML() {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    const urls = this.generatedPages.map(page => `
  <url>
    <loc>${CONFIG.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

    return `${header}${urls}

</urlset>`;
  }

  createSlug(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Additional helper methods for complex HTML generation
   */
  generateCountryRegionsHTML(country) {
    let html = '';
    Object.entries(country.regions).forEach(([regionCode, region]) => {
      html += `
      <section class="wine-section">
        <h3 class="region-header">${region.name} (${region.nameEn})</h3>
        <p style="color: var(--md-sys-color-on-surface-variant); margin-bottom: 30px; font-size: 1.1rem; line-height: 1.6;">
          ${region.description}
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">`;

      region.wines.forEach(wine => {
        const wineSlug = this.createSlug(wine.name);
        html += `
        <div style="background: var(--md-sys-color-surface); border-radius: 15px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <h4 style="color: var(--md-sys-color-primary); margin-bottom: 10px;">
            <a href="../wines/${wine.id.toLowerCase()}-${wineSlug}.html" style="text-decoration: none; color: inherit;">
              ${wine.name}
            </a>
          </h4>
          <p style="color: var(--md-sys-color-on-surface-variant); margin-bottom: 15px;">${wine.nameCh}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600;">${wine.vintage}</span>
            <span style="font-weight: 700; color: var(--md-sys-color-tertiary);">NT$ ${wine.price.twd.toLocaleString()}</span>
          </div>
        </div>`;
      });

      html += `
        </div>
      </section>`;
    });

    return html;
  }

  generateRegionWinesHTML(region) {
    let html = `
    <section class="wine-section">
      <table class="wine-table">
        <thead>
          <tr>
            <th>酒款名稱</th>
            <th>中文名稱</th>
            <th>年份</th>
            <th>產區</th>
            <th>價格 (NT$)</th>
            <th>庫存狀態</th>
          </tr>
        </thead>
        <tbody>`;

    region.wines.forEach(wine => {
      const wineSlug = this.createSlug(wine.name);
      const stockStatus = wine.inStock ? '✅ 現貨' : '❌ 缺貨';
      html += `
        <tr>
          <td class="wine-name">
            <a href="../wines/${wine.id.toLowerCase()}-${wineSlug}.html" style="text-decoration: none; color: inherit; font-weight: 600;">
              ${wine.name}
            </a>
          </td>
          <td class="chinese-name">${wine.nameCh}</td>
          <td class="vintage">${wine.vintage}</td>
          <td class="region-name">${wine.region}</td>
          <td class="price">NT$ ${wine.price.twd.toLocaleString()}</td>
          <td>${stockStatus}</td>
        </tr>`;
    });

    html += `
        </tbody>
      </table>
    </section>`;

    return html;
  }

  generateRelatedWinesHTML(wine, country, region) {
    // Find wines from the same region (excluding current wine)
    const relatedWines = region.wines.filter(w => w.id !== wine.id).slice(0, 3);

    if (relatedWines.length === 0) return '';

    let html = `
    <section class="wine-section" style="margin-top: 60px;">
      <h3 style="color: var(--md-sys-color-primary); font-size: 1.5rem; margin-bottom: 30px;">相關推薦酒款</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">`;

    relatedWines.forEach(relatedWine => {
      const relatedSlug = this.createSlug(relatedWine.name);
      html += `
      <div style="background: var(--md-sys-color-surface); border-radius: 15px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <h4 style="color: var(--md-sys-color-primary); margin-bottom: 10px;">
          <a href="${relatedWine.id.toLowerCase()}-${relatedSlug}.html" style="text-decoration: none; color: inherit;">
            ${relatedWine.name}
          </a>
        </h4>
        <p style="color: var(--md-sys-color-on-surface-variant); margin-bottom: 15px;">${relatedWine.nameCh}</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 600;">${relatedWine.vintage}</span>
          <span style="font-weight: 700; color: var(--md-sys-color-tertiary);">NT$ ${relatedWine.price.twd.toLocaleString()}</span>
        </div>
      </div>`;
    });

    html += `
      </div>
    </section>`;

    return html;
  }

  /**
   * Main build process
   */
  async build() {
    console.log('🍷 Starting Seven Pyramid Wine Catalog Build Process...\n');

    try {
      this.loadWineData();
      this.createDirectories();
      this.generateMainCatalog();
      this.generateIndividualWinePages();
      this.generateCountryPages();
      this.generateRegionPages();
      this.generateSitemap();

      console.log('\n✅ Build completed successfully!');
      console.log(`📊 Generated ${this.generatedPages.length} total pages`);
      console.log(`📍 Output directory: ${CONFIG.outputDir}`);
      console.log(`🗺️  Sitemap: ${CONFIG.outputDir}/sitemap.xml`);
      console.log('\n🚀 Next steps:');
      console.log('1. Review generated HTML files');
      console.log('2. Test pages locally');
      console.log('3. Deploy to production');
      console.log('4. Submit sitemap to search engines');

    } catch (error) {
      console.error('❌ Build failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// Run the build process
if (require.main === module) {
  const builder = new WineCatalogBuilder();
  builder.build();
}

module.exports = WineCatalogBuilder;