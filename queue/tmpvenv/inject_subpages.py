"""
inject_subpages.py
Injects the Monolithic Archive design system header/footer/age-gate snippet
into all countries/*.html and wines/*.html sub-pages WITHOUT destroying their
existing product data or internal link structure.

Strategy:
  - Replace the old <head> CSS links with the new Tailwind + Montserrat stack
  - Replace the old inline <nav> with the shared Monolithic Archive header
  - Append the shared footer + age-gate + scripts
  - Patch wine card styles to match the new design tokens
"""

import bs4, copy, glob, re, os

DEPLOY = '../../deploy'

# ─── Load reference index.html for shared components ───────────────────────
print("Loading reference index.html …")
with open(f'{DEPLOY}/index.html', 'r', encoding='utf-8') as f:
    idx_soup = bs4.BeautifulSoup(f.read(), 'html.parser')

# ─── Build shared head <link>/<script> injection string ────────────────────
FONTS_LINK = '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>'
MATERIAL_LINK = '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>'
TAILWIND_SCRIPT = '<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>'

# Grab tailwind config block from index
tw_config_tag = idx_soup.find('script', id='tailwind-config')
TW_CONFIG = str(tw_config_tag) if tw_config_tag else ''

BASE_STYLE = """<style>
  body { font-family: 'Montserrat', sans-serif; background-color: #FFFFFF; }
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48; }
  #age-gate-banner { position: fixed; bottom: 0; left: 0; width: 100%; background-color: #11324b; color: #fff; text-align: center; padding: 15px; z-index: 1001; }
  #age-gate-banner p { margin: 0; font-size: 1.5em; font-weight: bold; }
</style>"""

AGE_GATE_HTML = """<div id="age-gate-banner"><p>開車不喝酒，未滿18歲不可飲酒</p></div>"""

HEADER_HTML = str(idx_soup.find('header'))
MOBILE_OVERLAY_HTML = str(idx_soup.find('div', id='mobile-menu-overlay'))
FOOTER_HTML = str(idx_soup.find('footer'))

# Scripts - adjust paths for sub-directories
SCRIPTS_HTML = '<script src="../js/app.js"></script>\n<script src="../js/csp-fix.js"></script>'

# ─── Wine card patch CSS (replaces the old rounded card style) ─────────────
WINE_CARD_PATCH = """<style>
  /* Monolithic Archive wine card override */
  div[style*="border-radius: 15px"] {
    border-radius: 0 !important;
    background: #F6F3EE !important;
    border: 1px solid rgba(17,50,75,0.08) !important;
    box-shadow: none !important;
  }
  div[style*="border-radius: 15px"] h4 a { color: #11324B !important; }
  div[style*="border-radius: 15px"] span[style*="font-weight: 700"] { color: #6B2737 !important; }
  .region-header {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    letter-spacing: 0.3em !important;
    text-transform: uppercase !important;
    color: #6B2737 !important;
    border-bottom: 1px solid rgba(17,50,75,0.1) !important;
    padding-bottom: 16px !important;
    margin-bottom: 24px !important;
  }
  .breadcrumb a { color: #11324B; }
  main { padding-top: 5rem !important; }
</style>"""

# ─── Process files ──────────────────────────────────────────────────────────
def fix_header_hrefs(html_str, depth=1):
    """Adjust relative hrefs for depth (1=countries, 2=wines from root)."""
    prefix = '../' * depth
    # Fix logo href
    html_str = html_str.replace('href="#home"', f'href="{prefix}index.html"')
    html_str = html_str.replace('href="#wines"', f'href="{prefix}wine_list.html"')
    html_str = html_str.replace('href="french_wine_knowledge.html"', f'href="{prefix}french_wine_knowledge.html"')
    html_str = html_str.replace('href="how_to_drink_wine.html"', f'href="{prefix}how_to_drink_wine.html"')
    html_str = html_str.replace('href="faq.html"', f'href="{prefix}faq.html"')
    html_str = html_str.replace('href="#services"', f'href="{prefix}index.html#services"')
    html_str = html_str.replace('href="#contact"', f'href="{prefix}index.html#contact"')
    html_str = html_str.replace('src="img/7pyramidlogo.webp"', f'src="{prefix}img/7pyramidlogo.webp"')
    return html_str

def fix_footer_hrefs(html_str, depth=1):
    prefix = '../' * depth
    html_str = html_str.replace('href="faq.html"', f'href="{prefix}faq.html"')
    html_str = html_str.replace('href="wine_list.html"', f'href="{prefix}wine_list.html"')
    html_str = html_str.replace('href="#services"', f'href="{prefix}index.html#services"')
    return html_str

def inject_page(filepath, depth=1):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = bs4.BeautifulSoup(html, 'html.parser')
    
    # ── 1. Clean old head assets ─────────────────────────────────────────
    head = soup.head or soup.new_tag('head')
    for tag in head.find_all(['link', 'style']):
        if tag.name == 'link' and (tag.get('rel', [''])[0] in ('stylesheet',)):
            tag.decompose()
        elif tag.name == 'style':
            tag.decompose()
    
    # Ensure html lang is set
    soup.html['lang'] = 'zh-TW'
    soup.html['class'] = 'no-js light'
    
    # Inject new fonts + tailwind + config + base style
    for tag_str in [FONTS_LINK, MATERIAL_LINK, TAILWIND_SCRIPT, TW_CONFIG, BASE_STYLE, WINE_CARD_PATCH]:
        head.append(bs4.BeautifulSoup(tag_str, 'html.parser'))
    
    # ── 2. Strip old nav ─────────────────────────────────────────────────
    body = soup.body
    body['class'] = ['text-[#07141E]', 'selection:bg-[#11324B]', 'selection:text-white', 'pb-16']
    
    # Remove old nav-style elements
    for nav in body.find_all('nav'):
        nav.decompose()
    for div in body.find_all('div', id='mobile-menu-overlay'):
        div.decompose()
    for div in body.find_all('div', id='age-gate-banner'):
        div.decompose()
    for footer in body.find_all('footer'):
        footer.decompose()
    # Remove old script links
    for script in body.find_all('script', src=True):
        if 'app.js' in script.get('src', '') or 'csp-fix' in script.get('src', ''):
            script.decompose()
    
    # ── 3. Prepend new components ─────────────────────────────────────────
    fixed_header = fix_header_hrefs(HEADER_HTML, depth)
    fixed_overlay = fix_header_hrefs(MOBILE_OVERLAY_HTML, depth)
    fixed_footer = fix_footer_hrefs(FOOTER_HTML, depth)
    fixed_scripts = SCRIPTS_HTML.replace('../js/', f'{"../" * depth}js/')
    
    # Insert at top of body
    first_child = body.contents[0] if body.contents else None
    
    for component_str in [AGE_GATE_HTML, fixed_header, fixed_overlay]:
        comp_tag = bs4.BeautifulSoup(component_str, 'html.parser')
        if first_child:
            first_child.insert_before(comp_tag)
        else:
            body.append(comp_tag)
    
    # Append footer + scripts
    body.append(bs4.BeautifulSoup(fixed_footer, 'html.parser'))
    body.append(bs4.BeautifulSoup(fixed_scripts, 'html.parser'))
    
    # ── 4. Write ──────────────────────────────────────────────────────────
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(soup.prettify(formatter='html'))

# Process countries/
country_files = glob.glob(f'{DEPLOY}/countries/*.html')
print(f"\nProcessing {len(country_files)} country pages …")
for fp in sorted(country_files):
    inject_page(fp, depth=1)
    print(f"  ✓  {os.path.basename(fp)}")

# Process wines/
wine_files = glob.glob(f'{DEPLOY}/wines/*.html')
print(f"\nProcessing {len(wine_files)} wine detail pages …")
for i, fp in enumerate(sorted(wine_files)):
    inject_page(fp, depth=1)
    if i % 20 == 0:
        print(f"  ... {i+1}/{len(wine_files)}")

print(f"\n✅  Done! Injected design system into {len(country_files) + len(wine_files)} sub-pages.")

# Process regions/
region_files = glob.glob(f'{DEPLOY}/regions/*.html')
print(f"\nProcessing {len(region_files)} region pages …")
for fp in sorted(region_files):
    inject_page(fp, depth=1)
    print(f"  ✓  {os.path.basename(fp)}")

print(f"\n✅  Grand total: {len(country_files) + len(wine_files) + len(region_files)} sub-pages updated.")
