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
  baseUrl: 'https://wine.7pyramid.com',
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
      // Load enrichment data (French wine info)
      let enrichmentData = {};
      const enrichmentFiles = ['./french_wine_info.json', './us_wine_info.json', './chile_wine_info.json'];
      
      enrichmentFiles.forEach(file => {
        const enrichmentPath = path.resolve(file);
        if (fs.existsSync(enrichmentPath)) {
          try {
            const rawEnrichment = fs.readFileSync(enrichmentPath, 'utf8');
            const enrichmentArray = JSON.parse(rawEnrichment);
            enrichmentArray.forEach(item => {
              // Index by Chinese name for better matching
              if (item.chinese_name) {
                enrichmentData[item.chinese_name.trim()] = item;
              }
            });
            console.log(`✅ Loaded enrichment data from ${file}`);
          } catch (e) {
            console.warn(`⚠️ Failed to parse ${file}`, e.message);
          }
        }
      });
      console.log(`✅ Total enrichment records: ${Object.keys(enrichmentData).length}`);

      // Try loading the new flat JSON format first (from excel.py)
      const newFormatPath = path.resolve('./sevenStock_final.json');
      if (fs.existsSync(newFormatPath)) {
        console.log(`📄 Found new data format: ${newFormatPath}`);
        const rawData = fs.readFileSync(newFormatPath, 'utf8');
        const flatData = JSON.parse(rawData);
        this.wineData = this.transformExcelData(flatData, enrichmentData);
        console.log(`✅ Successfully transformed ${this.wineData.metadata.totalWines} wines from sevenStock_final.json`);
        return;
      }

      // Fallback to legacy format
      const dataPath = path.resolve(CONFIG.dataFile);
      if (fs.existsSync(dataPath)) {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        this.wineData = JSON.parse(rawData);
        console.log(`✅ Loaded ${this.wineData.metadata.totalWines} wines from ${CONFIG.dataFile}`);
      } else {
        throw new Error(`No data file found. Checked ./sevenStock_final.json and ${CONFIG.dataFile}`);
      }
    } catch (error) {
      console.error('❌ Failed to load wine data:', error.message);
      process.exit(1);
    }
  }

  /**
   * Transform flat Excel JSON data to hierarchical structure
   */
  transformExcelData(flatData, enrichmentData = {}) {
    const template = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: '1.1.0',
        totalWines: 0,
        currencies: ['TWD'],
        dataSource: 'sevenStock_final.json'
      },
      countries: {}
    };

    const allItems = [
      ...(flatData.general_stock_inventory || []),
      ...(flatData.grade_wine_inventory || [])
    ];

    let wineCount = 0;

    allItems.forEach(item => {
      // Skip empty items
      if (!item.product_name_en && !item.product_name_cn) return;

      const nameEn = item.product_name_en || '';
      const nameCh = item.product_name_cn || '';
      const fullName = (nameEn + ' ' + nameCh).toLowerCase();
      const category = item.category || 'Uncategorized';

      // Infer Country and Region
      let countryField = this.inferCountryFromCategory(category) || this.inferCountry(fullName) || 'France';
      
      // Check for enrichment data
      const enrichment = enrichmentData[nameCh.trim()];
      
      let regionField = (enrichment && enrichment.region) || this.inferRegion(fullName) || 'Central';
      
      const countryCode = this.getCountryCode(countryField) || 'OT';
      const countryKey = this.getCountryKey(countryField);
      const regionKey = regionField.toLowerCase().replace(/\s+/g, '');

      // Initialize Country
      if (!template.countries[countryKey]) {
        template.countries[countryKey] = {
          name: this.getCountryChineseName(countryKey),
          nameEn: countryField,
          emoji: this.getCountryEmoji(countryKey),
          description: '',
          regions: {}
        };
      }

      // Initialize Region
      if (!template.countries[countryKey].regions[regionKey]) {
        template.countries[countryKey].regions[regionKey] = {
          name: regionField,
          nameEn: regionField,
          description: '',
          wines: []
        };
      }

      // Determine Price (Prioritize Suggested > Unit > Direct > Cost)
      const cleanPrice = (val) => {
        if (!val) return 0;
        // Handle range or multiple prices (take first)
        const match = String(val).match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      const price = cleanPrice(item.suggested_price) || 
                    cleanPrice(item.unit_price) || 
                    cleanPrice(item.direct_price) || 
                    cleanPrice(item.cost_price) || 0;

      // Extract Vintage
      let vintage = this.extractVintageFromName(nameEn || nameCh) || 'NV';

      // Determine Stock
      const stockLevel = parseInt(item.stock_quantity) || 0;
      const inStock = stockLevel > 0 || item.stock_quantity === '充足';

      // Tasting Notes & Pairing Logic
      let tastingNotes = {
        appearance: '',
        aroma: '',
        palate: '',
        finish: ''
      };
      
      let foodPairing = category.includes('威士忌') ? ['巧克力', '雪茄'] : ['肉類', '起司'];
      let description = '';
      let drinkingWindow = '';

      if (enrichment) {
        if (enrichment.description_zh_tw) description = enrichment.description_zh_tw;
        if (enrichment.tasting_notes) tastingNotes = enrichment.tasting_notes; // Can be string
        if (enrichment.food_pairing) foodPairing = enrichment.food_pairing; // Can be string
        if (enrichment.drinking_window) drinkingWindow = enrichment.drinking_window;
      }

      // Construct Wine Object
      const wineObject = {
        id: item.product_id || `ID-${wineCount}`,
        name: nameEn || nameCh,
        nameCh: nameCh || nameEn,
        vintage: vintage,
        region: regionField,
        subRegion: category.includes('法國-') ? category.split('-')[1] : '',
        price: {
          twd: price,
          originalPrice: price,
          discount: 0
        },
        inStock: inStock,
        stockLevel: stockLevel,
        category: category,
        grapes: [],
        alcohol: 13.5,
        servingTemp: category.includes('威士忌') ? '室溫' : '16-18°C',
        bottleSize: item.unit === '瓶' ? '750ml' : (item.unit || '750ml'),
        producer: nameEn || nameCh,
        description: description,
        tastingNotes: tastingNotes,
        foodPairing: foodPairing,
        drinkingWindow: drinkingWindow,
        awards: Array.isArray(item.score) ? item.score : [],
        imageUrl: `img/wines/${this.createSlug(nameEn || nameCh)}.jpg`
      };

      template.countries[countryKey].regions[regionKey].wines.push(wineObject);
      wineCount++;
    });

    template.metadata.totalWines = wineCount;
    return template;
  }

  // --- Improved Helper Methods ---

  inferCountryFromCategory(category) {
    if (!category) return null;
    const lower = category.toLowerCase();
    if (lower.includes('法國') || lower.includes('france')) return 'France';
    if (lower.includes('澳洲') || lower.includes('australia')) return 'Australia';
    if (lower.includes('智利') || lower.includes('chile')) return 'Chile';
    if (lower.includes('美國') || lower.includes('usa')) return 'USA';
    if (lower.includes('阿根廷') || lower.includes('argentina')) return 'Argentina';
    if (lower.includes('西班牙') || lower.includes('spain')) return 'Spain';
    if (lower.includes('威士忌')) return 'Scotland'; // Default for Whisky
    if (lower.includes('高梁')) return 'Taiwan';
    return null;
  }

  getCountryKey(countryField) {
    const cf = countryField.toLowerCase();
    if (cf.includes('france')) return 'france';
    if (cf.includes('australia')) return 'australia';
    if (cf.includes('chile')) return 'chile';
    if (cf.includes('usa') || cf.includes('america')) return 'usa';
    if (cf.includes('argentina')) return 'argentina';
    if (cf.includes('spain')) return 'spain';
    if (cf.includes('scotland')) return 'scotland';
    if (cf.includes('taiwan')) return 'taiwan';
    return 'other';
  }

  inferCountry(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    if (lower.includes('france') || lower.includes('法')) return 'France';
    if (lower.includes('australia') || lower.includes('澳')) return 'Australia';
    if (lower.includes('chile') || lower.includes('智')) return 'Chile';
    if (lower.includes('usa') || lower.includes('america') || lower.includes('美')) return 'USA';
    if (lower.includes('argentina') || lower.includes('阿根廷')) return 'Argentina';
    if (lower.includes('spain') || lower.includes('西班牙')) return 'Spain';
    if (lower.includes('whisky') || lower.includes('威士忌')) return 'Scotland';
    return null;
  }

  inferRegion(name) {
    const lower = name.toLowerCase();
    if (lower.includes('bordeaux') || lower.includes('波爾多')) return 'Bordeaux';
    if (lower.includes('burgundy') || lower.includes('bourgogne') || lower.includes('勃艮第')) return 'Burgundy';
    if (lower.includes('champagne') || lower.includes('香檳')) return 'Champagne';
    if (lower.includes('barossa') || lower.includes('巴羅莎')) return 'Barossa';
    if (lower.includes('napa') || lower.includes('納帕')) return 'Napa';
    if (lower.includes('mendoza') || lower.includes('門多薩')) return 'Mendoza';
    if (lower.includes('islay') || lower.includes('艾雷島')) return 'Islay';
    if (lower.includes('highland') || lower.includes('高地')) return 'Highland';
    if (lower.includes('speyside') || lower.includes('斯貝賽')) return 'Speyside';
    return 'Central'; 
  }

  extractVintageFromName(name) {
    if (!name) return null;
    const match = String(name).match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
  }

  getCountryCode(countryName) {
    const codes = {
      'france': 'FR', 'australia': 'AU', 'chile': 'CL',
      'usa': 'US', 'argentina': 'AR', 'spain': 'ES',
      'scotland': 'UK', 'taiwan': 'TW'
    };
    return codes[countryName.toLowerCase()] || 'OT';
  }

  getCountryChineseName(countryKey) {
    const names = {
      'france': '法國葡萄酒', 'australia': '澳洲葡萄酒',
      'chile': '智利葡萄酒', 'usa': '美國葡萄酒',
      'argentina': '阿根廷葡萄酒', 'spain': '西班牙葡萄酒',
      'scotland': '蘇格蘭威士忌', 'taiwan': '台灣名酒'
    };
    return names[countryKey] || '精選酒款';
  }

  getCountryEmoji(countryKey) {
    const emojis = {
      'france': '🇫🇷', 'australia': '🇦🇺', 'chile': '🇨🇱',
      'usa': '🇺🇸', 'argentina': '🇦🇷', 'spain': '🇪🇸',
      'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'taiwan': '🇹🇼'
    };
    return emojis[countryKey] || '🍷';
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
    // Generate for ./generated/wine_list.html (links: wines/... - NO PREFIX for deploy)
    const htmlGenerated = this.generateWineCatalogHTML('');
    const outputPath = path.join(CONFIG.outputDir, 'wine_list.html');
    fs.writeFileSync(outputPath, htmlGenerated);

    // Also write to deploy/wine_list.html with correct paths
    fs.writeFileSync('./deploy/wine_list.html', htmlGenerated);

    console.log(`📄 Generated main catalog: ${outputPath} and ./deploy/wine_list.html`);

    this.generatedPages.push({
      url: '/index.html',
      lastmod: new Date().toISOString(),
      priority: '1.0'
    });

    this.generatedPages.push({
      url: '/french_wine_knowledge.html',
      lastmod: new Date().toISOString(),
      priority: '0.8'
    });

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
  generateWineCatalogHTML(pathPrefix = '') {
    return `<!doctype html>
<html class="no-js" lang="zh-TW">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>台北頂級葡萄酒進口商 - 波爾多香檳專賣 | 七銘企業 Seven Pyramid</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/dark-luxury.css" id="theme-link">
  <style>
    /* IDE variable recognition - these are overridden by light.css and dark.css at runtime */
    :root {
      --md-sys-color-primary: rgb(126 0 146);
      --md-sys-color-surface-tint: rgb(154 37 174);
      --md-sys-color-on-primary: rgb(255 255 255);
      --md-sys-color-primary-container: rgb(156 39 176);
      --md-sys-color-on-primary-container: rgb(255 202 255);
      --md-sys-color-secondary: rgb(113 84 120);
      --md-sys-color-on-secondary: rgb(255 255 255);
      --md-sys-color-secondary-container: rgb(225 190 231);
      --md-sys-color-on-secondary-container: rgb(102 75 109);
      --md-sys-color-tertiary: rgb(0 104 118);
      --md-sys-color-on-tertiary: rgb(255 255 255);
      --md-sys-color-tertiary-container: rgb(0 188 212);
      --md-sys-color-on-tertiary-container: rgb(0 70 80);
      --md-sys-color-error: rgb(186 26 26);
      --md-sys-color-on-error: rgb(255 255 255);
      --md-sys-color-error-container: rgb(255 218 214);
      --md-sys-color-on-error-container: rgb(147 0 10);
      --md-sys-color-background: rgb(255 247 250);
      --md-sys-color-on-background: rgb(33 25 33);
      --md-sys-color-surface: rgb(255 247 250);
      --md-sys-color-on-surface: rgb(33 25 33);
      --md-sys-color-surface-variant: rgb(242 220 238);
      --md-sys-color-on-surface-variant: rgb(81 66 80);
      --md-sys-color-outline: rgb(131 114 129);
      --md-sys-color-outline-variant: rgb(213 193 210);
      --md-sys-color-shadow: rgb(0 0 0);
      --md-sys-color-scrim: rgb(0 0 0);
      --md-sys-color-inverse-surface: rgb(55 45 54);
      --md-sys-color-inverse-on-surface: rgb(252 236 248);
      --md-sys-color-inverse-primary: rgb(249 171 255);
      --md-sys-color-primary-fixed: rgb(255 214 254);
      --md-sys-color-on-primary-fixed: rgb(53 0 63);
      --md-sys-color-primary-fixed-dim: rgb(249 171 255);
      --md-sys-color-on-primary-fixed-variant: rgb(123 0 143);
      --md-sys-color-secondary-fixed: rgb(250 215 255);
      --md-sys-color-on-secondary-fixed: rgb(41 18 49);
      --md-sys-color-secondary-fixed-dim: rgb(222 187 228);
      --md-sys-color-on-secondary-fixed-variant: rgb(88 61 95);
      --md-sys-color-tertiary-fixed: rgb(161 239 255);
      --md-sys-color-on-tertiary-fixed: rgb(0 31 37);
      --md-sys-color-tertiary-fixed-dim: rgb(68 216 241);
      --md-sys-color-on-tertiary-fixed-variant: rgb(0 78 89);
      --md-sys-color-surface-dim: rgb(229 214 225);
      --md-sys-color-surface-bright: rgb(255 247 250);
      --md-sys-color-surface-container-lowest: rgb(255 255 255);
      --md-sys-color-surface-container-low: rgb(255 239 251);
      --md-sys-color-surface-container: rgb(249 233 245);
      --md-sys-color-surface-container-high: rgb(243 228 239);
      --md-sys-color-surface-container-highest: rgb(238 222 234);
    }
  </style>
  <meta name="description" content="台北市內湖區專業葡萄酒進口商，提供波爾多、香檳、勃艮第等頂級法國酒款。松山區門市，專業侍酒師服務，企業團購優惠，服務大台北、桃園、新竹、台中地區">
  <meta name="keywords" content="台北葡萄酒,台北紅酒,內湖區酒商,波爾多台北,香檳台北,企業團購,侍酒師服務,Seven Pyramid,松山區葡萄酒,新竹葡萄酒">

  <!-- Geo Meta Tags -->
  <meta name="geo.region" content="TW-TPE">
  <meta name="geo.placename" content="台北市內湖區">
  <meta name="geo.position" content="25.0686;121.5750">
  <meta name="ICBM" content="25.0686, 121.5750">

  <!-- Local Business Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "七銘企業葡萄酒烈酒進口商 Seven Pyramid",
    "alternateName": ["七銘企業", "Seven Pyramid"],
    "description": "台北市與新竹市專業葡萄酒進口商，提供頂級法國、美國、智利葡萄酒",
    "url": "${CONFIG.baseUrl}",
    "priceRange": "$$$$",
    "openingHours": "Mo-Su 10:00-21:00",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "currenciesAccepted": "TWD",
    "areaServed": [
      "台北市",
      "新北市",
      "桃園市",
      "新竹縣",
      "新竹市",
      "台中市",
      "台中縣"
    ],
    "serviceType": [
      "葡萄酒進口",
      "葡萄酒零售",
      "企業團購",
      "品酒活動",
      "侍酒師服務"
    ],

    "location": [
      {
        "@type": "Place",
        "name": "台北總公司",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "台北市內湖區",
          "addressLocality": "內湖區",
          "addressRegion": "台北市",
          "postalCode": "114",
          "addressCountry": "TW"
        },
        "telephone": "+886-2-2791-2147",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "25.0686",
          "longitude": "121.5750"
        }
      },
      {
        "@type": "Place",
        "name": "新竹分店",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "新竹市",
          "addressLocality": "東區",
          "addressRegion": "新竹市",
          "postalCode": "300",
          "addressCountry": "TW"
        },
        "telephone": "+886-2-2791-2147",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "24.8138",
          "longitude": "120.9675"
        }
      }
    ],
    "telephone": "+886-2-2791-2147"
  }
  </script>

  <!-- BreadcrumbList Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "首頁",
        "item": "${CONFIG.baseUrl}/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "酒款目錄",
        "item": "${CONFIG.baseUrl}/wine_list.html"
      }
    ]
  }
  </script>

  <!-- Canonical URL -->
  <link rel="canonical" href="${CONFIG.baseUrl}/wine_list.html">

  <meta property="og:title" content="完整酒款目錄 - 七銘企業葡萄酒烈酒進口商">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${CONFIG.baseUrl}/wine_list.html">
  <meta property="og:description" content="瀏覽七銘企業完整酒款目錄，精選世界頂級葡萄酒">

  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="manifest" href="site.webmanifest">

  <style>
    html {
      scroll-behavior: smooth;
    }

    /* Wine List Specific Styles */
    .wine-section {
      margin: 40px 0;
      background: var(--md-sys-color-surface-container);
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .country-header {
      color: var(--md-sys-color-primary);
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 30px;
      text-align: center;
      padding-bottom: 15px;
      border-bottom: 3px solid var(--md-sys-color-primary);
    }

    .region-header {
      color: var(--md-sys-color-secondary);
      font-size: 1.8rem;
      font-weight: 600;
      margin: 30px 0 20px 0;
      padding: 15px 20px;
      background: var(--md-sys-color-secondary-container);
      border-radius: 10px;
      border-left: 5px solid var(--md-sys-color-secondary);
    }

    .wine-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: var(--md-sys-color-surface);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 15px rgba(0,0,0,0.1);
    }

    .wine-table th {
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 1rem;
    }

    .wine-table td {
      padding: 12px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant);
      color: var(--md-sys-color-on-surface);
      vertical-align: top;
    }

    .wine-table tr:hover {
      background: var(--md-sys-color-surface-variant);
    }

    .wine-table tr:last-child td {
      border-bottom: none;
    }

    .wine-name {
      font-weight: 600;
      color: var(--md-sys-color-primary);
    }

    .chinese-name {
      color: var(--md-sys-color-on-surface-variant);
      font-size: 0.9rem;
      margin-top: 5px;
    }

    .vintage {
      font-weight: 600;
      text-align: center;
    }

    .price {
      font-weight: 700;
      color: var(--md-sys-color-tertiary);
      text-align: right;
    }

    .region-name {
      font-style: italic;
      color: var(--md-sys-color-on-surface-variant);
    }

    /* Breadcrumb */
    .breadcrumb {
      padding: 20px 0;
      color: var(--md-sys-color-on-surface-variant);
    }

    .breadcrumb a {
      color: var(--md-sys-color-primary);
      text-decoration: none;
      transition: color 0.3s;
    }

    .breadcrumb a:hover {
      color: var(--md-sys-color-secondary);
    }

    /* Back to top button */
    .back-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 1.2rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s;
    }

    .back-to-top:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    }

    /* Mobile Navigation Styles */
    @media (max-width: 768px) {
      /* Hide desktop navigation */
      .desktop-nav {
        display: none !important;
      }

      /* Show mobile navigation */
      .mobile-nav {
        display: flex !important;
      }

      /* Wine table mobile adjustments */
      .wine-table {
        font-size: 0.9rem;
      }

      .wine-table th,
      .wine-table td {
        padding: 8px 6px;
      }

      .country-header {
        font-size: 2rem;
      }

      .region-header {
        font-size: 1.5rem;
      }

      /* Mobile navigation link hover */
      .mobile-nav-link:hover {
        background: var(--md-sys-color-primary-container) !important;
        color: var(--md-sys-color-primary) !important;
      }

      /* Mobile menu active states */
      #mobile-menu-overlay.active {
        opacity: 1 !important;
        visibility: visible !important;
      }

      #mobile-menu-overlay.active #mobile-menu {
        transform: translateX(0) !important;
      }
    }

    #age-gate-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #333;
      color: #fff;
      text-align: center;
      padding: 15px;
      z-index: 1001;
    }

    #age-gate-banner p {
      margin: 0;
      font-size: 2em;
    }
  </style>
  <link rel="stylesheet" href="css/inquiry_modal.css">
</head>

<body class="light">

  <div id="age-gate-banner">
    <p>未滿18歲請勿飲酒，開車不喝酒</p>
  </div>

  <!-- Sticky Navigation Header -->
  <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--md-sys-color-surface-container); backdrop-filter: blur(10px); border-bottom: 1px solid var(--md-sys-color-outline-variant); padding: 15px 0;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="img/7pyramidlogo.jpg" alt="Seven Pyramid Logo" style="height: 40px; width: auto; border-radius: 6px;">
        <div style="font-size: 1.5rem; font-weight: bold; color: var(--md-sys-color-primary);">
          <a href="index.html" style="text-decoration: none; color: inherit;">七銘企業 Seven Pyramid</a>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div id="desktop-nav" class="desktop-nav" style="display: flex; align-items: center; gap: 30px;">
        <a href="index.html" class="nav-link" style="text-decoration: none; color: var(--md-sys-color-on-surface); font-weight: 500; transition: color 0.3s;">首頁</a>
        <a href="#french-wines" class="nav-link" style="text-decoration: none; color: var(--md-sys-color-on-surface); font-weight: 500; transition: color 0.3s;">法國酒款</a>
        <a href="#usa-wines" class="nav-link" style="text-decoration: none; color: var(--md-sys-color-on-surface); font-weight: 500; transition: color 0.3s;">美國酒款</a>
        <a href="#chilean-wines" class="nav-link" style="text-decoration: none; color: var(--md-sys-color-on-surface); font-weight: 500; transition: color 0.3s;">智利酒款</a>
        <button id="theme-toggle" style="padding: 8px 12px; border: none; border-radius: 20px; cursor: pointer; background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); font-size: 0.9rem;">🌙</button>
      </div>

      <!-- Mobile Navigation (hamburger menu + theme toggle) -->
      <div id="mobile-nav" class="mobile-nav" style="display: none; align-items: center; gap: 15px;">
        <button id="theme-toggle-mobile" style="padding: 8px 12px; border: none; border-radius: 20px; cursor: pointer; background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); font-size: 0.9rem;">🌙</button>
        <button id="mobile-menu-toggle" style="padding: 12px; border: none; background: none; color: var(--md-sys-color-primary); cursor: pointer; font-size: 1.5rem; border-radius: 8px; transition: all 0.3s;">☰</button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu Overlay -->
  <div id="mobile-menu-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; opacity: 0; visibility: hidden; transition: all 0.3s ease;">
    <div id="mobile-menu" style="position: absolute; top: 0; right: 0; width: 300px; height: 100%; background: var(--md-sys-color-surface-container); transform: translateX(100%); transition: transform 0.3s ease; padding: 80px 0 20px 0; overflow-y: auto;">
      <div style="padding: 0 20px;">
        <button id="mobile-menu-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 1.5rem; color: var(--md-sys-color-on-surface); cursor: pointer;">✕</button>

        <div style="margin-bottom: 30px;">
          <img src="img/7pyramidlogo.jpg" alt="Seven Pyramid Logo" style="height: 50px; width: auto; border-radius: 8px; display: block; margin: 0 auto 15px;">
          <h3 style="text-align: center; color: var(--md-sys-color-primary); font-size: 1.2rem; margin: 0;">七銘企業 Seven Pyramid</h3>
        </div>

        <nav>
          <a href="index.html" class="mobile-nav-link" style="display: block; padding: 15px 20px; color: var(--md-sys-color-on-surface); text-decoration: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: all 0.3s;">
            🏠 首頁
          </a>
          <a href="#french-wines" class="mobile-nav-link" style="display: block; padding: 15px 20px; color: var(--md-sys-color-on-surface); text-decoration: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: all 0.3s;">
            🇫🇷 法國酒款
          </a>
          <a href="#usa-wines" class="mobile-nav-link" style="display: block; padding: 15px 20px; color: var(--md-sys-color-on-surface); text-decoration: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: all 0.3s;">
            🇺🇸 美國酒款
          </a>
          <a href="#chilean-wines" class="mobile-nav-link" style="display: block; padding: 15px 20px; color: var(--md-sys-color-on-surface); text-decoration: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: all 0.3s;">
            🇨🇱 智利酒款
          </a>
          <a href="index.html#services" class="mobile-nav-link" style="display: block; padding: 15px 20px; color: var(--md-sys-color-on-surface); text-decoration: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: all 0.3s;">
            🎯 服務項目
          </a>
          <a href="index.html#contact" class="mobile-nav-link" style="display: block; padding: 15px 20px; color: var(--md-sys-color-on-surface); text-decoration: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: all 0.3s;">
            📞 聯繫我們
          </a>
          <a href="https://newyear.7pyramid.com" class="mobile-nav-link" target="_blank" style="display: block; padding: 15px 20px; color: var(--md-sys-color-primary); text-decoration: none; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: all 0.3s;">
            🌐 線上酒款目錄
          </a>
        </nav>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <main style="margin-top: 80px; padding: 40px 20px;">
    <div style="max-width: 1200px; margin: 0 auto;">

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a href="index.html">七銘葡萄酒首頁</a> / 完整酒款目錄
      </div>

      <!-- Page Header -->
      <div style="text-align: center; margin: 40px 0 60px 0;">
        <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); color: var(--md-sys-color-primary); margin-bottom: 20px; font-weight: 700;">Seven Pyramid 頂級葡萄酒進口商 - 完整酒款目錄</h1>
        <p style="font-size: 1.2rem; color: var(--md-sys-color-on-surface-variant); max-width: 700px; margin: 0 auto; line-height: 1.6;">
          台北市內湖區總店 ＆ 新竹市Howine分店，專業進口世界頂級葡萄酒，每一瓶都經過專業團隊嚴格挑選<br>
          <span style="color: var(--md-sys-color-primary); font-weight: 600;">雙地現貨供應 | 專業服務 | 企業團購優惠 | 新竹科學園區配送</span>
        </p>
      </div>

      <!-- Special Promotion Banner -->
      <div style="margin-bottom: 60px; padding: 30px; background: linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-secondary) 100%); border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); color: white; text-align: center;">
        <h2 style="font-size: 1.8rem; font-weight: 700; margin: 0 0 15px 0; letter-spacing: 1px;">🎊 赤馬年限定特價酒款 🎊</h2>
        <p style="font-size: 1.3rem; margin: 0 0 10px 0; font-weight: 600;">60年限定特價</p>
        <p style="font-size: 1.1rem; margin: 0 0 15px 0; line-height: 1.6;">只到 <strong style="font-size: 1.2rem;">2026年2月28日</strong></p>
        <p style="font-size: 1rem; margin: 0 0 15px 0; opacity: 0.95;">✨ 價格與優惠：6瓶為一個銷售單位<br><strong>單瓶詳細價格敬請洽詢</strong></p>
        <p style="font-size: 0.95rem; margin: 0; opacity: 0.9;">📞 台北總店：(02) 2791-2147 | 新竹Howine分店：(02) 2791-2147<br>歡迎電洽或親臨門市諮詢最新優惠</p>
      </div>

      <!-- Service Area Section -->
      <section class="wine-section" style="margin-bottom: 60px;">
        <h2 style="color: var(--md-sys-color-secondary); font-size: 1.8rem; font-weight: 600; margin-bottom: 25px; text-align: center;">🏪 雙店服務區域與特色</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div style="background: var(--md-sys-color-surface); border-radius: 15px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: var(--md-sys-color-primary); font-size: 1.3rem; margin-bottom: 15px;">📍 台北總店服務區域</h3>
            <p style="color: var(--md-sys-color-on-surface); line-height: 1.6; margin-bottom: 15px;">主要服務台北市、新北市、桃園市客戶</p>
            <ul style="color: var(--md-sys-color-on-surface-variant); list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 8px;">🏢 台北市內湖區總店</li>
              <li style="margin-bottom: 8px;">✅ 台北市松山區門市現貨供應</li>
              <li style="margin-bottom: 8px;">🚚 大台北地區當日配送服務</li>
              <li style="margin-bottom: 8px;">📞 總店專線: (02) 2791-2147</li>
            </ul>
          </div>
          <div style="background: var(--md-sys-color-surface); border-radius: 15px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: var(--md-sys-color-primary); font-size: 1.3rem; margin-bottom: 15px;">📍 新竹Howine服務區域</h3>
            <p style="color: var(--md-sys-color-on-surface); line-height: 1.6; margin-bottom: 15px;">主要服務新竹縣、新竹市、台中市、台中縣客戶</p>
            <ul style="color: var(--md-sys-color-on-surface-variant); list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 8px;">🏢 新竹市Howine分店</li>
              <li style="margin-bottom: 8px;">💼 新竹科學園區企業配送</li>
              <li style="margin-bottom: 8px;">🚚 新竹市區配送服務</li>
              <li style="margin-bottom: 8px;">📞 分店專線: (02) 2791-2147</li>
            </ul>
          </div>
          <div style="background: var(--md-sys-color-surface); border-radius: 15px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: var(--md-sys-color-primary); font-size: 1.3rem; margin-bottom: 15px;">📰 台灣品酒會活動週報</h3>
            <p style="color: var(--md-sys-color-on-surface); line-height: 1.6; margin-bottom: 15px;">定期於台北市與新竹市舉辦專業品酒會，歡迎愛酒人士參加</p>
            <ul style="color: var(--md-sys-color-on-surface-variant); list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 8px;">🥂 雙店每月主題品酒會</li>
              <li style="margin-bottom: 8px;">👨‍🏫 專業侍酒師導覽</li>
              <li style="margin-bottom: 8px;">🎯 企業品酒活動規劃</li>
              <li style="margin-bottom: 8px;">📅 預約制小班教學</li>
            </ul>
          </div>
          <div style="background: var(--md-sys-color-surface); border-radius: 15px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h3 style="color: var(--md-sys-color-primary); font-size: 1.3rem; margin-bottom: 15px;">🎯 專業服務特色</h3>
            <p style="color: var(--md-sys-color-on-surface); line-height: 1.6; margin-bottom: 15px;">Seven Pyramid 專業團隊為您提供全方位服務</p>
            <ul style="color: var(--md-sys-color-on-surface-variant); list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 8px;">🍷 專業侍酒師諮詢服務</li>
              <li style="margin-bottom: 8px;">🏢 企業客戶專案採購</li>
              <li style="margin-bottom: 8px;">🎁 客製化禮盒包裝服務</li>
              <li style="margin-bottom: 8px;">📦 溫控冷鏈配送保障</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Dynamic Country Sections will be inserted here -->
      ${this.generateCountrySections(pathPrefix)}

      <!-- Contact Section -->
      ${this.generateContactSection()}
    </div>
  </main>

  <!-- Back to Top Button -->
  <button class="back-to-top" id="back-to-top-btn" style="display: none;">↑</button>

  <script src="js/app.js"></script>
  <script src="js/csp-fix.js"></script>
  <script src="js/inquiry_modal.js"></script>
</body>

</html>`;
  }

  /**
   * Generate individual wine page HTML
   */
  generateWinePageHTML(wine, country, region) {
    const wineSlug = this.createSlug(wine.name);
    const normalizedName = this.normalizeWineName(wine.name);
    const pageTitle = `${normalizedName} ${wine.vintage} | ${wine.nameCh} - ${CONFIG.siteName}`;
    const priceFormatted = wine.price.twd.toLocaleString();
    const totalPrice = (wine.price.twd * 6).toLocaleString();

    // Awards HTML generation
    let scoreSectionHtml = '';
    if (wine.awards && wine.awards.length > 0) {
      const scoreItems = wine.awards.map(award => {
        // Handle string scores like "RP 98" or object scores if structure changes
        let score = award;
        let critic = 'Score';
        
        if (typeof award === 'string') {
          // Attempt to parse "Critic Score" format (e.g. "RP 98" or "98 RP")
          const match = award.match(/([A-Z]{1,3})\s*(\d{2,3})|(\d{2,3})\s*([A-Z]{1,3})/i);
          if (match) {
             score = match[2] || match[3];
             critic = match[1] || match[4];
          } else {
             // Try just number
             const numMatch = award.match(/\d{2,3}/);
             if (numMatch) score = numMatch[0];
          }
        }
        
        return `
      <div class="score-item">
        <div class="score-num">${score}</div>
        <div class="score-critic">${critic}</div>
      </div>`;
      }).join('');

      scoreSectionHtml = `
<section class="score-bar">
  <div class="container">
    <div class="score-grid">
      ${scoreItems}
    </div>
  </div>
</section>`;
    } else {
       // Placeholder scores if none exist, or hide section? 
       // Hiding for now to be accurate to data, but user asked for structure.
       // Let's generate a generic "Premium" badge if no scores to keep layout
       scoreSectionHtml = `
<section class="score-bar">
  <div class="container">
    <div class="score-grid">
      <div class="score-item">
        <div class="score-num" style="font-size: 2rem;">Premium</div>
        <div class="score-critic">Selection</div>
      </div>
    </div>
  </div>
</section>`;
    }

    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <linkpreconnect="https://fonts.googleapis.com">
  <linkpreconnect="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&family=Noto+Serif+TC:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-gold: #D4AF37;
      --color-gold-light: #F3E5AB;
      --color-wine-red: #5e0d0d;
      --color-dark-bg: #121212;
      --color-charcoal: #1a1a1a;
      --color-text-light: #f4f4f4;
      --color-text-muted: #aaaaaa;
      --font-serif-en: 'Playfair Display', serif;
      --font-serif-tw: 'Noto Serif TC', serif;
      --font-sans: 'Montserrat', sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-sans);
      background-color: var(--color-dark-bg);
      color: var(--color-text-light);
      line-height: 1.6;
      overflow-x: hidden;
    }

    h1, h2, h3, h4 { font-weight: 400; }
    a { text-decoration: none; color: inherit; }

    .container { width: 90%; max-width: 1200px; margin: 0 auto; }
    .text-gold { color: var(--color-gold); }
    .serif-en { font-family: var(--font-serif-en); }
    .serif-tw { font-family: var(--font-serif-tw); }
    .text-center { text-align: center; }

    /* --- Section: Hero --- */
    .hero-section {
      min-height: 95vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, #2a2a2a 0%, #000000 100%);
      position: relative;
      padding: 100px 0;
    }

    .hero-content { text-align: center; z-index: 2; }
    .hero-subtitle { font-size: 1.2rem; letter-spacing: 2px; margin-bottom: 1rem; text-transform: uppercase; }
    .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; line-height: 1.1; margin-bottom: 1rem; }
    .hero-title-tw { font-size: clamp(1.5rem, 3vw, 2.5rem); margin-bottom: 3rem; color: var(--color-text-muted); }

    .bottle-image-placeholder {
      height: 500px; width: auto; margin: 0 auto 2rem auto; display: flex;
      justify-content: center; align-items: center;
      /* background-image: url('../../${wine.imageUrl}'); */ /* Uncomment when real images exist */
      background: linear-gradient(45deg, #333, #444); color: #777; border: 1px dashed var(--color-gold);
    }
    
    .bottle-image {
        height: 500px; width: auto; max-width: 100%; object-fit: contain; margin-bottom: 2rem;
        filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
    }

    .owc-badge { display: inline-block; border: 1px solid var(--color-gold); padding: 10px 25px; font-size: 0.9rem; letter-spacing: 1px; color: var(--color-gold); }

    /* --- Section: Scores --- */
    .score-bar { background-color: var(--color-wine-red); padding: 40px 0; border-top: 2px solid var(--color-gold); border-bottom: 2px solid var(--color-gold); }
    .score-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; }
    .score-item { text-align: center; flex: 1 1 150px; }
    .score-num { font-family: var(--font-serif-en); font-size: 3.5rem; font-weight: 700; color: var(--color-gold-light); line-height: 1; }
    .score-critic { font-size: 0.9rem; letter-spacing: 1px; margin-top: 10px; text-transform: uppercase; }

    /* --- Section: The Story --- */
    .story-section { padding: 100px 0; background-color: var(--color-charcoal); }
    .split-layout { display: flex; gap: 60px; align-items: center; }
    .split-image { flex: 1; height: 500px; background-color: #333; position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; }
    .split-image::after { content: ''; position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.3); }
    .split-content { flex: 1; }
    .section-title-tw { font-size: 2.2rem; margin-bottom: 2rem; }
    .tasting-note-tw { font-size: 1.1rem; margin-bottom: 2.5rem; color: #d9d9d9; }
    .highlight { color: var(--color-gold-light); font-weight: 700; }
    .en-description { font-size: 0.95rem; color: var(--color-text-muted); border-left: 2px solid var(--color-wine-red); padding-left: 20px; font-style: italic; margin-top: 20px; }

    /* --- Section: The Collection --- */
    .collection-section { padding: 100px 0; background-color: #0f0f0f; text-align: center; }
    .owc-image-placeholder { max-width: 600px; height: 350px; margin: 0 auto 3rem auto; background-color: #4a3c31; border: 5px solid #2c231d; display: flex; justify-content: center; align-items: center; color: #aaa; }
    .specs-list { list-style: none; display: inline-block; text-align: left; }
    .specs-list li { margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; }
    .specs-list li::before { content: '✦'; color: var(--color-gold); margin-right: 15px; }

    /* --- Section: Pricing & CTA --- */
    .cta-section { padding: 120px 0; background: linear-gradient(to bottom, var(--color-dark-bg), var(--color-wine-red)); text-align: center; }
    .price-tag { margin-bottom: 40px; }
    .price-label { font-size: 1.2rem; color: var(--color-text-muted); margin-bottom: 10px; }
    .price-amount { font-family: var(--font-serif-en); font-size: 4rem; color: var(--color-gold-light); font-weight: 700; }
    .price-note { color: var(--color-text-muted); font-size: 1rem; margin-top: 10px; }
    .cta-button { display: inline-block; padding: 20px 50px; background: linear-gradient(to right, var(--color-gold), #b88a14); color: #000; font-size: 1.2rem; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; transition: transform 0.3s ease, box-shadow 0.3s ease; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); }
    .cta-button:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.5); }
    .contact-info { margin-top: 30px; color: var(--color-text-muted); }

    /* --- Footer & Warning --- */
    .footer { padding: 50px 0 80px; text-align: center; font-size: 0.9rem; color: #666; background-color: #000; }
    .warning-banner { position: fixed; bottom: 0; left: 0; width: 100%; background-color: #000; color: #fff; text-align: center; padding: 15px 0; font-size: 1.2rem; font-weight: 700; z-index: 100; border-top: 3px solid red; }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.5rem; }
      .hero-title-tw { font-size: 1.5rem; }
      .bottle-image-placeholder, .bottle-image { height: 350px; }
      .score-num { font-size: 2.5rem; }
      .split-layout { flex-direction: column; }
      .split-image { height: 300px; width: 100%; }
      .price-amount { font-size: 3rem; }
    }
  </style>
</head>
<body>

<section class="hero-section">
  <div class="container hero-content">
    <h3 class="hero-subtitle serif-en text-gold">${region.name} ${wine.subRegion ? '| ' + wine.subRegion : ''}</h3>
    <h1 class="hero-title serif-en">${normalizedName}</h1>
    <h2 class="hero-title-tw serif-tw">${wine.nameCh}</h2>

    <div class="owc-badge serif-tw">原廠 6 入木箱 / 現貨供應</div>
  </div>
</section>

${scoreSectionHtml}

<section class="story-section">
  <div class="container split-layout">
    <div class="split-image">
      ${wine.imageUrl && !wine.imageUrl.includes('placeholder')
        ? `<img src="../../${wine.imageUrl}" alt="${wine.name}" style="height: 100%; width: auto; object-fit: contain;">`
        : `<div style="color: #fff; text-align:center;"><span style="font-size:3rem; display:block;">🏰</span>${wine.region}</div>`
      }
    </div>
    <div class="split-content">
      <h3 class="section-title-tw serif-tw text-gold">酒款介紹</h3>
      <div class="tasting-note-tw serif-tw">
        ${wine.description ? `<p>${wine.description}</p><br>` : ''}
        
        <p><span class="highlight">品飲筆記：</span></p>
        ${typeof wine.tastingNotes === 'string' ? 
          `<p>${wine.tastingNotes}</p>` :
          `<ul style="list-style:none; margin-left:10px;">
            ${wine.tastingNotes.appearance ? `<li>👁️ 外觀：${wine.tastingNotes.appearance}</li>` : ''}
            ${wine.tastingNotes.aroma ? `<li>👃 香氣：${wine.tastingNotes.aroma}</li>` : ''}
            ${wine.tastingNotes.palate ? `<li>👄 口感：${wine.tastingNotes.palate}</li>` : ''}
            ${wine.tastingNotes.finish ? `<li>🏁 餘韻：${wine.tastingNotes.finish}</li>` : ''}
          </ul>`
        }
        <br>
        ${typeof wine.foodPairing === 'string' ?
          `<p><span class="highlight">🍽️ 餐酒搭配：</span>${wine.foodPairing}</p>` :
          (wine.foodPairing.length > 0 ? `<p><span class="highlight">🍽️ 餐酒搭配：</span>${wine.foodPairing.join('、')}</p>` : '')
        }
        <br>
        ${wine.drinkingWindow ? `<p><span class="highlight">⏳ 適飲期：</span>${wine.drinkingWindow}</p>` : ''}
      </div>
      
      <div class="en-description serif-en">
        ${normalizedName} (${wine.vintage}) from ${wine.region}.
        ${wine.grapes && wine.grapes.length > 0 ? `Blend of ${wine.grapes.join(', ')}.` : ''}
        Stored in professional climate-controlled cellar.
      </div>
    </div>
  </div>
</section>

<section class="collection-section">
  <div class="container">
    <h3 class="section-title-tw serif-tw text-gold" style="margin-bottom: 3rem;">收藏規格</h3>
    <!--
    <div class="owc-image-placeholder">
       (Optional: Wooden Case Image)
    </div>
    -->
    <ul class="specs-list serif-tw">
      <li>編號：${wine.id}</li>
      <li>格式：${wine.bottleSize || '750ml'} 標準瓶</li>
      <li>產區：${country.name} - ${region.name}</li>
      <li>適飲期：${wine.drinkingWindow || '請洽詢'}</li>
      <li>來源：${CONFIG.companyInfo.name} 直送，全程專業溫控</li>
    </ul>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="price-tag">
      <div class="price-label serif-tw">單瓶珍藏價</div>
      <div class="price-amount">NT$ ${priceFormatted}</div>
      <div class="price-note serif-tw">
        <div style="margin-bottom: 15px;">（優先保留 6入完整木箱訂單，總價 NT$ ${totalPrice}）</div>
        <div style="padding: 15px; background: rgba(212, 175, 55, 0.15); border-left: 4px solid var(--color-gold); border-radius: 4px; margin-top: 15px;">
          <div style="color: var(--color-gold-light); font-weight: 600; margin-bottom: 8px;">🎊 限定特價優惠</div>
          <div style="font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.6;">
            • 限定時間：2026年2月28日截止<br>
            • 最低訂購量：6瓶為一個銷售單位<br>
            • 單瓶詳細價格敬請洽詢
          </div>
        </div>
      </div>
    </div>

    <a href="tel:${CONFIG.companyInfo.phone.replace(/-/g, '')}" class="cta-button">
      立即預約洽詢
    </a>

    <div class="contact-info serif-tw">
      <p>VIP 專屬顧問服務 | 請來電確認庫存與配額</p>
      <p style="margin-top:10px; font-size:0.9rem;">${CONFIG.companyInfo.phone}</p>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>© ${new Date().getFullYear()} ${CONFIG.siteName}. All Rights Reserved.</p>
    <p style="margin-top:10px;"><a href="../../wine_list.html" style="color:#888;">Back to Catalog</a></p>
  </div>
</footer>

<div class="warning-banner serif-tw">
  禁止酒駕 &nbsp;&nbsp;&nbsp; 未滿十八歲禁止飲酒
</div>

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

  <!-- CollectionPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${country.name} Wines - ${CONFIG.siteName}",
    "description": "A collection of wines from ${country.name}.",
    "url": "https://newyear.7pyramid.com/countries/${countryCode}.html"
  }
  </script>
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

  <!-- CollectionPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${region.name} Wines - ${country.name} - ${CONFIG.siteName}",
    "description": "A collection of wines from the ${region.name} region in ${country.name}.",
    "url": "https://newyear.7pyramid.com/regions/${countryCode}-${regionCode}.html"
  }
  </script>
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
          <a href="../french_wine_knowledge.html" class="nav-link" style="text-decoration: none; color: var(--md-sys-color-on-surface); font-weight: 500; transition: color 0.3s;">葡萄酒知識</a>
          <button id="theme-toggle" style="padding: 8px 12px; border: none; border-radius: 20px; cursor: pointer; background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); font-size: 0.9rem;">🌙</button>
        </div>
      </div>
    </nav>`;
  }

  generateCountrySections(pathPrefix = '') {
    let html = '';
    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      // Map country code to ID style (e.g. 'france' -> 'french-wines')
      let sectionId = countryCode + '-wines';
      if (countryCode === 'france') sectionId = 'french-wines';
      if (countryCode === 'australia') sectionId = 'australian-wines';
      if (countryCode === 'chile') sectionId = 'chilean-wines';
      if (countryCode === 'usa') sectionId = 'usa-wines';

      html += `
      <section id="${sectionId}" class="wine-section">
        <h2 class="country-header">
          <a href="${pathPrefix}countries/${countryCode}.html" style="text-decoration: none; color: inherit;">
            ${country.emoji} ${country.name}
          </a>
        </h2>`;

      Object.entries(country.regions).forEach(([regionCode, region]) => {
        const regionTitle = region.name === region.nameEn ? region.name : `${region.name} ${region.nameEn}`;
        html += `
        <h3 class="region-header">
          <a href="${pathPrefix}regions/${countryCode}-${regionCode}.html" style="text-decoration: none; color: inherit;">
            ${regionTitle}
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
          const normalizedName = this.normalizeWineName(wine.name);
          html += `
            <tr>
              <td class="wine-name">
                <a href="${pathPrefix}wines/${wine.id.toLowerCase()}-${wineSlug}.html" style="text-decoration: none; color: inherit; font-weight: 600;">
                  ${normalizedName}
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
            ${normalizedName}
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
      "name": `${this.normalizeWineName(wine.name)} ${wine.vintage}`,
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
            "name": "${this.normalizeWineName(wine.name)} ${wine.vintage}",
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
   * Normalize wine names: convert various château abbreviations to "Château"
   */
  normalizeWineName(name) {
    if (!name) return name;

    // Clean up corrupted Unicode characters that look like regular ASCII
    // Replace special Unicode characters with regular ASCII equivalents
    let cleaned = name
      .replace(/[\u0080-\uffff]/g, (char) => {
        const code = char.charCodeAt(0);
        // U+EEA9 appears to be a corrupted 'a' character
        if (code === 0xEEA9) return 'a';
        // Default: try to approximate the character
        return char;
      });

    // Fix misspelled "Chateau" (with regular 'a' or corrupted 'a') at word boundaries
    let normalized = cleaned.replace(/\b(Chteau|chteau|Chateau|chateau)\b/g, 'Château');

    // Remove leading year numbers (e.g., "2021CH D'ARMAILHAC2021" → "CH D'ARMAILHAC2021")
    normalized = normalized.replace(/^\d+\s*(CH|CHAT|CHATEAU|Chateau|chateau|chat|ch|Ch|CH\.|Ch\.)\s/gi, 'Château ');

    // Replace château abbreviations at word boundaries (including CH., Ch, Chateau, etc.)
    normalized = normalized.replace(/\b(CH\.|Ch\.|Chateau\.|chateau\.|CH|CHAT|CHATEAU|Chateau|chateau|chat|ch|Ch)\s/g, (match, p1) => 'Château ');

    // Also handle CH. and Ch. without trailing space (at end of string or before punctuation)
    normalized = normalized.replace(/\b(CH\.|Ch\.|Chateau\.|chateau\.)(?=[A-Z])/g, 'Château');

    // Add spacing before years if missing (e.g., "BAGES2021" → "BAGES 2021")
    normalized = normalized.replace(/([A-Za-z])(\d{4})/g, '$1 $2');

    // Clean up multiple spaces
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
  }

  /**
   * Additional helper methods for complex HTML generation
   */
  generateCountryRegionsHTML(country) {
    let html = '';
    Object.entries(country.regions).forEach(([regionCode, region]) => {
      // Filter out wines with 0 price
      const validWines = region.wines.filter(wine => wine.price.twd > 0);
      
      if (validWines.length === 0) return; // Skip region if no valid wines

      html += `
      <section class="wine-section">
        <h3 class="region-header">${region.name} (${region.nameEn})</h3>
        <p style="color: var(--md-sys-color-on-surface-variant); margin-bottom: 30px; font-size: 1.1rem; line-height: 1.6;">
          ${region.description}
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">`;

      validWines.forEach(wine => {
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
    // Filter out wines with 0 price
    const validWines = region.wines.filter(wine => wine.price.twd > 0);
    
    if (validWines.length === 0) return ''; // Don't generate empty table sections

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

    validWines.forEach(wine => {
      const wineSlug = this.createSlug(wine.name);
      const stockStatus = wine.inStock ? '✅ 現貨' : '❌ 缺貨';
      html += `
        <tr>
          <td class="wine-name">
            <a href="../wines/${wine.id.toLowerCase()}-${wineSlug}.html" style="text-decoration: none; color: inherit; font-weight: 600;">
              ${this.normalizeWineName(wine.name)}
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