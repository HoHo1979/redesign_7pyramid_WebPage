# Design System Inspired by The Wine Collective

## 1. Visual Theme & Atmosphere

The Wine Collective is a premium Australian online wine retailer (est. 1946) built on Shopify. The design operates on an **elegant, restrained palette** anchored by deep navy teal (`#11324B`) and warm cream (`#E8E0D4`), with a wine-burgundy accent (`#6B2737`) reserved for calls-to-action and sale highlights. The overall mood is **classic, trustworthy, and sophisticated** — closer to a curated wine cellar than a discount marketplace.

The entire site uses a single font family — **Montserrat** — across all contexts: headings, body, navigation, buttons, and captions. Differentiation comes through weight variation (400–700) and text-transform rather than font pairing. The result is a clean, unified typographic voice that lets wine imagery and photography carry the visual weight.

The background strategy alternates between pure white (`#FFFFFF`) for product grids and a warm parchment cream (`#F6F3EE` / `#E8E0D4`) for section dividers and collection banners, creating a subtle warmth that avoids the sterile feel of a pure-white ecommerce layout. The deep navy teal (`#11324B`) appears in the announcement bar, footer, and primary buttons — grounding the page with authority.

### Key Characteristics

- Deep navy teal (`#11324B`) as the primary dark/brand color — used for announcement bar, footer, buttons
- Wine burgundy (`#6B2737`) as the singular accent — CTAs, SALE highlights, promotional banners
- Warm cream/parchment tones (`#E8E0D4`, `#F6F3EE`) for secondary backgrounds
- Montserrat as the sole typeface — unity through weight variation, not font pairing
- Shopify-based ecommerce with product-image-first card layouts
- Pill-shaped (100px radius) CTA buttons
- Near-black text (`#07141E`) — warm, with a slight blue undertone
- Photography-driven product presentation with circular category thumbnails
- Scrolling trust bar with emoji-accented social proof stats

---

## 2. Color Palette & Roles

### Primary Brand

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--color-button` | `#11324B` | `rgb(17, 50, 75)` | Primary buttons, announcement bar, footer, nav drawer |
| `--color-button-hover` | `#22445E` | `rgb(34, 68, 94)` | Button hover state — lighter navy |
| Accent / CTA | `#6B2737` | `rgb(107, 39, 55)` | SHOP NOW buttons, SALE nav text, promotional sticky banner |

### Text Scale

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--color-foreground` | `#07141E` | `rgb(7, 20, 30)` | Primary text, headings, body — warm near-black with blue undertone |
| `--color-foreground-secondary` | `#07141E` | `rgb(7, 20, 30)` | Secondary text (same value — no visible secondary distinction) |
| `--color-foreground-title` | `#07141E` | `rgb(7, 20, 30)` | Title text |
| Nav link default | `#333333` | `rgb(51, 51, 51)` | Navigation menu links |
| RRP / compare price | `#9B9B9B` | `rgb(155, 155, 155)` | Crossed-out original price (strikethrough) next to sale price |

### Surfaces & Backgrounds

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--color-background` | `#FFFFFF` | `rgb(255, 255, 255)` | Page background, header, product grid |
| `--color-background-secondary` | `#E8E0D4` | `rgb(232, 224, 212)` | Warm cream — button text color, secondary surfaces |
| `color-background-2` | `#11324B` | `rgb(17, 50, 75)` | Announcement bar, footer |
| `color-background-6` | `#F6F3EE` | `rgb(246, 243, 238)` | Collection banner background, breadcrumb area |
| `color-background-4` | `#11324B` | `rgb(17, 50, 75)` | Dark sections (same as -2) |
| Parchment light | `#F2ECE5` | `rgb(242, 236, 229)` | Alternate warm background sections |

### Borders & Inputs

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--color-border` | `#D3DADF` | `rgb(211, 218, 223)` | General borders — cool gray |
| `--color-border-input` | `#D3DADF` | `rgb(211, 218, 223)` | Input field borders |
| `--color-background-input` | `#FFFFFF` | `rgb(255, 255, 255)` | Input backgrounds |

### Badges & Accents

| Token | Hex | RGB | Role |
|---|---|---|---|
| `--color-badge-background` | `#6B2737` | `rgb(107, 39, 55)` | Badge backgrounds — wine burgundy |
| `--color-badge-text` | `#FFFFFF` | `rgb(255, 255, 255)` | Badge text — white |
| `--color-accent` | `#D3DADF` | `rgb(211, 218, 223)` | Accent token (same as border — subtle gray) |

### Special

| Color | Hex | RGB | Role |
|---|---|---|---|
| Wishlist background | `#203048` | `rgb(32, 48, 72)` | Wishlist floating button (Swym) |
| Wishlist badge | `#FF4500` | `rgb(255, 69, 0)` | Notification count badge |
| Overlay | `rgba(0,0,0,0.3–0.5)` | — | Modal/filter overlays |

---

## 3. Typography Rules

### Font Family

- **Primary (all uses):** `Montserrat, sans-serif`
- No secondary font — Montserrat is used for headings, body, navigation, buttons, captions, and all UI elements
- Load from Google Fonts: weights 400, 500, 600, 700

### Hierarchy

| Role | Font Size | Weight | Line Height | Letter Spacing | Text Transform | Notes |
|---|---|---|---|---|---|---|
| Page H1 | 36–40px | 600 | 1.3 | -0.3em (CSS var) | none | Collection/page titles |
| Section H2 | 28–32px | 600 | 1.3 | — | none | Section headings like "Shop Your Favourites" |
| Card H3 | 22–24px | 600 | 1.3 | — | none | Subsection headings |
| Product Title | 16px | 600 | ~1.43 (22.86px) | normal | none | Product card name |
| Body / Paragraph | 16px | 400 | 1.4 (22.4px) | normal | none | Standard body text, descriptions |
| Navigation Links | 14.2px | 500 | normal | normal | uppercase | Main menu items |
| Breadcrumbs | 14px | 400 | normal | normal | none | Breadcrumb navigation |
| Announcement Bar | 14px | 400 | normal | normal | none | Top banner text (white on navy) |
| Product Region | 12px | 400 | normal | normal | uppercase | Wine region subtitle on product cards |
| Product Price | 18px | 500 | normal | normal | none | Current price |
| Price /BTL label | 14px | 400 | normal | normal | none | Per-bottle label |
| Filter Label | 14px | 600 | normal | normal | uppercase | "FILTER" toolbar text |
| Footer Heading | 16px | 600 | normal | -0.48px | none | Footer section titles |
| Footer Links | 16px | 400 | normal | normal | none | Footer navigation links (white) |
| Subtitle (CSS var) | ~1.17 scale | 600 | — | — | uppercase | Subtitle/overline text |

### Principles

- **Single font family** — all differentiation comes from weight (400–700) and text-transform
- **Weight 600 dominates headings** — used for h1–h3, product titles, footer headings, filter labels
- **Weight 500 for navigation and prices** — a middle ground between body and heading emphasis
- **Weight 400 for body and supporting text** — descriptions, breadcrumbs, announcements
- **Uppercase sparingly** — navigation links, region labels, filter labels, subtitles only
- **Negative letter-spacing on large headings** — `-0.3em` on heading CSS variable (very tight on display sizes)
- **Consistent line-height** — body at 1.4, headings at 1.3

---

## 4. Component Stylings

### Buttons

**Primary CTA (SHOP NOW)**
- Background: `#6B2737` (wine burgundy)
- Text: `#FFFFFF` (white)
- Border-radius: `100px` (full pill shape)
- Padding: `16px 40px`
- Font: Montserrat 700, 16px
- Text-transform: none (but visually uppercase in content)
- Includes arrow icon (`→`) inline

**Standard Primary Button**
- Background: `rgb(17, 50, 75)` / `#11324B` (navy teal)
- Text: `rgb(232, 224, 212)` / `#E8E0D4` (warm cream)
- Hover: `rgb(34, 68, 94)` / `#22445E`
- Border-radius: `60px` (pill)
- Font: Montserrat 600, 15px, uppercase
- Letter-spacing: `-0.15px`

**Secondary & Tertiary Buttons**
- Same navy background and cream text as primary
- Consistent hover treatment

### Product Cards

- Background: white, no visible border or shadow (flat design)
- Product image: contained, with slight rounded corners
- Wishlist heart: circular button overlaid on top-right of image
- Heart icon color: dark teal (`#11324B`), circle bg: white with subtle border
- Layout: image → region label (uppercase, 12px) → title (600, 16px) → star rating → price
- Star ratings: golden/amber stars with review count text
- Price: `$XX /BTL` with optional `RRP $XX.XX` strikethrough

### Navigation

- **Announcement bar**: `#11324B` navy background, white text, 40px height, 14px font
- **Header**: white background, centered search bar, logo left, account/cart icons right
- **Main nav**: horizontal menu below header, 14.2px Montserrat weight 500, uppercase
- **SALE link**: styled with `#6B2737` wine burgundy color and bold weight (inline `<font>` override)
- **Dropdown menus**: mega-menu style with automatic sub-categories
- **Search bar**: full-width input with magnifying glass icon, placeholder text, border: `#D3DADF`

### Footer

- Background: `#11324B` (navy teal)
- Text: white (`#FFFFFF`)
- Headings: 16px, weight 600, letter-spacing -0.48px
- Links: 16px, weight 400, white
- Multi-column layout with link groups

### Trust/Social Proof Bar

- Scrolling horizontal ticker between hero and content
- White/light background
- Emoji + bold stat text (e.g., "98% satisfaction rating", "79 years young")
- Separated by vertical pipe dividers

### Collection Banner

- Background: `#F6F3EE` (warm parchment)
- Contains breadcrumbs and collection H1 title
- Full-width with page-width padding

### Promotional Sticky Banner

- Fixed to bottom-left of viewport
- Background: `#6B2737` (wine burgundy)
- White text: "$20 OFF"
- Dismissible with close (X) button

---

## 5. Layout Principles

### Spacing System

- `--spaced-section`: `5rem`–`16rem` (80–256px) — vertical spacing between major sections (varies by page; homepage uses 16rem, collection pages use 5rem)
- Container padding: `0 80px` on desktop
- Product grid gap: consistent gutters between 4-column product cards

### Grid & Container

- **Max page width**: `1920px`
- **Page padding**: `80px` horizontal on desktop
- **Announcement bar height**: `40px`
- **Header height**: `130px` (includes nav rows)
- **Product grid**: 4 columns on desktop
- **Hero/slideshow**: ~565px height, full-width with content split (text left, image right)

### Whitespace Philosophy

- **Generous section spacing** — 5rem (80px) between major sections creates a relaxed, premium browsing pace
- **Warm background alternation** — white and cream sections create visual rhythm without borders
- **Product density** — cards are moderately spaced; imagery is the primary visual element
- **Announcement bar is compact** — 40px; header area is substantial at 130px including nav

### Border Radius Scale

| Use | Radius |
|---|---|
| CTA Buttons | `100px` (full pill) |
| Standard Buttons | `60px` (pill) |
| Product images | Subtle rounding (~4–8px) |
| Search input | Standard input rounding |
| Wishlist heart button | `50%` (circle) |
| Cards | No visible radius (flat) |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat (Level 0) | No shadow | Product cards, page sections, collection banners |
| Subtle (Level 1) | Light border or shadow | Search bar, filter dropdowns |
| Overlay (Level 2) | `rgba(0,0,0,0.3–0.5)` | Modal overlays, filter sidebar backdrop |
| Floating (Level 3) | Elevated with shadow | Wishlist floating button, sticky promo banner |

### Shadow Philosophy

The Wine Collective uses a predominantly **flat design approach** — product cards have no visible box-shadow or border. Elevation is reserved for floating interactive elements (wishlist button, promo banner) and overlay states (filter sidebar). This flatness keeps the focus on product photography and creates a clean, gallery-like browsing experience.

---

## 7. Do's and Don'ts

### Do

- Use `#07141E` (warm near-black with blue undertone) for all text — never pure `#000000`
- Use `#11324B` (navy teal) for primary structural elements: announcement bar, footer, standard buttons
- Use `#6B2737` (wine burgundy) only for CTAs, sale highlights, and promotional elements — it's the singular accent
- Use Montserrat exclusively — differentiate via weight (400–700) and text-transform, not font pairing
- Use pill-shaped buttons (`60–100px` border-radius) for all CTAs
- Alternate between white and warm cream (`#F6F3EE` / `#E8E0D4`) backgrounds to create section rhythm
- Keep product cards flat (no shadow) — let photography carry the visual weight
- Use uppercase sparingly: navigation, region labels, filter labels, subtitles
- Use `#E8E0D4` warm cream as button text on dark backgrounds — not pure white for standard buttons

### Don't

- Don't introduce additional fonts — Montserrat handles all typographic needs
- Don't use pure black (`#000000`) for text — always use the warm near-black `#07141E`
- Don't use pure white (`#FFFFFF`) for button text on navy — use the warm cream `#E8E0D4`
- Don't apply wine burgundy (`#6B2737`) to large surfaces or backgrounds (except small promo banners)
- Don't add box-shadows to product cards — the design is intentionally flat
- Don't use squared-off buttons — all CTAs use pill/rounded shapes
- Don't use multiple accent colors — `#6B2737` is the singular warm accent against the cool navy palette
- Don't use thin font weights (300) — minimum is 400 for body, 500 for navigation, 600 for headings

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | <768px | Single column products, hamburger nav, stacked hero |
| Tablet | 768–1024px | 2-column product grid, condensed header |
| Desktop | 1024–1440px | 4-column grid, full horizontal nav, side-by-side hero |
| Large Desktop | 1440–1920px | Same layout, increased padding |
| Max | >1920px | Capped at 1920px max-width |

### Collapsing Strategy

- **Product grid**: 4 → 2 → 1 columns
- **Navigation**: horizontal menu → hamburger drawer with accordion sub-menus
- **Hero slideshow**: split layout → stacked (text above image)
- **Trust bar**: horizontal scroll at all sizes
- **Container padding**: 80px → reduced on smaller screens

---

## 9. Agent Prompt Guide

### Quick Color Reference

| Element | Color |
|---|---|
| Background | `#FFFFFF` (white) |
| Text | `#07141E` (warm near-black) |
| Primary dark | `#11324B` (navy teal) |
| Primary dark hover | `#22445E` (lighter navy) |
| CTA accent | `#6B2737` (wine burgundy) |
| Secondary background | `#E8E0D4` (warm cream) |
| Light surface | `#F6F3EE` (parchment) |
| Border | `#D3DADF` (cool gray) |
| Button text on dark | `#E8E0D4` (warm cream) |
| Footer/bar text | `#FFFFFF` (white) |
| Nav links | `#333333` (dark gray) |

### Example Component Prompts

**"Create a product card"**: White background, no shadow. Wine bottle image top (~250px height). Below image: region label in 12px Montserrat 400 uppercase `#07141E`, product name in 16px Montserrat 600, star rating row in amber/gold, price as `$XX /BTL` in 18px weight 500 with optional strikethrough `RRP $XX.XX`. Wishlist heart circle top-right of image.

**"Design the navigation bar"**: 40px navy (`#11324B`) announcement bar with white 14px text. Below: white header with logo left (Montserrat, EST 1946 THE WINE COLLECTIVE), centered search input, account/wishlist/cart icons right. Below header: horizontal nav with 14px Montserrat weight 500 uppercase links. SALE link in `#6B2737` bold.

**"Build a CTA button"**: `#6B2737` background, white text, 100px border-radius pill, 16px 40px padding, Montserrat 700 16px. Include right arrow (`→`). Hover: slightly lighter burgundy.

**"Create a page section"**: Alternate between `#FFFFFF` and `#F6F3EE` backgrounds. Section heading: Montserrat 600, 28–32px, `#07141E`. 80px vertical padding between sections. 80px horizontal padding, max 1920px width.

**"Design the footer"**: `#11324B` navy background. Multi-column link layout. Headings: 16px Montserrat 600 white, letter-spacing -0.48px. Links: 16px Montserrat 400 white.

### Iteration Guide

- Start with white canvas — warm cream alternation creates section rhythm
- Navy teal (`#11324B`) is the structural anchor — bar, footer, buttons
- Wine burgundy (`#6B2737`) is the singular accent — CTAs and sale highlights only
- Montserrat at 400–700 weight handles all typography
- Flat product cards with no shadow — photography is the hero
- Pill-shaped buttons at 60–100px radius
- Warm cream (`#E8E0D4`) for button text on navy — not stark white
- 80px section spacing and horizontal padding on desktop
