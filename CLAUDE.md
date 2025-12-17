# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Seven Pyramid 七銘企業**, a professional wine import business website serving Taiwan (Taipei and Hsinchu locations). The project consists of a static HTML website with Material Design 3 theming, SEO optimization, and integration with a Flutter wine catalog application. The build system combines webpack for frontend development and Node.js scripts for static site generation and deployment.

## Architecture

### Core Structure
- **Landing Page (`index.html`)**: Modern hero section with wine region showcase cards linking to Flutter app
- **Wine Catalog (`wine_list.html`)**: SEO-optimized static page with comprehensive wine listings organized by country/region
- **Theme System**: Material Design 3 with light/dark mode toggle via `js/app.js`
- **SEO Infrastructure**: Full local business schema markup, sitemap.xml, robots.txt for Taiwan market

### Theme Architecture
The website uses a sophisticated Material Design 3 theming system:
- **Base**: `css/style.css` (HTML5 Boilerplate foundation)
- **Themes**: `css/light.css` and `css/dark.css` with CSS custom properties
- **Theme Controller**: `js/app.js` handles switching with localStorage persistence
- **Current Themes**: Light (default) and Dark only - previous 7-theme system was simplified

### Wine Content & Build System
- **Wine Data Source**: `wines-data-template.json` contains 2000+ wine records with metadata
- **Static Generation**: `build-wine-catalog.js` generates static HTML pages for SEO from JSON data
- **Deployment Preparation**: `prepare-deployment.js` creates a clean `deploy/` folder with only production-ready files
- **Content Validation**: `validate-wine-data.js` validates wine data structure and detects errors
- **Flutter Integration**: Dynamic wine catalog at `https://newyear.7pyramid.com/#/wine/{country}`
- **Wine Region Maps**: Visual backgrounds (`img/*_wine_map.png`) with semi-transparent flag overlays

### Webpack Configuration
- **Dev Server**: `webpack.config.dev.js` - Hot reload, source maps, auto-opening browser
- **Production Build**: `webpack.config.prod.js` - Optimized build
- **Common Config**: `webpack.common.js` - Shared configuration for both environments

## Development Commands

### Local Development
```bash
npm start                    # Start webpack dev server with hot reload on localhost
npm run serve               # Serve generated/ folder on port 8080 for preview
```

### Building & Generation
```bash
npm run build               # Production build with webpack (creates dist/)
npm run build:wine          # Generate static HTML wine catalog from JSON data
npm run build:dev           # Generate wine catalog and show preview instructions
npm run prepare-deploy      # Prepare clean deployment folder with only production files
```

### Quality & Maintenance
```bash
npm run validate            # Validate wine data structure and detect errors
npm run lint                # Alias for validate (check wine data)
npm run stats               # Generate analytics on wine collection (countries, pricing, etc.)
npm run update-prices       # Update wine prices from data source
npm run generate-sitemap    # Generate SEO sitemap.xml
npm run csp-check           # Check for CSP violations (inline event handlers)
npm run fix-csp             # Fix CSP violations automatically
npm run deploy-help         # Display deployment instructions
```

### Data & Deployment Workflow
```bash
npm run build:wine && npm run validate  # Generate and validate in one command
npm run prepare-deploy                  # Create deploy/ folder ready for upload
npm run serve                           # Test locally before uploading to server
```

## Project Structure
```
seven_pyramid/
├── index.html                          # Main landing page
├── wine_list.html                      # SEO wine catalog
├── 404.html                            # Error page
├── package.json                        # Dependencies & scripts
├── wines-data-template.json            # Wine database (2000+ records)
│
├── Build & Deployment Scripts
├── build-wine-catalog.js              # Generates HTML pages from JSON
├── validate-wine-data.js              # Validates data structure
├── prepare-deployment.js              # Creates deploy/ folder
├── update-wine-prices.js              # Price management
├── wine-stats.js                      # Analytics generator
├── fix-csp-violations.js              # CSP compliance tool
│
├── Webpack Configuration
├── webpack.common.js                  # Shared config
├── webpack.config.dev.js              # Development settings
└── webpack.config.prod.js             # Production settings
│
├── js/
│   ├── app.js                         # Theme switching & initialization
│   ├── csp-fix.js                     # CSP-compliant event handlers
│   ├── wine.js                        # Wine-related functionality
│   └── sitemap-generator.js           # Generates sitemap.xml
│
├── css/
│   ├── style.css                      # Base HTML5 Boilerplate styles
│   ├── light.css                      # Material Design 3 light theme
│   ├── dark.css                       # Material Design 3 dark theme
│   └── variables.css                  # CSS custom properties
│
├── img/                               # Wine region maps & assets
│   ├── 7pyramidlogo.jpg
│   ├── australia_wine_map.png
│   ├── french_wine_map.png
│   └── (other region maps)
│
├── Generated Output
├── deploy/                            # Production-ready files (generated)
├── generated/                         # Build output (if using generator)
│
├── SEO & PWA
├── robots.txt                         # Search engine instructions
├── sitemap.xml                        # SEO sitemap (auto-generated)
├── site.webmanifest                   # PWA manifest
├── favicon.ico
│
└── Documentation
    ├── CLAUDE.md                      # This file
    └── DEPLOYMENT-GUIDE.md            # Deployment instructions

```

## Business Context & Constraints

### Target Market
- **Primary**: Taiwan wine enthusiasts and businesses
- **Locations**: Taipei (Neihu District) and Hsinchu (East District)
- **Languages**: Traditional Chinese primary, English secondary
- **Service Areas**: 台北市、新北市、桃園市、新竹縣、新竹市、台中市

### SEO Strategy
- **Local Business Schema**: Dual locations with proper coordinates in JSON-LD
- **Wine Catalog SEO**: Static HTML tables generated from JSON for search engine crawling
- **Geographic Targeting**: Taiwan-specific meta tags and structured data
- **Phone Number**: +886-2-2791-2147 (consistent across all locations)

### Integration Points
- **Flutter App**: `https://newyear.7pyramid.com` for interactive wine browsing
- **Wine Categories**: Australia, France, Chile, USA, Argentina, Spain with direct deep-links
- **Theme Coordination**: Ensure consistent branding between static site and Flutter app

## Key Implementation Details

### Theme System Logic
The theme system cycles between light/dark with localStorage persistence. Default is light theme (index 0). Theme switching updates both CSS link and body class simultaneously. CSS uses custom properties for dynamic theming.

### Wine Data Flow
1. **Source**: Wine data stored in `wines-data-template.json` with fields: id, name, country, region, vintage, price, category, stock status, image URL
2. **Validation**: `validate-wine-data.js` checks structure, detects duplicate IDs, price inconsistencies, missing images
3. **Generation**: `build-wine-catalog.js` generates static HTML pages using templates for SEO crawling
4. **Deployment**: `prepare-deployment.js` creates clean `deploy/` folder with production files only

### CSP (Content Security Policy) Compliance
- **Issue**: Inline event handlers (`onclick=`) violate CSP for security
- **Solution**: Use `csp-fix.js` to attach event listeners programmatically
- **Verification**: Run `npm run csp-check` to detect violations

### SEO Implementation
Both `index.html` and `wine_list.html` contain comprehensive JSON-LD structured data for local business with dual locations. Wine catalog uses semantic HTML tables for easy search engine parsing. Sitemap auto-generated via `js/sitemap-generator.js`.

### Mobile Responsiveness
Grid layouts collapse to single columns on <768px screens. Navigation dropdowns have special mobile positioning with transform-based centering.

## Development Workflow

### Making Changes
1. Edit HTML/CSS/JS files directly for immediate webpack hot reload
2. For wine data changes: Edit `wines-data-template.json`, run `npm run build:wine && npm run validate`
3. Run `npm run serve` to preview generated files locally
4. Check `npm run csp-check` before deployment to ensure CSP compliance

### Before Deployment
1. Run `npm run validate` to check for data errors
2. Run `npm run csp-check` to verify CSP compliance
3. Run `npm run prepare-deploy` to create clean deployment folder
4. Run `npm run serve` to test locally on http://localhost:8080
5. Upload `deploy/` folder contents to web server
6. Test on live server before announcing

### Debugging Build Issues
- **Wine generation fails**: Check `wines-data-template.json` structure with `npm run validate`
- **CSP violations**: Run `npm run fix-csp` to auto-fix inline handlers
- **Hot reload not working**: Restart webpack dev server with `npm start`
- **Deployment folder missing files**: Re-run `npm run prepare-deploy` and verify files listed in `prepare-deployment.js`

## Content Management Notes

- Wine pricing is in NT$ (Taiwan dollars)
- All wine names include both English and Traditional Chinese
- Region names use authentic Chinese translations (波爾多, 香檳區, etc.)
- Business hours: Mo-Su 10:00-21:00 across both locations
- Service specialties include corporate procurement and Science Park delivery
- Wine data validation catches duplicate IDs, missing images, and price range inconsistencies automatically