# Design System Inspired by The Wine Collective (Strict Luxury Refining)

## Overview & The Verdict

This iteration establishes a **strict luxury, elegant, and restrained palette** for Seven Pyramid. It maintains the core identity (from `seven_pyramid/DESIGN.md`) while aggressively rooting out the "AI-generated" anti-patterns highlighted in `improveUI.md`.

**CRITICAL MANDATES & ANTI-PATTERN AVOIDANCE:**
- 🚫 **No Glassmorphism:** Never use `backdrop-filter: blur()`. It creates meaningless visual noise. Use solid semantic surface containers with borders.
- 🚫 **No Emojis:** Ban all emojis in headers or structural text. We are a formal luxury brand.
- 🚫 **No Pure Black (`#000` or `rgb(0,0,0)`):** Never use absolute pure black for text, backgrounds, or shadows. Always use a warm, tinted dark color (like `rgb(10 5 8)` or `#07141E`).
- 🚫 **No "Everything Centered":** Abandon textbook, centered "Hero Metric" layouts. Use asymmetric, editorial, left-aligned typography that feels curated like a print magazine.
- 🚫 **No Identical Auto-Fill Grids:** Do not use simple repeating 3 or 4 column grids of identically sized rectangles with generic shadows. Layouts should be dynamic, using masonry, varied card sizes, or rich inline storytelling to display collections.
- 🚫 **No Hard-Coded Hex Colors Inline:** Rely completely on CSS variables (custom properties or MD3 semantic names).
- 🚫 **No Default Font Fallbacks:** Never let the browser default load unstyled serifs. Montserrat is our sole, powerful font family.

---

## 1. Color Palette & Roles

**Primary Brand**
| Token | Var / Value | Role |
|---|---|---|
| `--color-button` | `#11324B` | Primary buttons, announcement bar, footer |
| `--color-button-hover` | `#22445E` | Button hover |
| `--color-accent` | `#6B2737` | Singular CTA/sale accent. Do not use for large blocks |

**Surfaces & Shadows**
| Token | Var / Value | Role |
|---|---|---|
| `--color-background` | `#FFFFFF` | Core page backgrounds |
| `--color-background-secondary` | `#F6F3EE` / `#E8E0D4` | Secondary warming backgrounds. (Alternate with white for section rhythm) |
| `--color-shadow-luxury` | `rgba(10, 5, 8, 0.15)` | **Not pure black!** A warm, tinted black for subtle depth |
| `--color-selection` | `var(--color-button)` | The `::selection` background to overwrite generic blue |

**Typography Colors**
| Token | Var / Value | Role |
|---|---|---|
| `--color-foreground` | `#07141E` | Near-black text. Used everywhere instead of `#000000` |
| `--color-text-inverse` | `#FFFFFF` | Only on dark backgrounds (like the button color) |

---

## 2. Typography Rules

### Single Font Family Strategy

- **Font:** `Montserrat, sans-serif`
- **Rule:** Do not use Playfair Display or any other font. Montserrat alone carries everything across weights (400-700).

### Hierarchy

| Role | Size | Weight | Transformation | Line Height |
|---|---|---|---|---|
| H1 Page | 36-40px | 600 | none | 1.3 |
| H2 Section | 28-32px | 600 | none | 1.3 |
| Card Title | 16-18px | 600 | none | 1.4 |
| Body / P | 16px | 400 | none | 1.4 |
| Categories | 12-14px | 500-600 | **uppercase** | normal |

---

## 3. Depth & Layout Principles (Editorial)

### Flat & Restrained Depth

- Rely heavily on **flat design** using alternate background colors (`#FFFFFF` to `#F6F3EE`) rather than bounding boxes and shadows.
- For interactive elevated elements (like buttons or modails), use the warm shadow token `--color-shadow-luxury` (`rgba(10, 5, 8, 0.15)`), not a generic gray/black drop shadow.

### Editorial Flow

- Break the monotony: Instead of an identical 4-column grid of wines, feature a large image of the cellar next to smaller selected products.
- Incorporate overlapping elements naturally as you would in a magazine layout. Avoid aggressive horizontal stripes.
- **Never center-align all paragraphs.** Align text to the left; use column constraints (e.g. `max-width: 60ch`).

---

## 4. Accessibility & Mobile Features

### Interactive Indicators

- **Focus Visible:** All interactive elements must explicitly declare `:focus-visible { outline: 2px solid var(--color-button); outline-offset: 2px; }`.
- **Keyboard Targets:** No `div onclick="..."`. Only use semantic `<button>` fields for triggers.

### Mobile Navigation

- A functional **Hamburger Menu Trigger** (`☰`) must be present natively on mobile. Do not just let 6 `text` links compress horizontally or wrap poorly.
- Mobile touch targets must be at least 44×44px.

---

## 5. Iteration & Generation Rules for Stitch

- **Think Print:** Pretend you are laying out pages for a high-end print portfolio. Use generous white-space (margin/padding) – e.g., 80px between major sections.
- **Use Valid Forms/Links:** Avoid empty `<a href="#">`. Try to mock out realistic anchor destinations.
- **No Animations/Gradients:** Do not use heavy `radial-gradient` backgrounds or continuous CSS pulse loops. Stillness reflects confidence and luxury.
