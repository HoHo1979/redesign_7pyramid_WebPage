# Wine Catalog Generation Workflow

## Overview

This document describes the complete workflow for converting wine data from Excel (`info/sevenStock.xlsx`) into a static website with 800+ SEO-optimized wine pages.

**Architecture**: Excel → JSON → Static HTML Pages → Deployment

---

## Quick Start

### One-Command Workflow
```bash
npm run rebuild-catalog && npm run serve
```

This will:
1. Convert Excel data to JSON
2. Generate static HTML wine pages
3. Validate all data
4. Serve on http://localhost:8080/wines/

### Full Deployment
```bash
npm run full-deploy
```

This will:
1. Convert Excel → JSON
2. Generate static HTML
3. Validate data
4. Prepare deployment folder

---

## Detailed Workflow Steps

### Step 1: Update Wine Data in Excel

**File**: `info/sevenStock.xlsx`

The Excel file contains wine inventory data with these expected columns:
- **產品編號** (Product Code) - Column A
- **產品名稱** (English Wine Name) - Column B
- **中文名稱** (Chinese Wine Name) - Column C
- **分數** (Rating/Score) - Column D
- **七銘庫存/瓶** (Stock Quantity) - Column E
- **專賣進價** (Wholesale Price) - Column F
- **搭贈方式** (Bundle Type) - Column G
- **建議售價** (Suggested Price) - Column H
- **每瓶單價** (Unit Price per Bottle) - Column I
- **直銷價/瓶** (Direct Sale Price per Bottle) - Column J

**Required fields**:
- English or Chinese wine name (at least one)
- Price (Column I or J preferred)

**Optional fields**:
- Stock quantity
- Ratings/scores

### Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

This installs all required packages including:
- `exceljs` - Excel file reading (secure, no vulnerabilities)
- `webpack` - Frontend build tools
- `cheerio` - HTML manipulation
- Other utilities

### Step 3: Convert Excel to JSON

```bash
npm run convert-excel
```

**What it does**:
- Reads `info/sevenStock.xlsx`
- Extracts wine data from all rows
- Automatically infers country/region from wine names
- Extracts vintage years from wine names
- Generates unique wine IDs (e.g., `FR-BDX-001`)
- Creates SEO-friendly slugs
- Validates data structure
- Creates backup: `wines-data-template.backup.json`
- Outputs: `wines-data-template.json`

**Output files**:
```
wines-data-template.json          # Main wine data (843 wines from your Excel)
wines-data-template.backup.json   # Backup of previous JSON
```

**Sample output summary**:
```
✅ Found Excel file: ./info/sevenStock.xlsx
✅ Read 845 rows from Excel
✅ Processing 844 wine records
✅ Generated: ./wines-data-template.json

📊 Conversion Statistics:
   Total Wines: 843
   Countries: 6

   Wines by Country:
     - france: 821 wines
     - australia: 8 wines
     - chile: 3 wines
     - spain: 4 wines
     - argentina: 1 wines
     - other: 6 wines
```

### Step 4: Generate Static HTML Pages

```bash
npm run build:wine
```

**What it does**:
- Reads `wines-data-template.json`
- Generates individual HTML pages for each wine
- Creates country collection pages
- Creates region collection pages
- Generates wine catalog page
- Creates SEO sitemap
- Includes Product schema.org markup on every page

**Output structure**:
```
generated/
├── wines/                    # 843 individual wine pages
│   ├── fr-bdx-001-*.html    # France Bordeaux wine pages
│   ├── au-bar-001-*.html    # Australia Barossa wine pages
│   └── ... (800+ pages)
├── countries/               # 6 country collection pages
│   ├── france.html
│   ├── australia.html
│   └── ...
├── regions/                # 15 region collection pages
│   ├── france-bordeaux.html
│   ├── australia-barossa.html
│   └── ...
├── wine_list.html           # Main wine catalog page
├── sitemap.xml              # SEO sitemap
└── ... (other generated files)
```

**Total generated**: 862 static HTML pages (19MB)

### Step 5: Validate Generated Data

```bash
npm run validate
```

**What it checks**:
- All required fields present
- Wine IDs are unique
- Prices are valid numbers
- Stock levels are integers
- Country/region grouping is correct
- SEO slugs are URL-safe
- Duplicate detection
- Price range analysis

**Sample output**:
```
✅ Wine data loaded successfully

📊 DATA SUMMARY
   Total wines: 843
   By country: France: 821, Australia: 8, Chile: 3, Spain: 4, Argentina: 1, Other: 6
   By category: Red Wine: 700, Sparkling: 50, White Wine: 93
   Price ranges: Budget (<3000): 450, Mid (3000-10000): 250, Premium: 143
```

### Step 6: Preview Locally

```bash
npm run serve
```

**What it does**:
- Starts a local web server on port 8080
- Serves the `generated/` folder
- Auto-opens browser to http://localhost:8080

**View wines**:
- http://localhost:8080/wines/ - All wine pages
- http://localhost:8080/countries/france.html - Country pages
- http://localhost:8080/regions/france-bordeaux.html - Region pages
- http://localhost:8080/wine_list.html - Main catalog

### Step 7: Prepare for Deployment

```bash
npm run prepare-deploy
```

**What it does**:
- Creates clean `deploy/` folder
- Copies only production-ready files
- Includes HTML, CSS, JS, images
- Excludes node_modules, build files, etc.

**Deploy folder structure**:
```
deploy/
├── index.html
├── wine_list.html
├── 404.html
├── wines/              # All wine HTML pages
├── countries/          # Country pages
├── regions/            # Region pages
├── css/               # Stylesheets
├── js/                # JavaScript files
├── img/               # Images
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

### Step 8: Deploy to Web Server

Upload the contents of `deploy/` folder to your web server:

```bash
# Example with SCP
scp -r deploy/* user@server.com:/var/www/html/

# Example with FTP
# Use your FTP client to upload deploy/ contents
```

---

## Complete npm Scripts Reference

### Data Management
| Command | Purpose |
|---------|---------|
| `npm run convert-excel` | Convert Excel → JSON |
| `npm run validate` | Validate wine data structure |
| `npm run stats` | Generate analytics report |
| `npm run update-prices` | Update wine prices from source |

### Building
| Command | Purpose |
|---------|---------|
| `npm run build:wine` | Generate static HTML pages from JSON |
| `npm run build:dev` | Generate and show completion message |
| `npm run build` | Production webpack build |

### Workflow Shortcuts
| Command | Purpose |
|---------|---------|
| `npm run rebuild-catalog` | Excel → JSON → HTML → Validate (all in one) |
| `npm run full-deploy` | Rebuild + prepare deployment folder |

### Local Development
| Command | Purpose |
|---------|---------|
| `npm run start` | Webpack dev server with hot reload |
| `npm run serve` | Local HTTP server on port 8080 |

### SEO & Maintenance
| Command | Purpose |
|---------|---------|
| `npm run csp-check` | Check for CSO violations |
| `npm run fix-csp` | Auto-fix CSP violations |
| `npm run generate-sitemap` | Generate SEO sitemap |
| `npm run prepare-deploy` | Prepare deployment folder |

---

## Excel Data Format Guide

### Column Mapping

The converter automatically maps Excel columns to wine data:

| Column | Excel Header | Maps To | Required |
|--------|--------------|---------|----------|
| A | 產品編號 | Product ID | No |
| B | 產品名稱 | Wine Name (English) | ✅ Yes |
| C | 中文名稱 | Wine Name (Chinese) | ✅ Yes |
| D | 分數 | Rating/Score | No |
| E | 七銘庫存/瓶 | Stock Quantity | No |
| F | 專賣進價 | Wholesale Price | No |
| G | 搭贈方式 | Bundle Info | No |
| H | 建議售價 | Suggested Price | No |
| I | 每瓶單價 | **Unit Price** | ✅ Yes |
| J | 直銷價/瓶 | Direct Sale Price | ✅ Yes |

### Data Quality Tips

1. **Wine Names** (Columns B & C)
   - Include vintage year for better extraction (e.g., "Château Margaux 2015")
   - At least one name (English or Chinese) must be present
   - Used for inferring country and region

2. **Prices** (Columns I or J)
   - Must be numeric value (no currency symbols)
   - Expected in Taiwan Dollars (TWD)
   - Both columns checked; uses first available value

3. **Stock Quantity** (Column E)
   - Numeric value (number of bottles)
   - Empty or 0 = out of stock
   - Used to determine availability

4. **Country/Region Detection**
   - Automatically inferred from wine name
   - Examples:
     - "Château Margaux" → France, Bordeaux
     - "Barossa Shiraz" → Australia, Barossa
     - "Napa Cabernet" → USA, Napa

---

## Troubleshooting

### Issue: "Excel file not found"
```bash
Error: Excel file not found: ./info/sevenStock.xlsx
```
**Solution**: Make sure `info/sevenStock.xlsx` exists in the project root

### Issue: "0 wines converted"
**Causes**:
- Excel file is empty
- Column headers don't match expected format
- All rows have missing wine names

**Solution**:
- Check that Excel file has data in columns B & C (wine names)
- Verify first row contains header text

### Issue: "Missing price" warnings
**Message**: `Wine "XYZ" missing price`
**Cause**: Columns I and J (price columns) are empty
**Solution**: Add prices to Excel file columns I or J

### Issue: Generated files not updating
**Problem**: Running build but files in `generated/` are old
**Solution**:
```bash
rm -rf generated/
npm run build:wine
```

### Issue: "npm vulnerabilities found"
```bash
npm audit
```
**Expected output**:
```
found 0 vulnerabilities
```

If vulnerabilities appear:
```bash
npm audit fix
```

---

## Security & Performance

### Package Security
- ✅ Uses `exceljs` (actively maintained, no known vulnerabilities)
- ✅ Zero npm audit vulnerabilities
- ✅ All dependencies up-to-date

### Performance Metrics
- Conversion speed: ~800 wines in <5 seconds
- HTML generation: 862 pages in <10 seconds
- Total generated size: ~19MB
- Average page size: ~23KB

### SEO Optimization
- ✅ 843 individual wine pages indexed
- ✅ Product schema.org markup on every page
- ✅ Proper canonical URLs and Open Graph tags
- ✅ Mobile-responsive HTML
- ✅ Automatic sitemap generation

---

## File Reference

### Key Files in This Workflow

| File | Purpose |
|------|---------|
| `info/sevenStock.xlsx` | **INPUT** - Your wine inventory Excel file |
| `excel-to-json-converter.js` | Converts Excel → JSON |
| `wines-data-template.json` | **INTERMEDIATE** - Wine data in JSON format |
| `build-wine-catalog.js` | Generates HTML pages from JSON |
| `validate-wine-data.js` | Validates data quality |
| `prepare-deployment.js` | Prepares deployment folder |
| `generated/` | **OUTPUT** - All generated HTML files |
| `deploy/` | **OUTPUT** - Ready-to-deploy files |

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM scripts and dependencies |
| `webpack.config.dev.js` | Development build config |
| `webpack.config.prod.js` | Production build config |
| `CLAUDE.md` | Development guide for Claude Code |

---

## Example Workflows

### Workflow 1: Quick Update & Test
```bash
# Edit Excel file
# Then:
npm run convert-excel
npm run build:wine
npm run serve
# Open http://localhost:8080/wines/
```

### Workflow 2: Full Production Deployment
```bash
# Update Excel
npm run full-deploy
# Then upload deploy/ folder to web server
```

### Workflow 3: Data Validation Only
```bash
npm run convert-excel
npm run validate
npm run stats
```

### Workflow 4: Development with Hot Reload
```bash
npm start
# Edit CSS/JS files for hot reload
# Open http://localhost:8080
```

---

## FAQ

**Q: How often can I update the wine list?**
A: Anytime! Just update `info/sevenStock.xlsx` and run `npm run rebuild-catalog`

**Q: Can I add custom fields to wines?**
A: Yes, extend `excel-to-json-converter.js` to map additional Excel columns

**Q: What if a wine doesn't have English or Chinese name?**
A: It will be skipped with a warning. At least one name is required.

**Q: How do I handle wines with no price?**
A: The converter warns about missing prices but still generates pages (uses default price: 5000 TWD)

**Q: Can I customize the generated HTML?**
A: Yes, edit the templates in `build-wine-catalog.js` before running the build

**Q: How do I remove old wine pages?**
A: Delete `generated/wines/` folder, then re-run `npm run build:wine`

**Q: What's the maximum number of wines?**
A: No limit! The converter can handle thousands of wines efficiently

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review `CLAUDE.md` for architecture details
3. Check `DEPLOYMENT-GUIDE.md` for deployment help
4. Run `npm run stats` for data analysis

---

**Last Updated**: December 17, 2025
**Workflow Version**: 1.0
**Tech Stack**: Node.js, exceljs, webpack, cheerio
