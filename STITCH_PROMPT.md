# Stitch Prompt: SevenPyramidReDesign

**Project Name:** SevenPyramidReDesign

Redesign the Seven Pyramid website (a strict luxury Taiwan-based wine import business) focusing on editorial elegance and avoiding common AI-generated UI patterns. Keep the existing static architecture (we will keep the original functional content in the `deploy` folder and just apply this new redesigned CSS/HTML from Stitch). 

**DESIGN SYSTEM (REQUIRED):**
- **Platform:** Web, Desktop-first (responsive to Mobile with functional Hamburger Menu)
- **Theme:** Light / Dark strictly using the allowed tokens. Do NOT use glowing gold accents or radial gradients.
- **Backgrounds:** `#FFFFFF` (Primary Base), `#F6F3EE` or `#E8E0D4` (Secondary Warming section backgrounds)
- **Primary Accent / Buttons:** `#11324B` (hover: `#22445E`), with rare singular CTA accent `#6B2737`
- **Text Primary:** `#07141E` (Never pure `#000000`)
- **Text Inverse:** `#FFFFFF` (Only on dark backgrounds)
- **Shadows:** `--color-shadow-luxury` `rgba(10, 5, 8, 0.15)` (Never pure black drop shadows)
- **Selection Color:** `#11324B` (to overwrite generic blue)
- **Typography:** ONLY `Montserrat, sans-serif`. Do not include fallback serifs. 
  - H1: 36-40px (600 weight, LH 1.3)
  - H2: 28-32px (600 weight, LH 1.3)
  - Card Title: 16-18px (600 weight, LH 1.4)
  - Body: 16px (400 weight, LH 1.4)
  - Categories: 12-14px (500-600 weight, uppercase)

**CRITICAL RULES & ANTI-PATTERNS TO AVOID (From improveUI.md Audit):**
1. 🚫 **No Glassmorphism:** Never use `backdrop-filter: blur()`. The navigation bar must use a solid semantic surface with a bottom border instead.
2. 🚫 **No Emojis:** Do not place emojis in headers or structured text.
3. 🚫 **No Centered Layouts:** Abandon the "hero metric layout" where everything is center-aligned. Use asymmetric, editorial, left-aligned typography like a high-end print magazine.
4. 🚫 **No Identical Auto-Fill Grids:** The wine catalog must NOT use a repetitive 3 or 4-column grid of identically sized cards. Use varied card sizes, masonry layouts, or rich inline storytelling.
5. 🚫 **No Score/Metric Loading Bars:** Remove large score numbers with colored "progress bars" (hero-metrics anti-pattern). Present scores in an editorial manner, inline with tasting notes.
6. 🚫 **No Gradients:** Do not use `radial-gradient` or continuous CSS animations. Use the subtle alternating background colors provided above.
7. 🚫 **No Pure Round Rects + Generic Shadow:** Use flat, restrained depth. For interactive elevated elements, use only the defined warm luxury shadow.

**Page Structure Needed:**
1. **Header:** Left-aligned logo, navigation links (solid background, no glassmorphism), theme toggle. On mobile (<640px), replace links with a functional Hamburger Menu (`☰`). Include a visually hidden "Skip to main content" link.
2. **Hero Section:** Left-aligned typography, generous white-space (margin/padding like 80px between major sections), overlapping editorial imagery, solid background.
3. **Wine Collection Showcase:** Mixed display (e.g., large cellar feature image alongside smaller featured wines). Editorial flow rather than uniform grids.
4. **Wine Detail / Scores:** Minimal, text-driven presentation of vintage/tasting notes. 
5. **Footer:** Simple, high-contrast using `#11324B` or `#07141E` background with `#FFFFFF` text.

**Accessibility Requirements:**
- All interactive elements must explicitly declare `:focus-visible { outline: 2px solid #11324B; outline-offset: 2px; }`.
- Ensure buttons use `<button>` tags (not `div onclick`).
- All images must support `loading="lazy"`.

---
💡 **Developer Note:** We are creating this as a new Stitch project named `SevenPyramidReDesign`. Once Stitch generates the HTML/CSS based on this prompt, we will map these new tokens and layouts over the existing JSON-generated content in the `deploy/` directory to preserve routing, SEO mapping, and backend scripts.
