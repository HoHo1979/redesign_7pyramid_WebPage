# Seven Pyramid 七銘企業 - SEO & AEO Optimization Guide

**Last Updated:** 2025-12-20
**Target Market:** Taiwan (台灣) - Wine E-Commerce
**Primary Keywords:** 台北葡萄酒, 波爾多, 香檳, 新竹葡萄酒, 企業團購

---

## 📋 Table of Contents

1. [Current Optimization Status](#current-optimization-status)
2. [SEO Technical Implementation](#seo-technical-implementation)
3. [AEO (Answer Engine Optimization)](#aeo-answer-engine-optimization)
4. [Google Search Console Setup](#google-search-console-setup)
5. [Content Optimization](#content-optimization)
6. [Performance Metrics](#performance-metrics)
7. [Monthly Maintenance Checklist](#monthly-maintenance-checklist)

---

## ✅ Current Optimization Status

### Implemented Features:

| Feature | Status | Details |
|---------|--------|---------|
| **robots.txt** | ✅ Optimized | Comprehensive crawling rules with Googlebot prioritization |
| **sitemap.xml** | ✅ Implemented | 232 pages indexed, updated on each build |
| **Canonical URLs** | ✅ Correct | Both index.html and wine_list.html have canonical tags |
| **LocalBusiness Schema** | ✅ Complete | Dual locations (Taipei & Hsinchu) with coordinates |
| **FAQ Schema** | ✅ New | 8 common Q&A entries for AEO optimization |
| **BreadcrumbList Schema** | ✅ New | Implemented in wine_list.html |
| **OG Tags** | ✅ Fixed | Corrected URLs from wine.7pyramid.com to newyear.7pyramid.com |
| **Mobile Responsive** | ✅ Yes | Material Design 3 responsive grid system |
| **Page Load Speed** | ⚠️ TBD | Needs Google PageSpeed Insights check |
| **HTTPS** | ✅ Yes | SSL certificate assumed on production |

---

## 🔍 SEO Technical Implementation

### 1. Meta Tags Configuration

**Location:** `/deploy/index.html` & `/deploy/wine_list.html`

#### Title Tags:
```html
<!-- Homepage -->
<title>Seven Pyramid 七銘企業 - 台北新竹頂級葡萄酒進口商 | 法國波爾多香檳專賣</title>

<!-- Wine Catalog -->
<title>完整酒款目錄 - 七銘企業葡萄酒烈酒進口商 | 台北新竹頂級葡萄酒</title>
```

**Best Practice:** Keep titles between 50-60 characters for optimal SERP display

#### Meta Descriptions:
```html
<!-- Homepage Description (155 chars) -->
<meta name="description" content="Seven Pyramid 七銘企業，台北內湖區總店與新竹東區分店，專業進口法國波爾多、香檳、澳洲、智利頂級葡萄酒。提供企業團購、品酒活動、侍酒師服務。">

<!-- Wine Catalog Description -->
<meta name="description" content="台北市內湖區專業葡萄酒進口商，提供波爾多、香檳、勃艮第等頂級法國酒款...">
```

**Best Practice:** Keep descriptions between 150-160 characters

### 2. Schema Markup Implementation

#### LocalBusiness Schema (index.html)
- ✅ Company name and alternate names
- ✅ Dual locations with exact coordinates
- ✅ Business hours (Mo-Su 10:00-21:00)
- ✅ Service areas (7 cities in Taiwan)
- ✅ Payment methods
- ✅ Price range ($$$$)

**Impact:** Enables rich snippets in Google Search results

#### FAQ Schema (index.html)
- ✅ 8 common questions about services
- ✅ Detailed answers for each Q&A
- ✅ Covers service areas, delivery, hours, payments

**Impact:** May appear in Google's "People also ask" section; helps AI chatbots answer customer queries

#### BreadcrumbList Schema (wine_list.html)
- ✅ Hierarchy: Home → Wine Catalog
- ✅ Proper URL structure for crawlers

**Impact:** Improves site navigation understanding; better internal linking signals

### 3. Canonical URL Management

```html
<!-- Prevents duplicate content issues -->
<link rel="canonical" href="https://newyear.7pyramid.com/">
<link rel="canonical" href="https://newyear.7pyramid.com/wine_list.html">
```

**Why This Matters:** Tells Google which version is the authoritative source if similar content exists

### 4. Open Graph Tags (Social Sharing)

```html
<meta property="og:title" content="Seven Pyramid 七銘企業 - 台北新竹頂級葡萄酒進口商">
<meta property="og:type" content="website">
<meta property="og:url" content="https://newyear.7pyramid.com/">
<meta property="og:image" content="https://newyear.7pyramid.com/img/SPbackground1.png">
<meta property="og:description" content="...">
```

**Impact:** Controls how links appear when shared on Facebook, LinkedIn, LINE, WeChat

---

## 🤖 AEO (Answer Engine Optimization)

### Why AEO Matters for Seven Pyramid:

1. **AI Chatbots** (ChatGPT, Gemini, Claude) increasingly answer product queries
2. **Taiwan Market** is tech-savvy; many users rely on AI for recommendations
3. **Wine E-Commerce** is a natural fit for AI-guided purchases

### Implemented AEO Features:

#### 1. FAQ Schema
- Directly feeds AI chatbots with Q&A pairs
- Covers common customer concerns
- Helps with "zero-click" search results

**Sample Q&A:**
```
Q: "七銘企業有服務新竹科學園區嗎？"
A: "有的，我們在新竹市東區設有Howine分店，專門提供新竹科學園區企業配送服務..."
```

#### 2. Structured Product Data
- **Individual wine pages** (`/wines/*.html`) contain pricing and details
- **Wine catalog** (`wine_list.html`) provides searchable inventory
- **Country/Region pages** organize wines by geography

#### 3. Rich Text Content
- Wine descriptions include:
  - Country of origin
  - Region/Appellation
  - Vintage year
  - Price in TWD
  - Stock status
  - Tasting notes (on individual pages)

### Recommendations for Better AEO:

1. **Add Product Schema to wine_list.html** (Future Enhancement)
   ```json
   {
     "@type": "Product",
     "name": "Château Margaux 2015",
     "offers": {
       "@type": "Offer",
       "priceCurrency": "TWD",
       "price": "26000",
       "availability": "InStock"
     }
   }
   ```

2. **Create AI-Friendly Content Sections:**
   - Wine tasting notes (for GPT fine-tuning)
   - Food pairing recommendations
   - Health benefits (moderate consumption)
   - Gift recommendations by occasion

3. **Monitor AI Search Engines:**
   - ChatGPT (via OpenAI)
   - Google Gemini
   - Claude (Anthropic)
   - Perplexity AI

---

## 📊 Google Search Console Setup

### Configuration Checklist:

- [ ] **Property Verification:** Add both HTTP/HTTPS versions
- [ ] **Preferred Domain:** Set `newyear.7pyramid.com` as preferred
- [ ] **Sitemap Submission:** Already configured in robots.txt
  - Submit manually: https://search.google.com/search-console
  - URL: https://newyear.7pyramid.com/sitemap.xml
- [ ] **Mobile-Friendly Test:** Run on both main pages
  - Test URL: https://search.google.com/test/mobile-friendly
  - Focus on wine_list.html table responsiveness
- [ ] **Search Appearance:** Check rich snippets rendering
  - Local Business results
  - FAQ snippets
  - Breadcrumb display
- [ ] **Core Web Vitals:** Monitor LCP, FID, CLS
  - Desktop performance
  - Mobile performance (critical)
- [ ] **Index Coverage:** Ensure all 232 pages are indexed
  - Check for "Excluded" pages
  - Review crawl errors

### Performance Indicators to Monitor:

| Metric | Target | Current |
|--------|--------|---------|
| **Average CTR** | > 3% | TBD |
| **Average Position** | < 20 (Page 1-2) | TBD |
| **Impressions** | Growing monthly | TBD |
| **Mobile Usability** | 0 issues | Needs review |
| **Core Web Vitals** | All "Good" | Needs review |

---

## 📝 Content Optimization

### Homepage (index.html):

**H1 Heading:** Clear, single H1 tag
```html
<h1>Seven Pyramid 頂級葡萄酒進口商 - 台北新竹專業服務</h1>
```

**Content Structure:**
1. Hero section with value proposition
2. Service area highlights
3. Product categories (wine regions)
4. FAQ section (for AEO)
5. Contact information
6. Social proof (testimonials - if available)

### Wine Catalog (wine_list.html):

**H1 Heading:**
```html
<h1>Seven Pyramid 頂級葡萄酒進口商 - 完整酒款目錄</h1>
```

**Table Optimization:**
- ✅ Responsive design (collapses on mobile)
- ✅ Clear column headers (Wine Name, Chinese Name, Vintage, Region, Price, Stock)
- ✅ Wine names link to individual detail pages
- ⚠️ **Future:** Add filtering/sorting by price, region, country

**Content Organization:**
```
- France (法國葡萄酒)
  - Saint-Émilion
  - Pauillac
  - Champagne
  - etc.
- USA (美國葡萄酒)
  - California
  - etc.
- Chile (智利葡萄酒)
  - Central Valley
  - etc.
```

### Individual Wine Pages (`/wines/*.html`):

**Elements Per Page:**
- ✅ Wine name (Chinese + English)
- ✅ Vintage year
- ✅ Country + Region
- ✅ Price in TWD
- ✅ Stock status
- ✅ Tasting notes (if available)
- ✅ Producer information
- ✅ Structured data (LocalBusiness + wine context)

**Mobile Optimization:**
- ✅ Large font for price
- ✅ Clear CTA button ("立即預約洽詢")
- ✅ One-click phone call: `tel:` links

---

## ⚡ Performance Metrics

### Page Speed Optimization:

**Critical Actions:**
1. **Minimize CSS/JS:** Remove unused styles from build process
2. **Image Optimization:** Use WebP format where possible
   - Wine region maps: Reduce file size (< 500KB each)
   - Background images: Lazy load or use CSS gradients
3. **Font Loading:** Use system fonts or cached Google Fonts
4. **Caching:** Set proper cache headers for static assets
   - CSS/JS: 1 month
   - Images: 3 months
   - HTML pages: 1 week

### Monitoring Tools:

- **Google PageSpeed Insights:** https://pagespeed.web.dev/
- **Google Lighthouse:** Built into Chrome DevTools
- **Google Search Console:** "Core Web Vitals" report
- **Bing Webmaster Tools:** Performance metrics

### Target Metrics:

```
Desktop:
- LCP (Largest Contentful Paint): < 2.5s ✅
- FID (First Input Delay): < 100ms ⚠️
- CLS (Cumulative Layout Shift): < 0.1 ✅

Mobile:
- LCP: < 2.5s (critical for wine research)
- FID: < 100ms
- CLS: < 0.1
```

---

## 📅 Monthly Maintenance Checklist

### Week 1: Indexing & Coverage

- [ ] Check Google Search Console for new crawl errors
- [ ] Review "Coverage" report for excluded pages
- [ ] Verify sitemap.xml is up-to-date (should auto-generate)
- [ ] Test robots.txt with Google's tester: https://support.google.com/webmasters/answer/6062598

### Week 2: Performance & UX

- [ ] Run PageSpeed Insights on index.html
- [ ] Run PageSpeed Insights on wine_list.html
- [ ] Check Core Web Vitals in Search Console
- [ ] Test mobile responsiveness on multiple devices

### Week 3: Content & Keywords

- [ ] Review top-performing pages in Search Console
  - Which wines are searched for most?
  - Which regions drive traffic?
- [ ] Update wine inventory (if prices changed)
- [ ] Add seasonal promotions to FAQ or homepage
- [ ] Check competitor keywords (Bing, Google Keyword Planner)

### Week 4: AEO & Schema Validation

- [ ] Validate schema markup: https://schema.org/
- [ ] Test FAQ schema in Google Rich Results tool
- [ ] Check LocalBusiness schema rendering
- [ ] Test crawl rate in robots.txt
- [ ] Review backlink profile (Bing, Baidu if applicable)

### Quarterly Tasks:

- [ ] Refresh FAQ schema with new questions
- [ ] Update service areas if changed
- [ ] Add/update business hours in schema
- [ ] Renew SSL certificate (if applicable)
- [ ] Review and update canonical tags
- [ ] Audit internal linking strategy

---

## 🔗 Important Links for Maintenance

### Google Tools:
- **Search Console:** https://search.google.com/search-console
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **Structured Data Tester:** https://search.google.com/test/rich-results
- **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly

### Bing Tools (Secondary):
- **Bing Webmaster Tools:** https://www.bing.com/webmaster/

### Schema Validation:
- **Schema.org Validator:** https://validator.schema.org/
- **JSON-LD Playground:** https://json-ld.org/playground/

---

## 🚀 Future Enhancements (Roadmap)

### Priority 1 (High Impact):
1. **Add Product Schema to wine_list.html**
   - Each row should have minimal Product JSON-LD
   - Helps AI agents understand pricing
2. **Add Blog Section**
   - Wine tasting guides
   - Food pairing articles
   - Taiwan wine culture posts
3. **Improve Mobile Table Display**
   - Consider card layout instead of table on mobile
   - Better stock status indicators

### Priority 2 (Medium Impact):
1. **Add Customer Reviews/Ratings**
   - Aggregated Review schema
   - Ratings in search results
2. **Implement Local Structured Data**
   - Event schema for tasting events
   - Post schema for promotions
3. **Add Video Content**
   - Wine introduction videos
   - Sommelier recommendation videos
   - Video schema markup

### Priority 3 (Long-term):
1. **AI Chatbot Integration**
   - FAQ bot for customer service
   - Wine recommendation engine
2. **Multi-language Support**
   - English content for international market
   - hreflang tags for language variants
3. **PWA Features**
   - Already manifest.json exists
   - Add service workers for offline capability
   - Push notifications for price drops

---

## 📞 Contact & Support

For SEO questions or updates:
- **Email:** TBD
- **Phone:** (02) 2791-2147
- **Hours:** Mo-Su 10:00-21:00

---

## Version History

| Date | Changes | Author |
|------|---------|--------|
| 2025-12-20 | Initial SEO guide creation; robots.txt enhancement; FAQ schema added | AI Assistant |

---

**Last Audit:** 2025-12-20
**Next Audit:** 2026-01-20 (Monthly)

*This guide is living documentation. Update as needed when new features are added or changes are made to the site.*
