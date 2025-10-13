# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Seven Pyramid 七銘企業**, a professional wine import business website serving Taiwan (Taipei and Hsinchu locations). The project consists of a static HTML website with Material Design 3 theming, SEO optimization, and integration with a Flutter wine catalog application.

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

### Wine Content Strategy
- **Static Wine Pages**: For SEO discoverability of specific wine categories (Bordeaux, Champagne, etc.)
- **Flutter Integration**: Dynamic wine catalog at `https://newyear.7pyramid.com/#/wine/{country}`
- **Wine Region Maps**: Visual backgrounds (`img/*_wine_map.png`) for educational context
- **Dual Purpose**: SEO-friendly static content + interactive Flutter experience

## Development Commands

### Local Development
```bash
npm start                    # Start webpack dev server with hot reload
```

### Building
```bash
npm run build               # Production build to dist/ directory
```

### Project Structure
```
seven_pyramid/
├── index.html              # Main landing page with hero section
├── wine_list.html          # SEO wine catalog with pricing tables
├── js/app.js              # Theme switching functionality
├── css/
│   ├── style.css          # Base HTML5 Boilerplate styles
│   ├── light.css          # Material Design 3 light theme
│   └── dark.css           # Material Design 3 dark theme
├── img/                   # Wine region maps and background images
├── sitemap.xml            # Search engine sitemap
├── robots.txt            # Crawler guidance
└── site.webmanifest      # PWA manifest for mobile
```

## Business Context & Constraints

### Target Market
- **Primary**: Taiwan wine enthusiasts and businesses
- **Locations**: Taipei (Neihu District) and Hsinchu (East District)
- **Languages**: Traditional Chinese primary, English secondary
- **Service Areas**: 台北市、新北市、桃園市、新竹縣、新竹市、台中市

### SEO Strategy
- **Local Business Schema**: Dual locations with proper coordinates
- **Wine Catalog SEO**: Static HTML tables for search engine crawling
- **Geographic Targeting**: Taiwan-specific meta tags and structured data
- **Phone Number**: +886-2-2791-2147 (consistent across all locations)

### Integration Points
- **Flutter App**: `https://newyear.7pyramid.com` for interactive wine browsing
- **Wine Categories**: Australia, France, Chile, USA, Argentina, Spain with direct deep-links
- **Theme Coordination**: Ensure consistent branding between static site and Flutter app

## Key Implementation Details

### Theme System Logic
The theme system cycles between light/dark with localStorage persistence. Default is light theme (index 0). Theme switching updates both CSS link and body class simultaneously.

### Wine Region Maps
Wine cards use background images of actual wine region maps with semi-transparent flag-colored overlays to maintain country branding while showing geographic context.

### SEO Implementation
Both `index.html` and `wine_list.html` contain comprehensive JSON-LD structured data for local business with dual locations. Wine catalog uses semantic HTML tables for easy search engine parsing.

### Mobile Responsiveness
Grid layouts collapse to single columns on <768px screens. Navigation dropdowns have special mobile positioning with transform-based centering.

## Content Management Notes

- Wine pricing is in NT$ (Taiwan dollars)
- All wine names include both English and Traditional Chinese
- Region names use authentic Chinese translations (波爾多, 香檳區, etc.)
- Business hours: Mo-Su 10:00-21:00 across both locations
- Service specialties include corporate procurement and Science Park delivery