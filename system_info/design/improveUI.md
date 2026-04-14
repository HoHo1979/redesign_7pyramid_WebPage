# Seven Pyramid Deploy Folder — UI Quality Audit

_Audited: 2026-04-14_

---

## Anti-Patterns Verdict: FAIL — Classic AI Tells

This looks AI-generated. Specific tells from the frontend-design guidelines:

| Pattern | Where |
|---|---|
| **Dark mode with glowing gold accents** | `faq.html` defaults to dark luxury theme; `wines_noprice/` pages use gold glow everywhere |
| **Identical card grids** | `countries/*.html` — same-size card, name + year + price, 3-column `auto-fill`, repeated hundreds of times |
| **Glassmorphism nav** | `backdrop-filter: blur(10px)` on sticky nav across all pages decoratively |
| **Everything centered** | Every page header: `text-align: center`, centered subtitle, centered CTA |
| **Score/metric hero layout** | Wine detail pages: large score number, small label, colored bar — textbook hero metrics anti-pattern |
| **Rounded rects + generic drop shadow** | Wine cards: `border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1)` — safe and forgettable |
| **Gradient backgrounds** | `radial-gradient(circle at center, #2a2a2a 0%, #000000 100%)` in hero, `linear-gradient` in score bar and CTA sections |

---

## Executive Summary

| Severity | Count |
|---|---|
| Critical | 5 |
| High | 7 |
| Medium | 10 |
| Low | 6 |

**Top 3 critical issues:**
1. **Malformed `<link>` tags** in 250+ HTML files — Google Fonts preconnect is broken (missing space before `rel`, e.g., `<linkpreconnect=...>`)
2. **No keyboard accessibility** — Accordion triggers are `<div onclick=...>`, not `<button>`, with no ARIA. Fails WCAG 2.1 AA.
3. **Wrong `lang` attribute on 404 page** — `lang="en"` on a page with Chinese content; screen readers mispronounce.

**Overall recommendation:** Run `/harden` first (broken HTML, focus, ARIA), then `/adapt` (mobile nav), then `/normalize` (design token consistency).

---

## Detailed Findings

### Critical Issues

---

**[C-01] Malformed `<link>` preconnect tags across 250+ wine pages**
- **Location:** `wines/`, `wines_noprice/`, `wines_price/` — every wine detail file
- **Severity:** Critical
- **Category:** Performance / HTML
- **Description:** Font preconnect tags are missing the space before `rel`: `<linkpreconnect="https://fonts.googleapis.com">`. The browser parses this as an unknown element named `linkpreconnect`, not a `<link>` element. Google Fonts preconnect and likely the font `<link>` following it also fail silently.
- **Impact:** Every wine detail page likely falls back to browser-default serif font, defeating the Playfair Display + Montserrat typography system entirely. Users see mismatched fonts.
- **WCAG/Standard:** N/A — HTML validity
- **Recommendation:** Fix all occurrences: `<link rel="preconnect" href="https://fonts.googleapis.com">`. Fix the template in `build-wine-catalog.js` and regenerate.
- **Suggested command:** `/harden` (or a targeted build-script fix since it affects 250+ generated files)

---

**[C-02] Accordion is not keyboard accessible — no ARIA, uses `<div>` triggers**
- **Location:** `faq.html:267–408`, `french_wine_knowledge.html`, `how_to_drink_wine.html`
- **Severity:** Critical
- **Category:** Accessibility
- **Description:** Accordion headers are `<div class="accordion-header" onclick="...">`. Divs are not focusable by default; keyboard users cannot reach or activate them. No `aria-expanded`, `aria-controls`, or `role="button"` attributes present.
- **Impact:** FAQ content is completely inaccessible to keyboard-only and screen reader users.
- **WCAG/Standard:** WCAG 2.1 SC 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value) — Level A failures
- **Recommendation:** Replace `<div class="accordion-header">` with `<button>`, add `aria-expanded="false/true"`, `aria-controls` pointing to content ID. Remove `onclick=` inline handler (CSP violation too).
- **Suggested command:** `/harden`

---

**[C-03] Inline `onclick=` handlers violate CSP — 7 occurrences across 3 pages**
- **Location:** `faq.html` (5×), `french_wine_knowledge.html` (1×), `how_to_drink_wine.html` (1×)
- **Severity:** Critical
- **Category:** Security / Accessibility
- **Description:** Inline event handlers `onclick="..."` are blocked by Content Security Policy headers (the project's own `csp-fix.js` tool exists specifically to address this). These handlers also contribute to keyboard inaccessibility (see C-02).
- **Impact:** If CSP headers are active on the server, these handlers silently fail — accordion/tabs stop working entirely for all users.
- **WCAG/Standard:** Content Security Policy Level 2
- **Recommendation:** Run `npm run fix-csp` to auto-fix, then add proper ARIA to the converted elements.
- **Suggested command:** `/harden`

---

**[C-04] `lang="en"` on Chinese 404 page**
- **Location:** `404.html:2`
- **Severity:** Critical
- **Category:** Accessibility
- **Description:** The 404 page declares `lang="en"` but the entire site is `zh-TW`. The auto-redirect destination (`wine_list.html`) is entirely Chinese — a jarring language switch for screen readers.
- **Impact:** Screen readers switch to English voice/pronunciation engine on this page, then immediately redirect to Chinese content.
- **WCAG/Standard:** WCAG 2.1 SC 3.1.1 (Language of Page) — Level A
- **Recommendation:** Set `lang="zh-TW"` and translate the page content to Chinese, or at minimum correct the lang attribute.
- **Suggested command:** `/harden` + `/clarify`

---

**[C-05] Breadcrumb paths in `countries/` folder are one level too deep**
- **Location:** `countries/france.html:44–48`, all `countries/*.html` files
- **Severity:** Critical
- **Category:** Functionality
- **Description:** Breadcrumb links use `../../index.html` and `../../wine_list.html` but `countries/` is only one level deep — correct path is `../index.html`. Users clicking breadcrumbs get a 404.
- **Impact:** Navigation is broken. Users exploring country pages cannot return home or to the wine list via breadcrumbs.
- **Recommendation:** Fix the relative paths in the generation script `build-wine-catalog.js` so country pages use `../` not `../../`. Regenerate all country pages.
- **Suggested command:** Build script fix

---

### High-Severity Issues

---

**[H-01] No keyboard focus indicators on any interactive elements**
- **Location:** `css/style.css`, `css/dark-luxury.css`, `css/light.css`, `css/dark.css` — none define `:focus-visible`
- **Severity:** High
- **Category:** Accessibility
- **Description:** No `:focus-visible` styles are defined anywhere in the CSS system. `inquiry_modal.css:93` explicitly sets `outline: none` on form inputs (replaced with `box-shadow` — acceptable for that case) but buttons, links, and navigation items have zero focus treatment.
- **Impact:** Keyboard-only users have no visual indicator of where they are on the page. Tab navigation is effectively unusable.
- **WCAG/Standard:** WCAG 2.1 SC 2.4.7 (Focus Visible) — Level AA
- **Recommendation:** Add globally to `style.css`: `*:focus-visible { outline: 2px solid var(--md-sys-color-primary); outline-offset: 2px; }` with theme-specific enhancements on nav/button elements.
- **Suggested command:** `/harden`

---

**[H-02] No skip navigation link — fixed nav traps keyboard users**
- **Location:** All pages — nav is `position: fixed` without a skip link
- **Severity:** High
- **Category:** Accessibility
- **Description:** Every page has a sticky nav with 3+ links. There is no "Skip to main content" link, so keyboard users must tab through all nav items on every page load.
- **Impact:** Screen reader and keyboard users are forced to repeat the same navigation on every page visit.
- **WCAG/Standard:** WCAG 2.1 SC 2.4.1 (Bypass Blocks) — Level A
- **Recommendation:** Add `<a href="#main-content" class="visually-hidden focusable">Skip to main content</a>` as first child of `<body>`. The `.visually-hidden.focusable` class already exists in `style.css` — just needs to be wired up.
- **Suggested command:** `/harden`

---

**[H-03] Zero instances of `loading="lazy"` across 600+ images**
- **Location:** All HTML files, especially `countries/*.html` and wine detail pages
- **Severity:** High
- **Category:** Performance
- **Description:** Not a single `<img>` tag uses `loading="lazy"`. Country pages render a full grid of wine cards, each with a bottle image, all loaded eagerly. Wine detail pages load a 500px-tall bottle image and a story section image on initial paint.
- **Impact:** Country pages with 50+ wines load all images simultaneously, inflating initial page weight and wasting bandwidth on wines the user never scrolls to.
- **Recommendation:** Add `loading="lazy"` to all images below the fold. Fix the template in `build-wine-catalog.js` to apply globally.
- **Suggested command:** `/optimize`

---

**[H-04] `templateGEO.html` development template exposed in production deploy**
- **Location:** `deploy/templateGEO.html`
- **Severity:** High
- **Category:** Security / Content
- **Description:** A template file with placeholder wine data is deployed to production. It contains hardcoded development URLs, placeholder structured data, and incomplete content.
- **Impact:** Indexed by search engines, dilutes SEO, and may confuse customers. Google may penalize duplicate/thin content.
- **Recommendation:** Add `templateGEO.html` to the exclusion list in `prepare-deployment.js`.
- **Suggested command:** Build script fix

---

**[H-05] Photoshop source file (`.psd`) deployed to production**
- **Location:** `deploy/img/wines/bibi-graetz-colore-2019.psd`
- **Severity:** High
- **Category:** Performance / Security
- **Description:** A raw Photoshop source file is included in the deploy folder. PSD files are typically 10–100MB and expose proprietary design assets.
- **Impact:** Significantly inflates deploy size; if web server serves it, reveals design source materials to anyone with the URL.
- **Recommendation:** Remove from deploy. Add `*.psd` to gitignore and deploy exclusion rules in `prepare-deployment.js`.
- **Suggested command:** Build script fix

---

**[H-06] Mobile navigation has no hamburger/collapse — overflows on small screens**
- **Location:** Nav in `faq.html:225–241`, `countries/france.html:25–40`, and all other pages
- **Severity:** High
- **Category:** Responsive Design
- **Description:** Navigation renders 3–4 text links with `gap: 30px` inline. On screens narrower than ~550px this overflows horizontally. No media query, no hamburger menu, no collapse behavior.
- **Impact:** Mobile users (likely 40–60% of Taiwan traffic) see a broken nav. Horizontal scroll or overlapping text likely on phones.
- **WCAG/Standard:** WCAG 2.1 SC 1.4.10 (Reflow) — Level AA
- **Recommendation:** Add a media query at 640px that hides nav links and shows a hamburger button with a dropdown. Keep the theme toggle visible at all sizes.
- **Suggested command:** `/adapt`

---

**[H-07] Accordion uses `max-height` transition — animates layout property**
- **Location:** `faq.html:103–116`
- **Severity:** High
- **Category:** Performance
- **Description:** The accordion open/close animation transitions `max-height` (a layout property), triggering browser layout recalculation on every animation frame. The magic number `max-height: 500px` also clips any content taller than 500px.
- **Impact:** Jank on lower-powered mobile devices; content taller than 500px is silently cut off.
- **Recommendation:** Replace with `grid-template-rows: 0fr → 1fr` transition on a grid wrapper — a non-layout property that animates via CSS Grid.
- **Suggested command:** `/animate`

---

### Medium-Severity Issues

---

**[M-01] No font-family declared in base CSS — browser default fallback on category pages**
- **Location:** `css/style.css` — no font-family on html/body
- **Severity:** Medium
- **Category:** Theming / Typography
- **Description:** `style.css` sets `font-size: 1em` and `line-height: 1.4` on `html` but no `font-family`. Country pages and the wine list fall back to browser-default (usually Times New Roman on Mac).
- **Impact:** Typography looks unintentional vs. wine detail pages that load Playfair Display + Montserrat. A luxury wine brand with browser-default serif undermines credibility.
- **Recommendation:** Add a system font stack or load a consistent typeface. Noto Serif TC (already loaded on detail pages) would be appropriate for a CJK-primary site.
- **Suggested command:** `/typeset`

---

**[M-02] `variables.css` redefines tokens already in `light.css` — cascade confusion**
- **Location:** `css/variables.css:7–57`, `css/light.css:1–51`
- **Severity:** Medium
- **Category:** Theming
- **Description:** `variables.css` sets the full MD3 token set on `:root`. `light.css` sets identical tokens on `.light`. Pages loading both files get `:root` values bleeding through in dark mode if any element is outside `.dark` scope.
- **Impact:** Pages missing `.dark`/`.light` on `<body>` show the purple-primary `variables.css` defaults instead of the luxury gold — a visible color mismatch.
- **Recommendation:** Either remove `variables.css` (rely only on theme files) or make it a true fallback-only file. Don't duplicate the full token set.
- **Suggested command:** `/normalize`

---

**[M-03] Two parallel design systems — MD3 tokens vs. local luxury vars**
- **Location:** `css/dark-luxury.css` vs. `wines_noprice/*.html` inline styles
- **Severity:** Medium
- **Category:** Theming
- **Description:** Category/FAQ/knowledge pages use MD3 tokens (`--md-sys-color-primary` etc.). Wine detail pages define their own system (`--color-gold`, `--color-dark-bg`, `--color-wine-red`) that completely bypasses MD3. Theme switching in `app.js` has no effect on wine detail pages.
- **Impact:** Users switching from light to dark mode on a country page get no theme change when clicking into a wine detail page. Brand inconsistency; double the CSS maintenance burden.
- **Recommendation:** Map luxury vars to MD3 tokens: `--color-gold: var(--md-sys-color-primary)`. This way `dark-luxury.css` drives both systems.
- **Suggested command:** `/normalize`

---

**[M-04] Hard-coded colors throughout inline styles bypass the token system**
- **Location:** `faq.html:381` (`#cfcfcf`, `#000`), `faq.html:372` (`#000`), `inquiry_modal.css:95` (`rgba(212, 175, 55, 0.2)`), wine detail pages (many instances)
- **Severity:** Medium
- **Category:** Theming
- **Description:** Raw hex colors appear in inline styles and CSS: `#000`, `#cfcfcf`, `#e6e6e6`, `#06C755` (LINE brand color), `#5e0d0d`. These won't respond to theme changes. `#000` pure black violates the "never pure black" guideline.
- **Impact:** Footer text (`#cfcfcf` on `#000` background) becomes invisible in alternate themes. Buttons don't update on theme switch.
- **Recommendation:** Replace with token references. LINE green (`#06C755`) is a brand constraint and acceptable; all others should use `var(--md-sys-color-*)`.
- **Suggested command:** `/normalize`

---

**[M-05] Empty content placeholders left in generated country pages**
- **Location:** `countries/france.html:54–56`, `countries/france.html:62–64`, and other country files
- **Severity:** Medium
- **Category:** Content / SEO
- **Description:** Multiple `<p>` tags and description sections are empty template slots that were never filled. E.g., `<p style="...color: var(--md-sys-color-on-surface-variant)..."></p>`.
- **Impact:** Google sees thin content. Screen readers announce empty paragraphs. Visible whitespace gaps appear.
- **Recommendation:** Populate descriptions in `build-wine-catalog.js` from JSON data, or remove the empty elements from the template entirely.
- **Suggested command:** `/clarify`

---

**[M-06] Playfair Display referenced in FAQ but not loaded**
- **Location:** `faq.html:52–53` (inline style references `font-family: 'Playfair Display', serif`)
- **Severity:** Medium
- **Category:** Typography
- **Description:** The FAQ page uses Playfair Display in section headers and the page title, but the font is never linked. `dark-luxury.css` contains no `@import`. The font falls back to generic `serif`.
- **Impact:** The intended editorial luxury aesthetic is lost — section headers render in browser-default serif.
- **Recommendation:** Add to `faq.html` head: `<link rel="preconnect" href="https://fonts.googleapis.com">` + `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">`.
- **Suggested command:** `/typeset`

---

**[M-07] Pure black `rgb(0 0 0)` in shadow and scrim tokens**
- **Location:** `css/light.css:33–34`, `css/dark.css:27–28`
- **Severity:** Medium
- **Category:** Theming
- **Description:** `--md-sys-color-shadow` and `--md-sys-color-scrim` are defined as pure `rgb(0 0 0)` in both themes. Pure black never appears in nature and creates harsh, flat shadows.
- **Impact:** Card shadows and overlay scrims look "digital" rather than warm and organic — misaligned with a luxury wine brand.
- **Recommendation:** Use a warm tinted dark: `rgb(10 5 8)` for the luxury theme, complementing the wine-red palette.
- **Suggested command:** `/normalize`

---

**[M-08] Score display is the exact hero-metrics anti-pattern**
- **Location:** `wines_noprice/di-almaviva-15-almaviva-2015.html:74–79` and wine detail pages generally
- **Severity:** Medium
- **Category:** Anti-Pattern / Design
- **Description:** `.score-bar` section: large score number, small critic label, horizontal row of score items on a wine-red bar with gold border. This is the verbatim "hero metric layout template" anti-pattern.
- **Impact:** Looks template-generated. Any AI-generated wine site would look identical.
- **Recommendation:** Present scores in a more editorial manner — inline within tasting notes prose, or as a minimal sidebar element without the bar template.
- **Suggested command:** `/critique` then `/bolder`

---

**[M-09] Nav glassmorphism applied universally without purpose**
- **Location:** All pages — `backdrop-filter: blur(10px)` on sticky nav
- **Severity:** Medium
- **Category:** Anti-Pattern / Performance
- **Description:** `backdrop-filter: blur()` is applied to the nav on every single page as a default. The guideline flags glassmorphism used "decoratively rather than purposefully."
- **Impact:** Performance cost (GPU-composited layer on every scroll); visual noise on dark backgrounds; mismatch on pages where the nav scrolls over wine images.
- **Recommendation:** Use a solid surface color instead: `background: var(--md-sys-color-surface-container)` with `border-bottom`. Reserve blur for modals where layering context is meaningful.
- **Suggested command:** `/quieter`

---

**[M-10] Touch targets too small on theme toggle button**
- **Location:** All pages — `button#theme-toggle: padding: 8px 12px`
- **Severity:** Medium
- **Category:** Accessibility / Responsive
- **Description:** The theme toggle button's resulting tap target is approximately 36×32px — below the 44×44px minimum.
- **Impact:** Mobile users frequently miss the button, especially on smaller screens.
- **WCAG/Standard:** WCAG 2.1 SC 2.5.5 (Target Size) — Level AA
- **Recommendation:** Increase to `min-width: 44px; min-height: 44px; padding: 10px 14px`.
- **Suggested command:** `/adapt`

---

### Low-Severity Issues

---

**[L-01] Animated GIF in deploy (`SPbackground.gif`)**
- **Location:** `deploy/img/SPbackground.gif`
- **Severity:** Low
- **Category:** Performance
- **Description:** An animated GIF is present in the deploy folder. GIFs are uncompressed and typically 5–20× larger than equivalent WebP/AVIF animations.
- **Recommendation:** Convert to animated WebP or CSS animation. Verify if it's even referenced by any page.
- **Suggested command:** `/optimize`

---

**[L-02] 633+ triplicate HTML files (wines/, wines_noprice/, wines_price/)**
- **Location:** `deploy/wines/`, `deploy/wines_noprice/`, `deploy/wines_price/`
- **Severity:** Low
- **Category:** Performance / Maintenance
- **Description:** Each wine exists in three directory variants. This triples deploy folder size and SEO footprint without clear canonical differentiation.
- **Impact:** Search engines may flag duplicate content; deploy upload time tripled; unclear which URL to canonicalize.
- **Recommendation:** Add canonical `<link>` tags pointing the price/noprice variants to the canonical wine URL. Confirm whether all three directories need to be publicly accessible.
- **Suggested command:** SEO/build script review

---

**[L-03] Browser selection highlight color (`#b3d4fc`) doesn't match brand**
- **Location:** `css/style.css:28–35`
- **Severity:** Low
- **Category:** Theming
- **Description:** HTML5 Boilerplate default `::selection { background: #b3d4fc }` (blue) is unchanged. The brand uses purple/gold.
- **Recommendation:** `::selection { background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); }`
- **Suggested command:** `/normalize`

---

**[L-04] `<hr>` uses hardcoded `#ccc` color**
- **Location:** `css/style.css:45`
- **Severity:** Low
- **Category:** Theming
- **Description:** `border-top: 1px solid #ccc` on `<hr>` doesn't respond to theme changes.
- **Recommendation:** Replace with `border-top: 1px solid var(--md-sys-color-outline-variant)`.
- **Suggested command:** `/normalize`

---

**[L-05] Emojis in section headers break formal tone**
- **Location:** `faq.html:264,304,347` — `🌡️`, `📈`, `🛒` in `<h2>` tags
- **Severity:** Low
- **Category:** Design / Brand
- **Description:** Emoji in section headers clash with the declared luxury brand positioning. On some screen readers, emojis are announced verbosely (e.g., "thermometer emoji").
- **Recommendation:** Replace with CSS-driven decorative elements or SVG icons. Or remove entirely — the text is self-explanatory.
- **Suggested command:** `/typeset`

---

**[L-06] `wine_list_price.html` public accessibility unclear**
- **Location:** `deploy/wine_list_price.html`
- **Severity:** Low
- **Category:** Security / Content
- **Description:** A separate price file exists alongside `wine_list.html`. If pricing is meant to be protected (wholesaler-only), this file should not be in the public deploy root.
- **Recommendation:** Confirm if this file should be publicly accessible; if not, remove from deploy or protect with server-side authentication.

---

## Patterns & Systemic Issues

- **Malformed `<linkpreconnect>` tags**: Present in every wine detail page (~250+ files) — a template-level bug in `build-wine-catalog.js`. Fix the template, regenerate to resolve all instances at once.
- **No focus indicators globally**: Zero `:focus-visible` rules across all 10+ CSS files — systemic gap, not isolated.
- **Hard-coded hex colors in inline styles**: Scattered through every major HTML file — not isolated to a single component.
- **Identical card grid template**: Repeated in every `countries/*.html` and `regions/*.html` — same card, same spacing, same shadow.

---

## Positive Findings

- **MD3 token architecture is well-structured** — light/dark properly separated, semantic token names used throughout `style.css`
- **Rich structured data** — FAQPage, HowTo, CollectionPage, LocalBusiness schema all correctly implemented — excellent GEO/SEO foundation
- **Fluid typography with `clamp()`** — page titles use fluid sizing correctly (`clamp(2rem, 4vw, 3rem)`)
- **`.visually-hidden.focusable` class exists** — the skip link infrastructure is already in `style.css`, just not wired up
- **WebP images alongside PNG** — `*_wine_map.webp` variants exist for all maps, showing performance awareness
- **Semantic HTML structure** — `<main>`, `<nav>`, `<section>`, `<footer>` used correctly on FAQ and how-to pages
- **`dark-luxury.css` is the right brand direction** — gold + deep burgundy + dark background is appropriate for premium wine import; needs less AI-template execution

---

## Recommendations by Priority

### Immediate — Critical blockers
1. Fix malformed `<linkpreconnect>` tags in `build-wine-catalog.js` template and regenerate (affects 250+ pages)
2. Fix `countries/*.html` breadcrumb paths (`../` not `../../`) in build script
3. Convert accordion triggers from `<div onclick>` to `<button>` with ARIA — `faq.html`, `french_wine_knowledge.html`, `how_to_drink_wine.html`
4. Remove `templateGEO.html` and `*.psd` from deploy exclusion list in `prepare-deployment.js`

### Short-term — This sprint
5. Add global `:focus-visible` styles to `style.css`
6. Add skip navigation link to all page templates
7. Add `loading="lazy"` to all below-fold images in build templates
8. Fix `lang="en"` on `404.html`
9. Add mobile hamburger nav with media query at 640px
10. Load Playfair Display in `faq.html` head

### Medium-term — Next sprint
11. Unify the two design systems — map luxury vars to MD3 tokens
12. Replace hard-coded hex colors with token references in all inline styles
13. Fix `max-height` accordion with `grid-template-rows` animation
14. Add `font-family` to base `css/style.css`
15. Fill empty `<p>` description placeholders in country page templates
16. Remove glassmorphism from nav; use solid surface container color

### Long-term
17. Redesign card grid with varied card sizes and editorial layout — escape the identical grid
18. Rethink score display away from hero-metrics template
19. Audit and consolidate `wines/`, `wines_noprice/`, `wines_price/` with proper canonicalization
20. Replace animated GIF with WebP or CSS animation

---

## Suggested Commands for Fixes

| Command | Addresses |
|---|---|
| `/harden` | C-02 (ARIA accordion), C-03 (CSP onclick), C-04 (lang attr), H-01 (focus indicators), H-02 (skip link) |
| `/adapt` | H-06 (mobile nav), M-10 (touch targets) |
| `/normalize` | M-02 (variable duplication), M-03 (dual design systems), M-04 (hardcoded colors), M-07 (pure black tokens), L-03 (selection color), L-04 (hr color) |
| `/optimize` | H-03 (lazy loading), L-01 (animated GIF) |
| `/animate` | H-07 (max-height accordion) |
| `/typeset` | M-01 (no base font-family), M-06 (missing Playfair load), L-05 (emojis in headers) |
| `/clarify` | M-05 (empty content placeholders), C-04 (404 copy) |
| `/quieter` | M-09 (glassmorphism nav), M-08 (score bar) |
| `/critique` then `/bolder` | M-08 (hero metrics anti-pattern), identical card grids |
