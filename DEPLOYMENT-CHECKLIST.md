# Deployment Checklist & SEO/AEO Compliance

This document tracks alignment between `prepare-deployment.js` and the SEO/AEO requirements from `googleSearchConsole/google_search.md`.

---

## ✅ COMPLETED: Updated `prepare-deployment.js`

### What was fixed:

1. **Added Generated Files Support**
   - Now copies `wine_list.html` from `./generated/` instead of root
   - Now copies `sitemap.xml` from `./generated/` (latest version)
   - Files in `./generated/` are production-optimized for SEO

2. **Added Generated Folder Deployment**
   - `./generated/countries/` → `deploy/countries/` (9 country pages)
   - `./generated/regions/` → `deploy/regions/` (38+ region pages)
   - `./generated/wines/` → `deploy/wines/` (2000+ individual wine pages)
   - These are **critical for search engine crawling** as per google_search.md

3. **Updated Deployment Report**
   - Clearly labels generated files as SEO-optimized
   - Explains wine catalog folders are for search engine crawling
   - Better documentation for deployment process

---

## ⚠️ ISSUES STILL NEEDING RESOLUTION

### Issue #1: Missing Product Schema in Wine Pages
**Status:** ❌ NOT YET IMPLEMENTED

According to `googleSearchConsole/google_search.md`:
> "Modify `build-wine-catalog.js` to inject `JSON-LD` Product schema for *every* wine row."

**Current State:**
- `wine_list.html`: Has 1 LocalBusiness schema, **0 Product schemas** ❌
- Individual wine pages in `generated/wines/`: **0 Product schemas** ❌
- Individual region pages in `generated/regions/`: Checking...

**Why This Matters:**
- AI search engines (Gemini, ChatGPT) read Product schemas directly to answer questions like "How much is Chateau Example in Taiwan?"
- Improves answer engine optimization (AEO)
- Helps Google understand product details better

**Action Required:**
Modify `build-wine-catalog.js` to add JSON-LD Product schemas. Example:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Chateau Example 2018",
  "description": "French Red Wine from Bordeaux...",
  "sku": "WINE-001",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "TWD",
    "price": "1200",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### Issue #2: wine_list.html Missing Product Schema For Each Wine
**Status:** ❌ NOT YET IMPLEMENTED

The wine_list.html table currently shows wine details but doesn't have structured data for each row.

**Recommendation from google_search.md:**
Add one Product schema per wine in the table for better AI engine understanding.

---

## 📋 Deployment Workflow (Updated)

### Before Deployment:
```bash
# 1. Generate wine catalog
npm run build:wine

# 2. Validate data
npm run validate

# 3. Generate sitemap
npm run generate-sitemap

# 4. Prepare deployment (now includes generated folders!)
npm run prepare-deploy

# 5. Test locally
npm run serve
# Visit http://localhost:8080 to verify:
# - wine_list.html loads with table
# - countries/*.html pages are accessible
# - regions/*.html pages are accessible
# - wines/*.html pages are accessible
# - sitemap.xml is up-to-date
```

### Upload to Server:
```bash
# Option 1: FTP/SFTP
# Upload entire contents of deploy/ to web root

# Option 2: SSH
scp -r deploy/* username@server:/path/to/webroot/
```

---

## 📁 Current Deployment Structure

```
deploy/
├── index.html                    # Main landing page
├── wine_list.html               # SEO wine catalog (from generated/)
├── 404.html                     # Error page
├── robots.txt                   # SEO instructions
├── sitemap.xml                  # SEO sitemap (from generated/)
├── site.webmanifest             # PWA manifest
├── favicon.ico, icon.png, icon.svg
│
├── css/                         # All stylesheets
├── js/                          # All JavaScript
├── img/                         # All images and maps
│
├── countries/                   # 9 country pages (NEW)
│   ├── france.html
│   ├── australia.html
│   ├── chile.html
│   └── ... (6 more)
│
├── regions/                     # 38+ region pages (NEW)
│   ├── france-bordeaux.html
│   ├── france-burgundy.html
│   ├── australia-barossa.html
│   └── ... (35+ more)
│
└── wines/                       # 2000+ wine product pages (NEW)
    ├── wine-001-chateau-example.html
    ├── wine-002-domaine-example.html
    └── ... (2000+ wine pages)
```

---

## 🎯 SEO/AEO Compliance Checklist

### ✅ Completed:
- [x] Static wine_list.html generated for SEO crawling
- [x] Sitemap.xml generated and included in deployment
- [x] Country pages generated for regional SEO
- [x] Region pages generated for detailed discovery
- [x] Individual wine pages generated and crawlable
- [x] LocalBusiness schema on main pages
- [x] Proper linking structure (static → Flutter)
- [x] prepare-deployment.js copies all generated files
- [x] Geographic targeting meta tags present

### ❌ Still TODO (per google_search.md):
- [ ] Add Product schema to wine_list.html (one per wine)
- [ ] Add Product schema to individual wine pages
- [ ] Add Product schema to region pages
- [ ] Add FAQ schema to index.html
- [ ] Ensure alt text includes "Country + Region + Wine Name"
- [ ] Verify Material Design 3 accessibility (WCAG AA)
- [ ] Test mobile usability in Google Search Console
- [ ] Deep linking from wine_list.html to Flutter app working

---

## 🔍 Testing Before Deployment

1. **Local Testing:**
   ```bash
   npm run serve
   # Visit http://localhost:8080/wine_list.html
   # Check that all wine rows render correctly
   # Check countries/, regions/, wines/ folders accessible
   ```

2. **Sitemap Validation:**
   - Verify generated/sitemap.xml includes:
     - /wine_list.html
     - /countries/*.html (9 pages)
     - /regions/*.html (38+ pages)
     - /wines/*.html (2000+ pages)

3. **Links Check:**
   - wine_list.html → countries/*.html ✅
   - wine_list.html → wines/*.html ✅
   - Index.html → wine_list.html (check for Flutter deep links)

4. **Search Console:**
   - Submit sitemap.xml
   - Check Mobile Usability report for wine_list.html
   - Monitor crawl stats for countries/, regions/, wines/

---

## 📊 File Statistics

- **Generated files:** ~2,100 HTML pages
- **Total wine records:** 2000+
- **Deployment folder size:** ~150-200MB (with images)
- **Countries:** 9
- **Regions:** 38+
- **Average wine page:** ~15-20KB
- **Sitemap entries:** ~2,100

---

## 🚀 Next Steps

1. **Immediate:** Test updated `prepare-deployment.js`
   ```bash
   npm run prepare-deploy
   # Verify deploy/ folder has countries/, regions/, wines/ folders
   ```

2. **Short-term:** Implement Product schemas in build-wine-catalog.js
   - Add JSON-LD to wine_list.html rows
   - Add JSON-LD to individual wine pages
   - Update region pages with aggregate schemas

3. **Quality Assurance:**
   - Run `npm run csp-check` for CSP violations
   - Test deep linking to Flutter app
   - Verify accessibility standards (WCAG AA)

---

## 📚 References

- `googleSearchConsole/google_search.md` - SEO/AEO Strategy
- `prepare-deployment.js` - Updated deployment script
- `build-wine-catalog.js` - Wine catalog generator (needs Product schema update)
- `CLAUDE.md` - Project architecture

---

**Last Updated:** 2025-12-19
**Version:** 1.1 (Updated for generated folder support)
