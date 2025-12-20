# 404.html Configuration Guide for wine.7pyramid.com

## Overview

Your `404.html` file is ready and includes:
- ✅ Professional error page design
- ✅ Automatic redirect to wine_list.html after 5 seconds
- ✅ Manual fallback link for users
- ✅ Correct domain: wine.7pyramid.com

However, **you must configure your web server** to serve this file when users access non-existent pages.

---

## Configuration Instructions by Server Type

### 🔹 **Apache Web Server (.htaccess)**

1. Create or edit `.htaccess` in your root directory
2. Add this line:
```apache
ErrorDocument 404 /404.html
```

**Complete `.htaccess` example:**
```apache
# Enable mod_rewrite
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
</IfModule>

# 404 Error Handler
ErrorDocument 404 /404.html

# Recommended: Redirect to HTTPS
<IfModule mod_rewrite.c>
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

3. Upload to your server's root directory
4. Test by visiting: `https://wine.7pyramid.com/nonexistent-page`

---

### 🔹 **Nginx**

1. Edit your Nginx configuration file (usually `/etc/nginx/sites-available/default`)
2. Find your `server` block and add:

```nginx
error_page 404 /404.html;

location = /404.html {
  internal;
}
```

**Complete server block example:**
```nginx
server {
    listen 80;
    server_name wine.7pyramid.com;
    root /var/www/html;  # Your document root

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wine.7pyramid.com;
    root /var/www/html;  # Your document root

    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # 404 Error Handler
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    # Index files
    index index.html wine_list.html;
}
```

3. Test configuration: `sudo nginx -t`
4. Reload: `sudo systemctl reload nginx`
5. Test by visiting: `https://wine.7pyramid.com/nonexistent-page`

---

### 🔹 **IIS (Internet Information Services) - Windows**

1. Open **IIS Manager**
2. Select your website: `wine.7pyramid.com`
3. Click **Error Pages** (double-click in Features view)
4. Right-click → **Edit Feature Settings**
5. Select **Custom error page**
6. Set it to: `/404.html`
7. Click **OK**

**Or via web.config:**

Add to your `web.config` file in root:
```xml
<system.webServer>
  <httpErrors>
    <error statusCode="404" path="/404.html" responseMode="File" />
  </httpErrors>
</system.webServer>
```

---

### 🔹 **cPanel/WHM Hosting**

1. Log in to **cPanel**
2. Go to **Addon Domains** or **File Manager**
3. Navigate to your domain's root directory
4. Create `.htaccess` (if doesn't exist)
5. Add: `ErrorDocument 404 /404.html`
6. Save and test

**Or use cPanel's Error Pages:**
1. Go to **Error Pages** tool in cPanel
2. Select your domain
3. Click **404 Not Found**
4. Set custom error page to: `/404.html`
5. Save

---

### 🔹 **Cloudflare (if using)**

If you use Cloudflare as CDN:

1. Go to **Rules** → **Page Rules**
2. Create new rule: `wine.7pyramid.com/*/` (matches all 404s)
3. Set: **Forwarding URL → 302 (Temporary Redirect)**
4. Forward to: `https://wine.7pyramid.com/wine_list.html`

Or simply let your web server handle it (methods above).

---

### 🔹 **GitHub Pages / Netlify / Vercel**

**GitHub Pages:**
- Just upload `404.html` to root
- GitHub automatically serves it for 404 errors
- No configuration needed!

**Netlify:**
1. Upload `404.html` to root
2. Create `netlify.toml` in root:
```toml
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

**Vercel:**
1. Upload `404.html` to root
2. Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/404.html" }
  ]
}
```

---

## Testing Your 404.html

After configuration, test these URLs:

✅ Should show 404 page with redirect:
- `https://wine.7pyramid.com/this-page-does-not-exist`
- `https://wine.7pyramid.com/random/nonexistent/page`
- `https://wine.7pyramid.com/wines/fake-wine.html`

✅ Should work normally:
- `https://wine.7pyramid.com/` (homepage)
- `https://wine.7pyramid.com/wine_list.html` (catalog)
- `https://wine.7pyramid.com/wines/md078-20-gcca-ch-ausone-2020.html` (wine pages)

---

## What Happens with Current 404.html

**User visits non-existent page:**
1. User types: `wine.7pyramid.com/bad-url`
2. Server shows 404.html
3. Page displays: "Oops! Page Not Found"
4. Countdown timer shows: "5 seconds"
5. After 5 seconds → Redirects to wine_list.html
6. User can click link if not auto-redirected

---

## SEO Impact

✅ **Good for SEO:**
- 404 pages with content are indexed by Google
- Proper 404 response code (not redirect)
- Redirect to relevant content (wine_list.html)
- Professional user experience

⚠️ **Important:**
- Ensure your server returns **HTTP 404** status code
- The redirect is for **user experience**, not SEO
- Google recognizes the 404 status code, not the HTML redirect

---

## Troubleshooting

**Problem:** 404.html not showing
- **Solution:** Check if `.htaccess` is in root directory or server configuration is correct
- Verify file is named exactly: `404.html`
- Check file permissions (usually 644)

**Problem:** Getting 500 error instead
- **Solution:** Check `.htaccess` syntax (use online validator)
- Verify error_document path is correct: `/404.html`
- Check if mod_rewrite is enabled (Apache)

**Problem:** Redirect not working
- **Solution:** Ensure HTTP 404 status code is being sent first
- Check if server is intercepting before reaching HTML
- Verify javascript is not blocked in browser

**Problem:** Can't test locally
- **Solution:** Use online 404 checker: https://www.broken-link-checker.com/
- Or FTP to server and check directly
- Monitor Server logs in cPanel/Hosting panel

---

## Monitoring

After deployment, monitor:

1. **Google Search Console:**
   - Coverage → Errors
   - Should see crawl error count
   - 404s for non-existent pages are normal

2. **Server Logs:**
   - Check access logs for 404 requests
   - Verify correct `404.html` is being served
   - Status code should be `404`, not `200` or `301`

3. **Browser DevTools:**
   - Visit non-existent page
   - Check Network tab
   - Should see `404` response code
   - Response should be your 404.html content

---

## Files to Upload to Server

```
✅ UPLOAD (Files in deploy/ folder):
deploy/
├── index.html
├── wine_list.html
├── 404.html ← KEY FILE
├── robots.txt
├── sitemap.xml
├── .htaccess (if using Apache)
├── css/
├── js/
├── img/
├── wines/
├── countries/
├── regions/
└── [other files]

❌ DO NOT UPLOAD (Documentation only):
- SEO_OPTIMIZATION_GUIDE.md
- DEPLOYMENT-REPORT.txt
- 404_SETUP_GUIDE.md (this file - for your reference)
```

---

## Quick Start Checklist

- [ ] Choose your server type (Apache, Nginx, etc.)
- [ ] Follow configuration steps above
- [ ] Test non-existent page URL
- [ ] Verify redirect works after 5 seconds
- [ ] Check HTTP status code is 404 (not 200 or 301)
- [ ] Monitor Google Search Console for any errors
- [ ] Test mobile version of error page

---

**Once configured, your 404.html will provide a professional error experience and keep visitors engaged by redirecting them to your wine catalog! 🍷**
