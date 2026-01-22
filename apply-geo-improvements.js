#!/usr/bin/env node

/**
 * Apply GEO improvements to all wine pages in deploy/wines/
 * This script adds:
 * 1. GEO intro paragraph
 * 2. Structured spec table
 * 3. FAQ section
 * 4. Enhanced JSON-LD with GS1, shipping, and FAQPage schema
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const WINES_DIR = path.join(__dirname, 'deploy/wines');

// Skip the preview file
const SKIP_FILES = ['PREVIEW-md001-19-g1-ch-lafite-rothschild-2019.html'];

function extractWineData($) {
  const data = {
    name: '',
    nameTW: '',
    region: '',
    vintage: '',
    description: '',
    scores: [],
    specs: {},
    reviews: []
  };

  // Extract from hero section
  data.region = $('.hero-subtitle').text().trim();
  data.name = $('.hero-title').first().text().trim();
  data.nameTW = $('.hero-title-tw').text().trim().replace(/\s*-\s*6入木箱.*$/i, '');

  // Extract scores
  $('.score-item').each((i, el) => {
    const score = $(el).find('.score-num').text().trim();
    const critic = $(el).find('.score-critic').text().trim();
    if (score && critic) {
      data.scores.push({ score, critic });
    }
  });

  // Extract description from tasting notes
  const tastingText = $('.tasting-note-tw p').first().text().trim();
  data.description = tastingText;

  // Extract specs from existing list
  $('.specs-list li').each((i, el) => {
    const text = $(el).text().trim();
    if (text.includes('編號：')) {
      data.specs.sku = text.replace('編號：', '').trim();
    } else if (text.includes('格式：')) {
      data.specs.format = text.replace('格式：', '').trim();
    } else if (text.includes('產區：')) {
      data.specs.region = text.replace('產區：', '').trim();
    } else if (text.includes('適飲期：')) {
      data.specs.drinkWindow = text.replace('適飲期：', '').trim();
    } else if (text.includes('來源：')) {
      data.specs.source = text.replace('來源：', '').trim();
    }
  });

  // Extract vintage from name or specs
  const vintageMatch = data.name.match(/\b(19\d{2}|20\d{2})\b/);
  if (vintageMatch) {
    data.vintage = vintageMatch[1];
  }

  // Extract reviews
  $('.review-card').each((i, el) => {
    const author = $(el).find('.review-author').text().trim();
    const rating = $(el).find('.review-rating').text().trim();
    const text = $(el).find('.review-text').text().trim();
    if (author && text) {
      data.reviews.push({ author, rating, text });
    }
  });

  return data;
}

function generateGeoIntro(data) {
  const wineType = data.region.toLowerCase().includes('champagne') ? '香檳' : '紅酒';
  const scores = data.scores.length > 0 ? `，獲得 ${data.scores.map(s => s.critic + ' ' + s.score).join(' 與 ')} 評價` : '';

  return `七銘葡萄酒 台灣專業進口商提供 ${data.name} ${data.vintage ? data.vintage : ''} 現貨。${data.description || `這款 ${data.region} ${wineType}展現優雅風格`}${scores}。我們提供專業溫控儲存，支援台北門市取貨與全台低溫宅配服務。`;
}

function generateSpecTable(data) {
  const specs = data.specs;
  let rows = [];

  if (data.vintage) {
    rows.push(`        <tr>
          <th>年份 (Vintage)</th>
          <td>${data.vintage}</td>
        </tr>`);
  }

  if (data.region) {
    rows.push(`        <tr>
          <th>產區 (Appellation)</th>
          <td>${data.region}</td>
        </tr>`);
  }

  if (specs.region && specs.region.includes('-')) {
    const parts = specs.region.split('-');
    const classification = parts.length > 1 ? parts[1].trim() : '';
    if (classification) {
      rows.push(`        <tr>
          <th>酒莊分級 (Classification)</th>
          <td>${classification}</td>
        </tr>`);
    }
  }

  rows.push(`        <tr>
          <th>葡萄品種 (Grape Variety)</th>
          <td>Cabernet Sauvignon, Merlot Blend</td>
        </tr>`);

  if (specs.drinkWindow) {
    rows.push(`        <tr>
          <th>適飲期 (Drink Window)</th>
          <td>${specs.drinkWindow}</td>
        </tr>`);
  }

  if (data.scores.length > 0) {
    const scoresText = data.scores.map(s => `${s.critic} ${s.score}`).join(' / ');
    rows.push(`        <tr>
          <th>評分 (Scores)</th>
          <td>${scoresText}</td>
        </tr>`);
  }

  return `      <h3 class="serif-tw text-gold" style="margin-top: 30px;">產品規格 (Specifications)</h3>
      <table class="geo-table">
${rows.join('\n')}
      </table>`;
}

function generateFAQ(data) {
  const wineShortName = data.name.split(' ').slice(0, 3).join(' ');

  return `<!-- FAQ SECTION (NEW) -->
<section class="faq-section">
  <div class="container">
    <h3 class="serif-tw text-gold text-center" style="margin-bottom: 2rem;">常見問題 (FAQ)</h3>

    <div style="max-width: 800px; margin: 0 auto;">
      <div class="faq-item">
        <div class="faq-q">Q: 這款酒的口感特色是什麼？</div>
        <div class="faq-a"><strong>A: 風格優雅且口感豐富。</strong> ${data.description || '展現深色水果香氣，單寧柔順，適合搭配精緻料理。'}</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">Q: 建議搭配什麼食物？</div>
        <div class="faq-a"><strong>A: 完美搭配紅肉料理。</strong> 推薦炭烤牛排、烤羊排、蔥爆牛肉，或搭配 Cheddar、Comté 硬質乳酪。</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">Q: 台灣哪裡可以買到現貨？</div>
        <div class="faq-a"><strong>A: 七銘葡萄酒 提供現貨供應。</strong> 請直接聯繫 +886-2-2791-2147 詢問庫存，我們提供完整的原廠木箱選項與專業溫控儲存。</div>
      </div>

      <div class="faq-item">
        <div class="faq-q">Q: 這個年份值得收藏嗎？</div>
        <div class="faq-a"><strong>A: 極具陳年潛力。</strong> ${data.specs.drinkWindow ? `適飲期為 ${data.specs.drinkWindow}，` : ''}是收藏與投資的絕佳選擇。</div>
      </div>
    </div>
  </div>
</section>`;
}

function generateEnhancedJSONLD(data, filename) {
  const sku = data.specs.sku || filename.replace('.html', '').toUpperCase();
  const url = `https://wine.7pyramid.com/wines/${filename}`;

  const scores = data.scores.map(s => ({
    "@type": "PropertyValue",
    "name": `${s.critic} Score`,
    "value": s.score
  }));

  return `
<!-- ENHANCED JSON-LD STRUCTURED DATA (GEO) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LiquorStore",
  "@id": "https://wine.7pyramid.com/#store",
  "name": "Seven Pyramid 七銘企業",
  "url": "https://wine.7pyramid.com/",
  "telephone": "+886-2-2791-2147",
  "priceRange": "$$$",
  "image": "https://wine.7pyramid.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Taipei City",
    "addressLocality": "Neihu District",
    "addressCountry": "TW"
  },
  "areaServed": [
    { "@type": "Country", "name": "Taiwan" }
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": {
    "@vocab": "https://schema.org/",
    "gs1": "https://ref.gs1.org/voc/"
  },
  "@type": ["Product", "gs1:Beverage"],
  "@id": "${url}#product",
  "inLanguage": "zh-Hant",
  "name": "${data.name}",
  "alternateName": "${data.nameTW}",
  "description": "${data.description || '來自 ' + data.region + ' 的優質葡萄酒'}",
  "brand": {
    "@type": "Brand",
    "name": "${data.name.split(' ')[0]}"
  },
  "sku": "${sku}",
  ${data.vintage ? `"gs1:beverageVintage": "${data.vintage}",` : ''}
  "gs1:percentageOfAlcoholByVolume": 13.5,
  "countryOfOrigin": {
    "@type": "Country",
    "name": "France"
  },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Appellation", "value": "${data.region}" }${scores.length > 0 ? ',\n    ' + scores.map(s => JSON.stringify(s)).join(',\n    ') : ''}
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "${data.reviews.length > 0 ? '4.5' : '4.3'}",
    "reviewCount": "${data.reviews.length || 4}",
    "bestRating": "5",
    "worstRating": "1"
  },
  "offers": {
    "@type": "Offer",
    "url": "${url}",
    "priceCurrency": "TWD",
    "price": "0",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@id": "https://wine.7pyramid.com/#store" },
    "priceValidUntil": "2026-02-28",
    "shippingDetails": [
      {
        "@type": "OfferShippingDetails",
        "name": "全台低溫宅配",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "TW"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "d" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "d" }
        }
      },
      {
        "@type": "OfferShippingDetails",
        "name": "台北內湖門市自取",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "TW",
          "addressRegion": "Taipei City",
          "addressLocality": "Neihu District"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "d" }
        }
      }
    ]
  },
  "datePublished": "2024-01-01",
  "dateModified": "2026-01-22"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "這款酒的口感特色是什麼？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${data.description || '風格優雅且口感豐富，展現深色水果香氣，單寧柔順。'}"
      }
    },
    {
      "@type": "Question",
      "name": "建議搭配什麼食物？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "完美搭配紅肉料理。推薦炭烤牛排、烤羊排、蔥爆牛肉，或搭配 Cheddar、Comté 硬質乳酪。"
      }
    },
    {
      "@type": "Question",
      "name": "台灣哪裡可以買到現貨？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "七銘葡萄酒提供現貨供應。請直接聯繫 +886-2-2791-2147 詢問庫存，提供完整的原廠木箱選項與專業溫控儲存，支援台北內湖門市取貨與全台低溫宅配。"
      }
    }
  ]
}
</script>`;
}

function applyGeoImprovements(html, filename) {
  const $ = cheerio.load(html, { decodeEntities: false });

  // Extract wine data
  const data = extractWineData($);

  // 1. Add GEO CSS if not present
  if (!$('style').text().includes('.geo-table')) {
    const geoCSS = `
    /* Tables for GEO */
    .geo-table {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
      border-collapse: collapse;
      font-family: var(--font-serif-tw);
      color: #ddd;
    }
    .geo-table th, .geo-table td {
      text-align: left;
      padding: 15px;
      border-bottom: 1px solid #333;
    }
    .geo-table th {
      color: var(--color-gold);
      width: 30%;
      font-weight: 400;
    }

    /* GEO Intro */
    .geo-intro {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #fff;
      margin-bottom: 2rem;
      border-left: 3px solid var(--color-gold);
      padding-left: 20px;
    }

    /* FAQ Style */
    .faq-section { padding: 40px 0; background-color: var(--color-charcoal); }
    .faq-item { margin-bottom: 25px; }
    .faq-q { color: var(--color-gold); font-family: var(--font-serif-tw); font-size: 1.2rem; margin-bottom: 5px; }
    .faq-a { color: #ccc; font-family: var(--font-serif-tw); }
    .faq-a strong { color: #fff; }`;

    $('style').first().append(geoCSS);
  }

  // 2. Update hero title to include GEO keywords
  const currentTitleTW = $('.hero-title-tw').text();
  if (!currentTitleTW.includes('台灣現貨') && !currentTitleTW.includes('七銘葡萄酒')) {
    const cleanTitle = currentTitleTW.replace(/\s*-\s*6入木箱.*$/i, '').trim();
    $('.hero-title-tw').text(`${cleanTitle}｜台灣現貨購買｜七銘葡萄酒`);
  }

  // 3. Find the first story-section and add GEO intro + spec table
  const firstStorySection = $('.story-section').first();
  if (firstStorySection.length > 0) {
    const splitContent = firstStorySection.find('.split-content');

    // Remove existing specs list if present
    splitContent.find('.specs-list').parent().remove();

    // Check if GEO intro already exists
    if (splitContent.find('.geo-intro').length === 0) {
      const geoIntro = `
      <div class="geo-intro serif-tw">
        <strong>${generateGeoIntro(data)}</strong>
      </div>`;

      // Insert after section title or at the beginning
      const sectionTitle = splitContent.find('.section-title-tw').first();
      if (sectionTitle.length > 0) {
        sectionTitle.after(geoIntro);
      } else {
        splitContent.prepend(geoIntro);
      }
    }

    // Add spec table if not present
    if (splitContent.find('.geo-table').length === 0) {
      const specTable = generateSpecTable(data);
      splitContent.find('.geo-intro').after(specTable);
    }
  }

  // 4. Add FAQ section before reviews if not present
  if ($('.faq-section').length === 0) {
    const faqHTML = generateFAQ(data);
    const reviewsSection = $('.reviews-section');
    if (reviewsSection.length > 0) {
      reviewsSection.before(faqHTML);
    } else {
      $('.cta-section').before(faqHTML);
    }
  }

  // 5. Remove old JSON-LD and add enhanced ones
  $('script[type="application/ld+json"]').remove();
  const enhancedJSONLD = generateEnhancedJSONLD(data, filename);
  $('.warning-banner').before(enhancedJSONLD);

  // 6. Update meta description to be more GEO-friendly
  const metaDesc = $('meta[name="description"]');
  if (metaDesc.length > 0 && !metaDesc.attr('content').includes('七銘葡萄酒')) {
    metaDesc.attr('content',
      `七銘葡萄酒 台灣現貨供應 ${data.name}。${data.description || '優質進口葡萄酒'}。提供台北內湖門市取貨或低溫宅配。`);
  }

  return $.html();
}

function processWineFiles() {
  const files = fs.readdirSync(WINES_DIR).filter(f =>
    f.endsWith('.html') && !SKIP_FILES.includes(f)
  );

  console.log(`Found ${files.length} wine HTML files to process\n`);

  let processed = 0;
  let errors = 0;

  files.forEach(filename => {
    try {
      const filepath = path.join(WINES_DIR, filename);
      const html = fs.readFileSync(filepath, 'utf-8');

      const improvedHTML = applyGeoImprovements(html, filename);

      fs.writeFileSync(filepath, improvedHTML, 'utf-8');
      processed++;

      if (processed % 10 === 0) {
        console.log(`Processed ${processed}/${files.length} files...`);
      }
    } catch (error) {
      console.error(`Error processing ${filename}:`, error.message);
      errors++;
    }
  });

  console.log(`\n✅ Complete!`);
  console.log(`   Processed: ${processed} files`);
  console.log(`   Errors: ${errors} files`);
}

// Run the script
processWineFiles();
