# Seven Pyramid Wine Website - Deployment Guide
## 🚀 What Files to Upload to Your Web Server

node prepare-deployment.j

### 📋 Essential Files for Production

#### ✅ **Core HTML Files** (Required)
```
index.html                    # Main landing page
wine_list.html               # Wine catalog page
404.html                     # Error page
```

#### ✅ **Assets Folders** (Required)
```
css/                         # All stylesheets
├── style.css               # Main CSS
├── light.css              # Light theme
└── dark.css               # Dark theme

js/                         # JavaScript files
├── app.js                 # Theme switching
└── csp-fix.js            # CSP-compliant interactions

img/                       # All images
├── 7pyramidlogo.jpg      # Company logo
├── SPbackground1.png     # Background image
├── australia_wine_map.png # Wine region maps
├── french_wine_map.png
├── chile_wine_map.png
├── spain_wine_map.png
├── argentina_wine_map.png
├── us_wine_map.png
└── (all other images)
```

#### ✅ **SEO & PWA Files** (Required)
```
robots.txt                  # Search engine instructions
sitemap.xml                # SEO sitemap
site.webmanifest           # Progressive Web App manifest
favicon.ico                # Website icon
icon.png                   # PWA icons
icon.svg                   # Vector icon
```

#### ❌ **DO NOT Upload** (Keep Local Only)
```
node_modules/              # Dependencies (huge folder)
backups/                   # Auto-generated backups
backups-csp/              # CSP fix backups
generated/                 # Build output (if using generator)
*.log                     # Log files
.DS_Store                 # macOS system files
.git/                     # Git repository
.idea/                    # IDE settings
*.md                      # Documentation files
package.json              # Node.js config
package-lock.json         # Lock file
build-wine-catalog.js     # Build scripts
validate-wine-data.js     # Development tools
update-wine-prices.js     # Price update tools
fix-csp-violations.js     # Development tools
wine-stats.js            # Analytics tools
wines-data-template.json  # Source data
webpack.*.js             # Webpack config
```

---

## 🗂️ **Server Directory Structure**

Upload files to your web server's public directory (usually `public_html/`, `www/`, or `htdocs/`):

```
your-domain.com/
├── index.html
├── wine_list.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
├── icon.png
├── icon.svg
├── css/
│   ├── style.css
│   ├── light.css
│   └── dark.css
├── js/
│   ├── app.js
│   └── csp-fix.js
└── img/
    ├── 7pyramidlogo.jpg
    ├── SPbackground1.png
    ├── australia_wine_map.png
    ├── french_wine_map.png
    ├── chile_wine_map.png
    ├── spain_wine_map.png
    ├── argentina_wine_map.png
    ├── us_wine_map.png
    └── (all other images)
```

---

## 📤 **Deployment Methods**

### Method 1: FTP/SFTP Upload
```bash
# Using FileZilla, WinSCP, or similar FTP client
# Upload these files and folders to your web root:

Local Folder → Server Path
├── index.html → /public_html/index.html
├── wine_list.html → /public_html/wine_list.html
├── 404.html → /public_html/404.html
├── css/ → /public_html/css/
├── js/ → /public_html/js/
├── img/ → /public_html/img/
├── robots.txt → /public_html/robots.txt
├── sitemap.xml → /public_html/sitemap.xml
├── site.webmanifest → /public_html/site.webmanifest
├── favicon.ico → /public_html/favicon.ico
├── icon.png → /public_html/icon.png
└── icon.svg → /public_html/icon.svg
```

### Method 2: Command Line (SSH/SCP)
```bash
# Connect to your server
ssh username@your-server.com

# Upload files using scp (from your local machine)
scp -r css/ js/ img/ username@your-server.com:/path/to/public_html/
scp index.html wine_list.html 404.html username@your-server.com:/path/to/public_html/
scp robots.txt sitemap.xml site.webmanifest favicon.ico icon.* username@your-server.com:/path/to/public_html/
```

### Method 3: Automated Script
Create a deployment script:

```bash
#!/bin/bash
# deploy.sh - Seven Pyramid Wine Website Deployment

echo "🍷 Deploying Seven Pyramid Wine Website..."

# Configuration (update these)
SERVER="your-server.com"
USERNAME="your-username"
REMOTE_PATH="/public_html/"

# Files to upload
echo "📤 Uploading HTML files..."
scp index.html wine_list.html 404.html $USERNAME@$SERVER:$REMOTE_PATH

echo "📤 Uploading CSS files..."
scp -r css/ $USERNAME@$SERVER:$REMOTE_PATH

echo "📤 Uploading JavaScript files..."
scp -r js/ $USERNAME@$SERVER:$REMOTE_PATH

echo "📤 Uploading images..."
scp -r img/ $USERNAME@$SERVER:$REMOTE_PATH

echo "📤 Uploading SEO files..."
scp robots.txt sitemap.xml site.webmanifest favicon.ico icon.png icon.svg $USERNAME@$SERVER:$REMOTE_PATH

echo "✅ Deployment completed!"
echo "🌐 Visit: https://your-domain.com"
```

---

## 🔧 **Server Configuration (Optional)**

### Apache (.htaccess)
Create this file in your web root for better performance and security:

```apache
# Seven Pyramid Wine Website - Apache Configuration

# Security Headers
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy strict-origin-when-cross-origin

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Custom Error Pages
ErrorDocument 404 /404.html

# Redirect non-www to www (optional)
# RewriteEngine On
# RewriteCond %{HTTP_HOST} ^example\.com [NC]
# RewriteRule ^(.*)$ https://www.example.com/$1 [L,R=301]
```

### Nginx Configuration
If using Nginx, add to your server block:

```nginx
# Seven Pyramid Wine Website - Nginx Configuration

# Security headers
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

# Cache control
location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Gzip compression
gzip on;
gzip_types text/css application/javascript text/plain application/xml;

# Custom error page
error_page 404 /404.html;
```

---

## ✅ **Deployment Checklist**

### Pre-Deployment
- [ ] Test website locally (`npm run serve`)
- [ ] Validate all links work
- [ ] Check mobile responsiveness
- [ ] Verify all images load
- [ ] Test theme switching
- [ ] Run CSP check (`npm run csp-check`)

### Upload Process
- [ ] Upload HTML files (index.html, wine_list.html, 404.html)
- [ ] Upload css/ folder completely
- [ ] Upload js/ folder completely
- [ ] Upload img/ folder completely
- [ ] Upload SEO files (robots.txt, sitemap.xml, site.webmanifest)
- [ ] Upload icons (favicon.ico, icon.png, icon.svg)
- [ ] Set correct file permissions (usually 644 for files, 755 for folders)

### Post-Deployment Testing
- [ ] Visit your website URL
- [ ] Test main navigation
- [ ] Check wine catalog page
- [ ] Verify mobile view
- [ ] Test theme switching
- [ ] Check all images load
- [ ] Verify contact information displays
- [ ] Test 404 page (visit non-existent URL)

### SEO Verification
- [ ] Submit sitemap to Google Search Console
- [ ] Verify robots.txt accessible: `your-domain.com/robots.txt`
- [ ] Check sitemap accessible: `your-domain.com/sitemap.xml`
- [ ] Test PWA manifest: `your-domain.com/site.webmanifest`

---

## 📊 **File Size Reference**

Typical file sizes for upload planning:

```
HTML Files:           ~100KB total
CSS Files:            ~50KB total
JavaScript Files:     ~30KB total
Images:              ~5-50MB (depending on wine images)
Total Upload Size:    ~5-50MB
```

---

## 🔄 **Future Updates**

### When Updating Wine Prices:
1. Update `wines-data-template.json` locally
2. Run `npm run build:wine` (if using generator)
3. Upload only `wine_list.html` to server

### When Adding New Wines:
1. Update local JSON data
2. Add new wine images to `img/` folder
3. Rebuild and upload affected HTML files
4. Upload new images only

### When Making Design Changes:
1. Test locally first
2. Upload modified CSS/JS files
3. Clear browser cache to see changes

---

## 🆘 **Troubleshooting**

### Website Not Loading
- Check file permissions (644 for files, 755 for folders)
- Verify index.html is in web root
- Check server error logs

### Images Not Showing
- Verify img/ folder uploaded completely
- Check image file paths in HTML
- Ensure case-sensitive filenames match

### CSS/JS Not Working
- Clear browser cache
- Check file paths in HTML
- Verify css/ and js/ folders uploaded

### Theme Switching Broken
- Ensure both app.js and csp-fix.js uploaded
- Check browser console for JavaScript errors
- Verify CSP headers not blocking scripts

---

**🍷 Ready to deploy your Seven Pyramid wine website!**

*Remember: Always test locally before deploying, and keep backups of your server files.*
