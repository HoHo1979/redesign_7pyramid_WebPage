<!--
SYNC IMPACT REPORT
Version Change: 0.0.0 -> 1.0.0
Rationale: Initial rigorous definition based on user request to extend brownfield project with SEO/AEO standards.

Modified Principles:
- Defined I. Architecture Integrity & Stability (New)
- Defined II. SEO & AEO First (New)
- Defined III. Material Design 3 Compliance (New)
- Defined IV. Automated Validation & Quality (New)
- Defined V. Performance & Core Web Vitals (New)

Templates Status:
- .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section active)
- .specify/templates/spec-template.md: ✅ Compatible
- .specify/templates/tasks-template.md: ✅ Compatible

Follow-up TODOs:
- None.
-->

# Seven Pyramid Web & App Integration Constitution

## Core Principles

### I. Architecture Integrity & Stability
**Preserve the Hybrid Architecture.**
This is a brownfield project with a stable "Static Anchor + Dynamic App" hybrid architecture (`index.html` + Flutter on `/#/`).
- **Non-Negotiable**: Do NOT change existing working code unless explicitly requested or verified as a bug fix.
- **Rationale**: The project has a specific build system (Webpack + Node.js scripts) and deployment workflow that must remain intact.

### II. SEO & AEO First
**Static Visibility is Paramount.**
All public content, especially the wine catalog, MUST be statically generated and optimized for search engines and AI agents.
- **Rule**: Every wine/product MUST have a corresponding static HTML representation (generated via `build-wine-catalog.js`).
- **Requirement**: Structured Data (JSON-LD) for `Product`, `LocalBusiness`, and `FAQPage` MUST be present and valid per `google_search.md`.

### III. Material Design 3 Compliance
**Consistent UX & Theming.**
All UI additions or modifications MUST adhere to Google's Material Design 3 standards.
- **Rule**: Use CSS variables defined in `css/variables.css` for all styling.
- **Theming**: Changes MUST support both Light and Dark modes (`css/light.css`, `css/dark.css`) via the existing `js/app.js` toggle mechanism.
- **A11y**: Contrast ratios MUST meet WCAG AA standards.

### IV. Automated Validation & Quality
**Trust but Verify.**
Data integrity and security are enforced by automated scripts.
- **Data**: Any change to `wines-data-template.json` MUST pass `npm run validate`.
- **Security**: Any JavaScript change MUST pass `npm run csp-check` to ensure Content Security Policy compliance (no inline handlers).
- **Testing**: `npm run serve` MUST be used to verify the build locally before deployment.

### V. Performance & Core Web Vitals
**Speed is a Feature.**
Performance metrics directly impact search ranking and user retention.
- **CLS**: All images MUST have explicit `width` and `height` attributes to prevent layout shifts.
- **Mobile**: All pages MUST be responsive and pass Google's "Mobile Friendly" test (no horizontal scrolling, touch targets sized correctly).

## Technical Standards & Stack

### Technology Stack
- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+).
- **Build System**: Webpack (Dev/Prod configs), Node.js scripts for static generation.
- **Data Source**: `wines-data-template.json` is the Single Source of Truth for wine data.
- **Integration**: Flutter application hosted at `/#/` (Deep links from static pages required).

### Coding Conventions
- **Style**: Follow existing patterns in `js/` and `css/`.
- **Comments**: Explain *why*, not *what*. Reference `CLAUDE.md` for architectural context.
- **File Structure**: strictly adhere to the folder structure defined in `CLAUDE.md`.

## Development Workflow

### Standard Operating Procedure
1.  **Plan**: Consult `CLAUDE.md` and `googleSearchConsole/google_search.md` before starting.
2.  **Develop**: Use `npm start` for hot reload.
3.  **Verify**: Run `npm run validate` and `npm run csp-check`.
4.  **Build**: Run `npm run build:wine` (if data changed) and `npm run prepare-deploy`.

## Governance

This Constitution supersedes all other generic coding standards.
- **Amendments**: Changes to these principles require explicit user approval and a version bump.
- **Compliance**: All Pull Requests and Code Changes MUST be checked against these 5 principles.

**Version**: 1.0.0 | **Ratified**: 2025-12-17 | **Last Amended**: 2025-12-17