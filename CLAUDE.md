# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Seven Pyramid 七銘企業** — a professional wine import business website serving Taiwan (Taipei and Hsinchu). This is a **deploy-only static site bundle**: the `deploy/` folder contains production-ready HTML/CSS/JS files served directly. There is no build step or source compilation in this repo.

## Repository Layout

```
├── deploy/              # Production site root (served as-is)
│   ├── index.html       # Landing page (dark luxury theme, hero + wine regions)
│   ├── wine_list.html   # SEO wine catalog with structured data
│   ├── 404.html         # Custom error page
│   ├── faq.html, french_wine_knowledge.html, how_to_drink_wine.html
│   ├── countries/       # Country-level wine listing pages (9 countries)
│   ├── regions/         # Region-level pages (e.g., france-bordeaux.html)
│   ├── wines/           # 212 individual wine detail pages
│   ├── css/             # Themes: dark-luxury.css (default), light.css, dark.css, + variants
│   ├── js/              # app.js (theme), csp-fix.js, wine.js, inquiry_modal.js
│   ├── img/             # Logos, wine region maps (.webp/.png)
│   ├── sitemap*.xml     # Entity-based sitemap architecture
│   ├── robots.txt       # AI crawler-friendly (GEO optimized)
│   └── .htaccess        # Apache config (XML MIME types, custom 404)
├── system_info/         # Reference docs organized by topic (not served)
├── package.json         # Only script: `npm start` → http-server on deploy/
└── LICENSE.txt
```

## Commands

```bash
npm install              # Install http-server (only dependency)
npm start                # Serve deploy/ on http://localhost:8080
npm test                 # Verify deploy/ has all required files
```

There are no build, lint, or generation scripts — all content is pre-built static HTML.

## Architecture

### Theme System
- Default theme: `dark-luxury.css` (gold/burgundy wine aesthetic)
- Theme toggle in `js/app.js` with localStorage persistence
- CSS custom properties via Material Design 3 color system (`css/variables.css`)
- Multiple theme variants exist in `css/` but currently both toggle states use `dark-luxury.css`

### Wine Content Hierarchy
- **Country pages** (`deploy/countries/`): 9 HTML pages, one per wine-producing country
- **Region pages** (`deploy/regions/`): Sub-region pages (e.g., `france-bordeaux.html`)
- **Wine detail pages** (`deploy/wines/`): 212 individual wine pages with structured data
- URL pattern: `wines/{slug}.html` where slug is derived from wine ID + name + vintage

### SEO & GEO
- JSON-LD structured data in `index.html` and `wine_list.html` (LocalBusiness schema, dual locations)
- Entity-based sitemap architecture: separate sitemaps for wines by region, services, knowledge
- `robots.txt` explicitly allows AI crawlers (GPTBot, ChatGPT-User, ClaudeBot, Google-Extended)
- Google Ads tag (AW-17830155753) on landing page

### Integration
- Flutter app at `https://newyear.7pyramid.com` for interactive wine browsing
- Deep-links from static pages to Flutter app routes: `/#/wine/{country}`
- Inquiry modal system (`js/inquiry_modal.js`, `css/inquiry_modal.css`)

## Business Context

- **Market**: Taiwan (台北內湖、新竹東區)
- **Language**: Traditional Chinese primary, English secondary
- **Currency**: NT$ (Taiwan dollars)
- **Phone**: +886-2-2791-2147
- **Hours**: Mo-Su 10:00-21:00
- **Service areas**: 台北市、新北市、桃園市、新竹縣、新竹市、台中市

## Reference Documentation

Historical project docs (build scripts, automation guides, SEO notes, Vivino integration, deployment checklists) are preserved in `system_info/` organized by topic. See `system_info/README.md` for the directory layout. These are reference-only and not part of the deployed site.
