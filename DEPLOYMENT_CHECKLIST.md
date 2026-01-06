# 📦 Deployment Checklist for wine.7pyramid.com

## What to Upload vs. What to Keep Locally

### ✅ UPLOAD TO SERVER (Content of `deploy/` folder)

**Essential Files:**
- [x] `index.html` - Homepage
- [x] `wine_list.html` - Wine catalog with promotion
- [x] `404.html` - Error page
- [x] `robots.txt` - SEO crawling instructions
- [x] `sitemap.xml` - Search engine sitemap (232 pages)

**Directories:**
- [x] `css/` - Stylesheets (light.css, dark.css, style.css, variables.css)
- [x] `js/` - JavaScript files (app.js, wine.js, csp-fix.js)
- [x] `img/` - Images and wine region maps
- [x] `wines/` - 213 individual wine detail pages
- [x] `countries/` - Country overview pages
- [x] `regions/` - Wine region pages

**Additional Files:**
- [x] `favicon.ico` - Browser tab icon
- [x] `icon.png` - Icon asset
- [x] `icon.svg` - SVG icon
- [x] `site.webmanifest` - PWA manifest

---

### ❌ DO NOT UPLOAD (Local Reference Only)

**Documentation/Reference (Keep locally):**
- ❌ `SEO_OPTIMIZATION_GUIDE.md` - For your local reference
- ❌ `DEPLOYMENT-REPORT.txt` - Deployment notes
- ❌ `404_SETUP_GUIDE.md` - Configuration instructions
- ❌ `SALES_SCRIPT.md` - Phone sales guidelines
- ❌ `CLAUDE.md` - Project instructions
- ❌ `README*.md` - Various README files

**Development Files (Not needed on server):**
- ❌ `.git/` - Git repository
- ❌ `.github/` - GitHub workflows
- ❌ `.claude/` - Claude IDE config
- ❌ `.specify/` - Specification files
- ❌ `.vscode/` - IDE settings
- ❌ `node_modules/` - NPM dependencies
- ❌ `package.json` - NPM config
- ❌ `package-lock.json` - NPM lock file
- ❌ Build scripts - `build-wine-catalog.js`, etc.
- ❌ Config files - `webpack.*.js`, etc.

**Data Files (Not needed):**
- ❌ `wines-data-template.json` - Source data
- ❌ `sevenStock_final.json` - Data source
- ❌ `*_wine_info.json` - Enrichment data

---

## Pre-Deployment Verification

### 1. Verify Deploy Folder Contents

```bash
# Check if all necessary files exist
ls -la deploy/

# Should see:
# - index.html ✓
# - wine_list.html ✓
# - 404.html ✓
# - robots.txt ✓
# - sitemap.xml ✓
# - css/ js/ img/ wines/ countries/ regions/ ✓
```

### 2. Verify URLs are Correct

```bash
# All URLs should reference wine.7pyramid.com
grep -r "wine.7pyramid.com" deploy/ | wc -l

# Critical files to check:
grep "wine.7pyramid.com" deploy/robots.txt       # Sitemap URL
grep "wine.7pyramid.com" deploy/index.html        # Canonical & og: tags
grep "wine.7pyramid.com" deploy/wine_list.html    # Canonical URL
grep "wine.7pyramid.com" deploy/sitemap.xml | head -3  # Sample URLs
```

### 3. Count Pages

```bash
# Should have:
# - 232 pages total in sitemap
# - 213 wine pages in wines/
# - 3+ country pages in countries/
# - Multiple region pages in regions/

grep -c "<url>" deploy/sitemap.xml          # Should be 232
ls deploy/wines/*.html | wc -l              # Should be 213
ls deploy/countries/*.html | wc -l          # Should be 3+
```

### 4. Verify 404.html

```bash
# Check 404.html exists and has correct redirect
grep "wine.7pyramid.com" deploy/404.html    # Should see wine.7pyramid.com
head -20 deploy/404.html                    # Should have correct structure
```

---

## Deployment Steps

### Step 1: Connect to Your Server

**Option A: FTP/SFTP**
```
Host: wine.7pyramid.com (or your hosting provider)
Username: Your FTP username
Password: Your FTP password
Port: 21 (FTP) or 22 (SFTP)
```

**Option B: SSH/Command Line**
```bash
ssh user@wine.7pyramid.com
cd /var/www/html  # or your document root
```

**Option C: cPanel File Manager**
- Log into cPanel
- Go to File Manager
- Navigate to public_html or your domain folder

### Step 2: Backup Existing Files

```bash
# Before uploading, backup current live files
cp -r /var/www/html /var/www/html.backup.$(date +%Y%m%d)
```

### Step 3: Upload Deploy Folder

**Using FTP/SFTP:**
1. Connect to server
2. Navigate to document root (usually `public_html/` or `/var/www/html`)
3. Upload all files from local `deploy/` folder
4. Maintain directory structure (css/, js/, img/, wines/, etc.)

**Using SSH:**
```bash
# From your local machine
scp -r deploy/* user@wine.7pyramid.com:/var/www/html/

# Or use rsync for faster incremental uploads
rsync -avz deploy/* user@wine.7pyramid.com:/var/www/html/
```

### Step 4: Set File Permissions

```bash
# SSH into server and run:
cd /var/www/html

# Set correct permissions
chmod 755 .                          # Directory: 755
chmod 644 *.html *.xml *.txt         # Files: 644
chmod 755 css/ js/ img/ wines/ countries/ regions/

# If using Apache with .htaccess
chmod 644 .htaccess
```

### Step 5: Configure 404.html

**Choose your method based on server type:**

**Apache (.htaccess):**
```apache
# Add to .htaccess in root
ErrorDocument 404 /404.html
```

**Nginx (config file):**
```nginx
error_page 404 /404.html;
location = /404.html {
    internal;
}
```

**See `404_SETUP_GUIDE.md` for detailed instructions.**

### Step 6: Clear Cache (if applicable)

If using caching:
```bash
# Clear Cloudflare cache
# Log into Cloudflare dashboard → Purge Cache → Purge Everything

# Or from server, if using local caching
rm -rf /var/www/html/cache/*
```

### Step 7: Verify Deployment

#### Test Basic Pages:
- [ ] `https://wine.7pyramid.com/` - Should load homepage
- [ ] `https://wine.7pyramid.com/wine_list.html` - Should load catalog
- [ ] `https://wine.7pyramid.com/wines/md078-20-gcca-ch-ausone-2020.html` - Sample wine page

#### Test 404 Error Handling:
- [ ] `https://wine.7pyramid.com/nonexistent` - Should show 404.html
- [ ] Page should redirect after 5 seconds
- [ ] Check DevTools: Response code should be 404

#### Test SSL/HTTPS:
- [ ] All pages load over HTTPS (not HTTP)
- [ ] No mixed content warnings
- [ ] SSL certificate is valid

#### Test Responsiveness:
- [ ] [ ] Homepage - Desktop, Tablet, Mobile
- [ ] [ ] Wine Catalog - Desktop, Tablet, Mobile
- [ ] [ ] Wine Detail Pages - Desktop, Tablet, Mobile

### Step 8: Monitor After Deployment

#### Google Search Console:
1. Go to https://search.google.com/search-console
2. Select property: `wine.7pyramid.com`
3. Check "Coverage" report:
   - Should see 232 pages indexed (or in queue)
   - No errors should be reported
4. Request indexing for updated pages
5. Submit sitemap (if not already done)

#### Check Server Logs:
```bash
# Monitor access logs for 404 requests
tail -f /var/log/apache2/access.log

# Check error logs
tail -f /var/log/apache2/error.log
```

#### Monitor Performance:
- [ ] Run PageSpeed Insights: https://pagespeed.web.dev/
- [ ] Check Core Web Vitals
- [ ] Monitor mobile performance
- [ ] Test page load times

---

## Post-Deployment Checklist

- [ ] All pages load correctly (no 404s or errors)
- [ ] 404.html redirects properly when accessing non-existent pages
- [ ] robots.txt is accessible: `wine.7pyramid.com/robots.txt`
- [ ] sitemap.xml is accessible: `wine.7pyramid.com/sitemap.xml`
- [ ] HTTPS/SSL working on all pages
- [ ] No mixed content warnings
- [ ] Mobile pages load correctly
- [ ] Google Search Console shows pages in index
- [ ] No crawl errors in GSC
- [ ] FAQ schema appears in Google Rich Results tester
- [ ] LocalBusiness schema shows in Rich Results tester
- [ ] Promotion message visible on wine detail pages
- [ ] Wine catalog banner visible on wine_list.html

---

## Rollback Plan

If something goes wrong:

```bash
# Restore from backup
cp -r /var/www/html.backup.YYYYMMDD/* /var/www/html/

# Or reupload previous version
# Keep backups for at least 30 days
```

---

## Important Reminders

✅ **DO:**
- Upload only files from `deploy/` folder
- Test after deployment
- Monitor Google Search Console
- Keep local copies of documentation
- Maintain regular backups

❌ **DON'T:**
- Upload node_modules or .git folders
- Upload .env or config files with secrets
- Upload documentation markdown files
- Delete backups immediately
- Skip 404.html configuration

---

## Support Resources

**If you need help:**
- See `404_SETUP_GUIDE.md` for 404.html configuration
- See `SEO_OPTIMIZATION_GUIDE.md` for SEO details
- See `SALES_SCRIPT.md` for phone sales guidance
- Contact your hosting provider for server configuration

---

**Status: Ready for Production Deployment ✅**

All files are optimized, URLs are correct, and SEO is configured. You're ready to upload!
