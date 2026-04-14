# Post-Deployment SEO Guide: Google Search Console & Bing Webmaster

**Last Updated:** 2026-01-16  
**Project:** Seven Pyramid Wine Website (wine.7pyramid.com)  
**Purpose:** Steps to notify search engines after deploying SEO improvements

---

## 📊 Google Search Console Tasks

### 1. Submit Updated Sitemap

**Steps:**
1. Go to: https://search.google.com/search-console
2. Select property: `wine.7pyramid.com`
3. Navigate to: **Sitemaps** (left sidebar)
4. Submit these sitemaps (if not already submitted):
   - `https://wine.7pyramid.com/sitemap.xml`
   - `https://wine.7pyramid.com/sitemap-wines-france.xml`
   - `https://wine.7pyramid.com/sitemap-main.xml`
5. Wait 5-10 minutes, then click **Refresh** to verify

---

### 2. Request Indexing for Updated Pages

**Steps:**
1. Go to: **URL Inspection** (top search bar)
2. Enter each updated page URL
3. Click **Request Indexing** for each:

**Priority URLs to Index:**
```
https://wine.7pyramid.com/regions/france-pomerol.html
https://wine.7pyramid.com/regions/france-pauillac.html
https://wine.7pyramid.com/regions/france-margaux.html
https://wine.7pyramid.com/regions/france-saint-émilion.html
https://wine.7pyramid.com/regions/france-champagne.html
https://wine.7pyramid.com/regions/france-burgundy.html
```

⚠️ **Note:** Google allows approximately 10-12 URL indexing requests per day.

---

### 3. Remove Old/Incorrect URL

**Steps:**
1. Go to: **Removals** (left sidebar)
2. Click: **New request**
3. Select: **Temporarily remove URL**
4. Enter: `https://wine.7pyramid.com/regions/usa-pomerol.html`
5. Submit removal request

**Purpose:** This removes the incorrectly classified Pomerol page (was listed under USA instead of France) from Google search results.

---

### 4. Monitor Indexing Status (Week 1-2)

**Steps:**
1. Navigate to: **Coverage** report (left sidebar)
2. Look for: "Valid" pages count increasing
3. Watch for: Any errors or warnings
4. Check: **Enhancements** for structured data validation

**Timeline:** Full indexing typically takes 3-7 days.

---

## 🔍 Bing Webmaster Tools Tasks

### 1. Submit Updated Sitemap

**Steps:**
1. Go to: https://www.bing.com/webmasters
2. Select: `wine.7pyramid.com`
3. Navigate to: **Sitemaps** (left menu)
4. Submit sitemap URL: `https://wine.7pyramid.com/sitemap.xml`
5. Click **Submit**

---

### 2. Request URL Indexing

**Steps:**
1. Go to: **URL Submission** (left menu)
2. Enter URLs one by one and click **Submit**:

**Priority URLs:**
```
https://wine.7pyramid.com/regions/france-pomerol.html
https://wine.7pyramid.com/regions/france-pauillac.html
https://wine.7pyramid.com/regions/france-margaux.html
https://wine.7pyramid.com/regions/france-saint-émilion.html
https://wine.7pyramid.com/regions/france-champagne.html
https://wine.7pyramid.com/regions/france-burgundy.html
```

⚠️ **Note:** Bing allows more URL submissions than Google (typically 10,000/month).

---

### 3. Block/Remove Old URL

**Steps:**
1. Go to: **Block URLs** (left menu)
2. Enter: `/regions/usa-pomerol.html`
3. Select: **Block this URL and remove from search results**
4. Submit

---

### 4. Verify robots.txt

**Steps:**
1. Go to: **Crawl Control** > **robots.txt Tester**
2. URL: `https://wine.7pyramid.com/robots.txt`
3. Click **Test**
4. Verify: AI crawlers are allowed (GPTBot, ChatGPT-User, Google-Extended, ClaudeBot, anthropic-ai)

---

## 🤖 AI Crawler Optimization (GEO - Generative Engine Optimization)

### 1. Check robots.txt is Live

**Verification:**
1. Visit: https://wine.7pyramid.com/robots.txt
2. Verify these lines exist:

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /
```

**Purpose:** These directives allow AI systems (ChatGPT, Gemini, Claude) to crawl and index your content for Generative Engine Optimization.

---

### 2. Test AI Crawling (Optional)

**Steps:**
1. Use ChatGPT with browsing enabled (ChatGPT Plus)
2. Ask: "Browse wine.7pyramid.com/regions/france-pauillac.html and tell me what wines they have"
3. Verify: ChatGPT can access and accurately read your content

**Expected Result:** ChatGPT should be able to:
- Read wine names and vintages
- Understand region descriptions
- Extract pricing information
- Identify Seven Pyramid services

---

## 📈 Monitoring & Analytics (Ongoing)

### Week 1: Initial Indexing

**Daily Tasks:**
- ✓ Check Google Search Console daily
- ✓ Verify pages appear in **Coverage** report
- ✓ Monitor for any crawl errors
- ✓ Check **URL Inspection** status for submitted URLs

---

### Week 2-4: Ranking Improvements

**Weekly Tasks:**
- ✓ Search for target keywords: 
  - "Pauillac 波亞克 台北"
  - "Lafite 拉菲 現貨 台灣"
  - "七銘企業 葡萄酒"
- ✓ Check: **Performance** report in Search Console
- ✓ Monitor: Click-through rates (CTR) and impressions
- ✓ Track: Position changes for key pages

---

### Month 2-3: AI Visibility (GEO Results)

**Monthly Tasks:**
- ✓ Test searches in AI systems:
  - ChatGPT: "台北哪裡買 Lafite 拉菲現貨"
  - Google Gemini: "推薦台灣進口波爾多紅酒商"
  - Perplexity AI: "Seven Pyramid wine Taiwan"
- ✓ Verify: Seven Pyramid appears in AI responses
- ✓ Check: AI provides accurate information (pricing, stock, contact)

---

## 🎯 Quick Checklist

### Google Search Console
- [ ] Submit sitemap.xml
- [ ] Request indexing for 6 updated region pages
- [ ] Remove usa-pomerol.html from index
- [ ] Monitor Coverage report daily (Week 1)
- [ ] Check Performance report weekly (Week 2-4)

### Bing Webmaster
- [ ] Submit sitemap.xml
- [ ] Submit 6 updated URLs for indexing
- [ ] Block usa-pomerol.html
- [ ] Verify robots.txt allows AI crawlers

### Verification
- [ ] Test updated pages are live on server
- [ ] Check robots.txt is accessible
- [ ] Verify meta descriptions show correctly in page source
- [ ] Test pages on mobile devices
- [ ] Validate structured data with Schema.org validator

### Timeline
- [ ] **Day 1:** Submit all sitemaps and URL requests
- [ ] **Day 3-7:** Check indexing status
- [ ] **Week 2:** Monitor search performance
- [ ] **Month 1:** Evaluate ranking improvements
- [ ] **Month 2-3:** Test AI visibility

---

## 💡 Pro Tips & Testing Tools

### 1. Structured Data Testing
- **Tool:** https://validator.schema.org/
- **Test:** Your region pages have valid JSON-LD schema
- **Verify:** "CollectionPage" schema is recognized correctly

### 2. Mobile-Friendly Test
- **Tool:** https://search.google.com/test/mobile-friendly
- **Test:** All updated region pages
- **Ensure:** Responsive design works correctly
- **Target:** 100% mobile-friendly score

### 3. Page Speed Insights
- **Tool:** https://pagespeed.web.dev/
- **Test:** france-pauillac.html, france-pomerol.html, index.html
- **Aim for:** 90+ score on mobile
- **Focus areas:** Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS)

### 4. Rich Results Test
- **Tool:** https://search.google.com/test/rich-results
- **Test:** Updated region pages
- **Verify:** Product schema is valid (if applicable)
- **Check:** LocalBusiness schema on index.html

---

## ❓ Troubleshooting

### Q: How long until I see results?

**Answer:**
- **Google Indexing:** 3-7 days for pages to appear in index
- **Google Ranking:** 2-4 weeks for ranking improvements
- **Bing Indexing:** 7-14 days for pages to appear in index
- **Bing Ranking:** 4-6 weeks for ranking improvements
- **AI Visibility:** 4-8 weeks for consistent AI recommendations

---

### Q: What if pages don't index?

**Troubleshooting Steps:**
1. **Check robots.txt:** Ensure it's not blocking search engines
   - Visit: https://wine.7pyramid.com/robots.txt
   - Verify no `Disallow: /` for Googlebot or Bingbot

2. **Verify sitemap validity:**
   - Check XML format is valid
   - Ensure URLs are absolute (not relative)
   - Verify sitemap is accessible

3. **Use URL Inspection tool:**
   - Check for specific errors (4xx, 5xx status codes)
   - Look for "Crawled - currently not indexed" status
   - Review any reported issues

4. **Check server status:**
   - Verify pages return 200 status (not 404/500)
   - Test with: `curl -I https://wine.7pyramid.com/regions/france-pauillac.html`

---

### Q: How to track AI crawler visits?

**Answer:**
Check your server access logs (or web hosting control panel logs) for these user-agents:

```
"GPTBot"              # OpenAI training crawler
"ChatGPT-User"        # ChatGPT real-time browsing
"Google-Extended"     # Google Gemini & Vertex AI
"ClaudeBot"           # Anthropic Claude crawler
"anthropic-ai"        # Anthropic AI systems
```

**Log Analysis Example:**
```bash
grep "GPTBot" /var/log/apache2/access.log
grep "ChatGPT-User" /var/log/apache2/access.log
```

---

### Q: Meta descriptions not showing in search results?

**Troubleshooting:**
1. Wait 7-14 days for Google to re-crawl and update
2. Check character length (ideal: 150-160 characters)
3. Verify no duplicate meta descriptions across pages
4. Use URL Inspection tool to see what Google sees
5. Request re-indexing if needed

---

### Q: Schema markup not recognized?

**Troubleshooting:**
1. Validate with https://validator.schema.org/
2. Check JSON-LD syntax for errors (missing commas, brackets)
3. Ensure schema is in `<head>` section
4. Use Rich Results Test to see what Google extracts
5. Verify @context is "https://schema.org" (not http)

---

## 📊 Expected Results Timeline

### Week 1: Indexing Phase
- Google: 3-7 days
- Bing: 7-14 days
- Status: Pages appear in search console coverage reports

### Week 2-4: Early Rankings
- Target keywords start appearing in search results
- Position: Typically 20-50 initially
- Impressions increase in Performance report

### Month 2-3: Ranking Stabilization
- Organic traffic increases by 15-30%
- CTR improves as meta descriptions are recognized
- Position: Target keywords move to 10-30 range

### Month 3-6: AI Visibility
- ChatGPT, Gemini start recommending Seven Pyramid
- Featured in AI search results for wine queries
- Brand mentions increase in AI-generated content

---

## 🚀 Next Steps After Initial Setup

### Content Expansion (Optional)
Consider applying the same SEO improvements to other region pages:
- `france-bordeaux.html`
- `france-haut-médoc.html`
- `france-pessac-léognan.html`
- `france-saint-estèphe.html`
- Other country regions (Australia, Chile, USA, Argentina, Spain)

### Schema Enhancements (Future)
- Add Product schema for individual wine pages
- Implement Offer schema with price and availability
- Add Review/Rating schema if customer reviews exist
- Enhance LocalBusiness schema with opening hours

### Content Marketing
- Create blog posts about wine regions
- Add Q&A section for common wine questions (GEO-friendly)
- Develop wine pairing guides
- Create vintage reports and tasting notes

---

## 📞 Support & Resources

### Official Documentation
- **Google Search Console Help:** https://support.google.com/webmasters
- **Bing Webmaster Help:** https://www.bing.com/webmasters/help
- **Schema.org Documentation:** https://schema.org/docs/schemas.html
- **Google AI Crawlers:** https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers

### SEO Community Resources
- **Google Search Central Blog:** https://developers.google.com/search/blog
- **Bing Webmaster Blog:** https://blogs.bing.com/webmaster
- **Schema Markup Validator:** https://validator.schema.org/

---

## 📝 Change Log

### 2026-01-16: Initial SEO Improvements
- ✅ Fixed critical classification error (deleted usa-pomerol.html)
- ✅ Updated 6 major French region pages with SEO content
- ✅ Optimized title tags with specific wine estates
- ✅ Enhanced meta descriptions with marketing language
- ✅ Added 200-300 word region introductions
- ✅ Improved Schema markup with Chinese descriptions
- ✅ Enabled AI crawler access in robots.txt

**Files Updated:**
- `regions/france-pomerol.html`
- `regions/france-pauillac.html`
- `regions/france-margaux.html`
- `regions/france-saint-émilion.html`
- `regions/france-champagne.html`
- `regions/france-burgundy.html`

**Files Deleted:**
- `regions/usa-pomerol.html` (incorrect classification)

---

## ✅ Success Metrics

Track these KPIs to measure SEO success:

### Search Engine Performance
- **Organic Traffic:** Increase by 30%+ within 3 months
- **Indexed Pages:** All 6 updated pages fully indexed
- **Average Position:** Top 20 for target keywords
- **Click-Through Rate:** 3-5% improvement

### AI Visibility (GEO)
- **AI Mentions:** Seven Pyramid mentioned in 50%+ of relevant AI queries
- **Accuracy:** AI provides correct contact info and services
- **Brand Recognition:** "七銘企業" recognized by ChatGPT, Gemini, Claude

### User Engagement
- **Bounce Rate:** Decrease by 10-15%
- **Time on Page:** Increase by 20-30 seconds
- **Pages per Session:** Increase by 0.5-1 page

---

**Document End**
