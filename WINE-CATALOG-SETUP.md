# Seven Pyramid Wine Catalog Management System
## Complete Setup and Usage Guide

### 🍷 Overview
A comprehensive wine catalog management system designed for Seven Pyramid (七銘企業) to handle 2000+ wine records with SEO optimization, periodic price updates, and static site generation.

---

## 📋 System Features

### ✅ Core Features
- **Static Site Generation**: Pre-rendered HTML for optimal SEO
- **Individual Wine Pages**: Each wine gets its own optimized URL
- **Dynamic Price Updates**: CSV-based bulk price management
- **Data Validation**: Built-in quality checks and analytics
- **Multi-language Support**: Traditional Chinese and English
- **Mobile Responsive**: Works on all devices
- **Rich Schema Markup**: Google-friendly structured data

### ✅ SEO Optimizations
- Individual wine pages with unique URLs
- Rich product schema markup
- Optimized meta tags and descriptions
- XML sitemap generation
- Breadcrumb navigation
- Internal linking structure
- Page load speed optimization

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```bash
# Navigate to your project directory
cd /path/to/seven_pyramid

# Install Node.js packages
npm install
```

### Step 2: Prepare Wine Data
```bash
# Create sample wine data (if needed)
cp wines-data-template.json wines-data.json

# Validate your wine data
npm run validate
```

### Step 3: Generate Wine Catalog
```bash
# Build the complete wine catalog
npm run build:wine

# This creates:
# - generated/wine_list.html (main catalog)
# - generated/wines/*.html (individual wine pages)
# - generated/countries/*.html (country pages)
# - generated/regions/*.html (region pages)
# - generated/sitemap.xml (search engine sitemap)
```

### Step 4: Preview Locally
```bash
# Start local development server
npm run serve

# Open browser to: http://localhost:8080
```

### Step 5: Deploy to Production
```bash
# Copy assets and deploy
npm run deploy

# Upload 'generated' folder contents to your web server
```

---

## 📁 File Structure

```
seven_pyramid/
├── wines-data-template.json    # Wine data structure (JSON)
├── build-wine-catalog.js       # Static site generator
├── update-wine-prices.js       # Price update utility
├── validate-wine-data.js       # Data validation
├── wine-stats.js              # Analytics generator
├── package.json               # Node.js configuration
├── WINE-CATALOG-SETUP.md       # This documentation
│
├── generated/                 # Generated HTML files
│   ├── wine_list.html         # Main catalog page
│   ├── sitemap.xml           # Search engine sitemap
│   ├── wines/                # Individual wine pages
│   ├── countries/            # Country overview pages
│   └── regions/              # Regional wine pages
│
├── backups/                  # Auto-generated backups
├── css/                     # Stylesheet files
├── js/                      # JavaScript files
├── img/                     # Image assets
└── templates/               # HTML templates (optional)
```

---

## 🛠️ Available Commands

### Build Commands
```bash
npm run build:wine          # Generate wine catalog HTML
npm run build:dev           # Generate + show completion message
npm run generate-sitemap    # Generate XML sitemap only
npm run deploy              # Build + copy assets for production
```

### Data Management
```bash
npm run validate            # Validate wine data structure
npm run update-prices       # Update prices from CSV
npm run stats               # Generate analytics report
npm run lint                # Check data quality
```

### Development
```bash
npm run serve               # Start local preview server
npm run copy-assets         # Copy CSS/JS/images to generated folder
```

---

## 📊 Wine Data Management

### JSON Data Structure
```json
{
  "metadata": {
    "lastUpdated": "2024-12-20T10:30:00Z",
    "totalWines": 2000,
    "currencies": ["TWD", "USD"]
  },
  "countries": {
    "france": {
      "name": "法國葡萄酒",
      "nameEn": "French Wines",
      "emoji": "🇫🇷",
      "regions": {
        "bordeaux": {
          "name": "波爾多",
          "nameEn": "Bordeaux",
          "wines": [
            {
              "id": "FR-BDX-001",
              "name": "Château Margaux",
              "nameCh": "瑪歌酒莊",
              "vintage": "2015",
              "price": {
                "twd": 28800,
                "usd": 900
              },
              "inStock": true,
              "description": "世界頂級酒莊...",
              "seoKeywords": ["瑪歌", "波爾多", "法國紅酒"]
            }
          ]
        }
      }
    }
  }
}
```

### Wine ID Format
- **Format**: `CC-RRR-NNN`
- **Example**: `FR-BDX-001`
- **CC**: Country code (FR=France, AU=Australia, CL=Chile)
- **RRR**: Region code (BDX=Bordeaux, BAR=Barossa)
- **NNN**: Sequential number (001, 002, 003...)

---

## 💰 Price Update System

### Creating Price Update CSV
```csv
wine_id,new_price_twd,new_price_usd,discount_percent,updated_date
FR-BDX-001,29800,932,5,2024-12-20T10:00:00Z
FR-BDX-002,36900,1154,3,2024-12-20T10:00:00Z
AU-BAR-001,23500,735,7,2024-12-20T10:00:00Z
```

### Updating Prices
```bash
# Create sample CSV template
node update-wine-prices.js --sample

# Update prices from CSV file
node update-wine-prices.js price-updates.csv

# Rebuild catalog with new prices
npm run build:wine
```

### Price Update Process
1. **Backup**: Automatically creates backup before updates
2. **Validation**: Checks wine IDs and price formats
3. **Update**: Applies new prices and discounts
4. **Report**: Shows summary of changes
5. **Rebuild**: Regenerate HTML with updated prices

---

## 🔍 Data Validation & Analytics

### Validation Features
- **Structure Check**: Validates JSON schema
- **Data Quality**: Checks for missing fields
- **Price Consistency**: Validates discount calculations
- **SEO Completeness**: Ensures meta descriptions and keywords
- **Duplicate Detection**: Finds duplicate wine IDs
- **Image Validation**: Identifies missing wine images

### Running Validation
```bash
# Basic validation
npm run validate

# Detailed analytics
npm run stats

# Export analytics to JSON
node wine-stats.js --json
```

### Validation Report Example
```
🍷 SEVEN PYRAMID WINE DATA VALIDATION REPORT
============================================================

📊 DATA SUMMARY
Total Wines: 2000
Countries: 6
Regions: 24
In Stock: 1847
Out of Stock: 153

💰 PRICE DISTRIBUTION
Budget (< NT$3,000): 245
Mid-range (NT$3,000-10,000): 892
Premium (NT$10,000-30,000): 634
Luxury (> NT$30,000): 229

🎯 VALIDATION STATUS
✅ All validations passed! Data is ready for production.
```

---

## 🌐 SEO Optimization Features

### Individual Wine Pages
Each wine gets a unique URL structure:
```
/wines/fr-bdx-001-chateau-margaux.html
/wines/au-bar-001-penfolds-grange.html
/wines/cl-mai-001-almaviva.html
```

### Rich Schema Markup
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Château Margaux 2015",
  "alternateName": "瑪歌酒莊",
  "brand": {"@type": "Brand", "name": "Château Margaux"},
  "offers": {
    "@type": "Offer",
    "price": "28800",
    "priceCurrency": "TWD",
    "availability": "https://schema.org/InStock"
  }
}
```

### XML Sitemap Generation
Automatically creates `sitemap.xml` with:
- Main catalog pages
- Individual wine pages
- Country and region pages
- Proper lastmod dates and priorities

---

## 🚢 Deployment Process

### Local to Production
```bash
# 1. Validate data
npm run validate

# 2. Build complete catalog
npm run build:wine

# 3. Copy assets
npm run copy-assets

# 4. Upload 'generated' folder to web server
# Example with rsync:
rsync -av generated/ user@server:/var/www/html/

# 5. Submit sitemap to search engines
# Google: https://search.google.com/search-console/sitemaps
# Submit: https://newyear.7pyramid.com/sitemap.xml
```

### Automated Deployment (Optional)
Create `deploy.sh` script:
```bash
#!/bin/bash
echo "🍷 Deploying Seven Pyramid Wine Catalog..."

npm run validate && \
npm run build:wine && \
npm run copy-assets && \
rsync -av generated/ user@server:/var/www/html/ && \
echo "✅ Deployment completed!"
```

---

## 📈 Analytics & Reporting

### Business Analytics
```bash
# Generate comprehensive report
npm run stats
```

### Key Metrics Tracked
- **Inventory Status**: Stock levels and availability
- **Price Distribution**: Budget vs premium wines
- **Country Performance**: Market share and pricing
- **Popular Vintages**: Most common years
- **Category Analysis**: Red/white/sparkling distribution
- **Content Quality**: Missing images and descriptions

### Sample Analytics Output
```
📊 KEY INSIGHTS
✅ 庫存狀況: 92.4% (1847/2000 款酒有現貨)
ℹ️  平均價格: NT$ 12,456 (所有酒款平均價格)
ℹ️  最熱門年份: 2018 (324 款酒)
ℹ️  主要類別: Red Wine (1456 款酒, 72.8%)

🌍 COUNTRY PERFORMANCE
🏆 法國: 45.2% market share, avg NT$18,234, 94.1% in stock
👍 澳洲: 23.7% market share, avg NT$8,945, 89.3% in stock
👍 智利: 18.4% market share, avg NT$6,234, 91.2% in stock
```

---

## 🛡️ Backup & Recovery

### Automatic Backups
- Created before every price update
- Stored in `backups/` directory
- Timestamped JSON files
- Retained for manual recovery

### Manual Backup
```bash
# Create manual backup
cp wines-data-template.json backups/manual-backup-$(date +%Y%m%d).json

# Restore from backup
cp backups/wines-data-backup-2024-12-20T10-30-00.json wines-data-template.json
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Build fails with "ENOENT" error**
```bash
# Solution: Check if data file exists
ls -la wines-data-template.json
# If missing, copy from template
cp wines-data-template.json wines-data.json
```

**2. Validation shows errors**
```bash
# Solution: Run detailed validation
npm run validate
# Fix reported errors in JSON file
```

**3. Price update fails**
```bash
# Solution: Check CSV format
head -5 your-price-file.csv
# Ensure columns: wine_id,new_price_twd,new_price_usd,discount_percent,updated_date
```

**4. Generated pages missing CSS**
```bash
# Solution: Copy assets
npm run copy-assets
# Or manually: cp -r css js img generated/
```

### Log Files
- Build logs: Console output during generation
- Validation logs: Error and warning details
- Update logs: Price change summaries

---

## 🔄 Maintenance Schedule

### Daily
- [ ] Monitor website availability
- [ ] Check for 404 errors in logs

### Weekly
- [ ] Update wine prices if needed
- [ ] Run data validation
- [ ] Review analytics report
- [ ] Backup wine data

### Monthly
- [ ] Add new wine arrivals
- [ ] Update seasonal promotions
- [ ] Review SEO performance
- [ ] Clean up old backup files

### Quarterly
- [ ] Audit wine inventory
- [ ] Update regional descriptions
- [ ] Review and optimize images
- [ ] Submit sitemap to search engines

---

## 📞 Support & Contact

### Technical Issues
1. Check this documentation first
2. Run validation: `npm run validate`
3. Check log files for specific errors
4. Contact development team if needed

### Business Questions
- **台北總店**: +886-2-2791-2147
- **新竹分店**: +886-2-2791-2147
- **Email**: info@7pyramid.com
- **Website**: https://newyear.7pyramid.com

### Development Team
- **GitHub Issues**: https://github.com/seven-pyramid/wine-catalog/issues
- **Documentation**: This file and inline code comments

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time inventory sync
- [ ] Customer review system
- [ ] Wine recommendation engine
- [ ] Multi-language content management
- [ ] Advanced search and filtering
- [ ] Mobile app integration

### Performance Optimizations
- [ ] Image compression and WebP support
- [ ] CDN integration
- [ ] Lazy loading for wine images
- [ ] Service worker for offline browsing

### Analytics Enhancements
- [ ] Google Analytics integration
- [ ] Conversion tracking
- [ ] User behavior analysis
- [ ] A/B testing framework

---

## ✅ Checklist for Going Live

### Pre-Launch
- [ ] Wine data validated and complete
- [ ] All images uploaded and optimized
- [ ] Build process runs without errors
- [ ] Local preview working correctly
- [ ] SEO meta tags verified
- [ ] Contact information updated

### Launch Day
- [ ] Deploy to production server
- [ ] Test all major pages
- [ ] Submit sitemap to Google
- [ ] Set up Google Analytics
- [ ] Monitor for 404 errors
- [ ] Test on mobile devices

### Post-Launch
- [ ] Monitor search engine indexing
- [ ] Track organic traffic growth
- [ ] Set up price update schedule
- [ ] Train staff on update procedures
- [ ] Schedule regular maintenance

---

**🍷 Seven Pyramid Wine Catalog Management System v1.0**
*Built with ❤️ for Taiwan's Premier Wine Import Business*

Last updated: 2024-12-20
Next review: 2025-01-20