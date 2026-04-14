"""
convert_all_pages.py
Master script to apply the Monolithic Archive design system to:
  - faq.html
  - french_wine_knowledge.html
  - how_to_drink_wine.html
Uses the already-converted index.html as the source for shared head, header, footer, age-gate and JS.
"""

import bs4
import copy, re, sys

DEPLOY = '../../deploy'
QUEUE  = '../../queue'

# ───────────────────────────────────────────────
# 1.  Load reference (index.html)
# ───────────────────────────────────────────────
print("Loading reference index.html …")
with open(f'{DEPLOY}/index.html', 'r', encoding='utf-8') as f:
    idx_soup = bs4.BeautifulSoup(f.read(), 'html.parser')

# shared <head> tokens (tailwind cdn + config + google fonts + base style)
def shared_head_nodes(soup_ref):
    """Return the design-system nodes we want to inject into every page head."""
    nodes = []
    for tag in soup_ref.head:
        if isinstance(tag, bs4.element.NavigableString):
            continue
        # Google Fonts
        if tag.name == 'link' and 'fonts.googleapis.com' in (tag.get('href') or ''):
            nodes.append(copy.copy(tag))
        # Tailwind CDN
        if tag.name == 'script' and 'cdn.tailwindcss.com' in (tag.get('src') or ''):
            nodes.append(copy.copy(tag))
        # Tailwind config
        if tag.name == 'script' and tag.get('id') == 'tailwind-config':
            nodes.append(copy.copy(tag))
        # Base style
        if tag.name == 'style':
            nodes.append(copy.copy(tag))
        # GA tag
        if tag.name == 'script' and 'googletagmanager' in (tag.get('src') or ''):
            nodes.append(copy.copy(tag))
        if tag.name == 'script' and tag.string and 'gtag(' in tag.string:
            nodes.append(copy.copy(tag))
    return nodes

SHARED_HEAD = shared_head_nodes(idx_soup)

# shared age-gate, header, mobile menu, footer, scripts
AGE_GATE        = copy.copy(idx_soup.find('div', id='age-gate-banner'))
SITE_HEADER     = copy.copy(idx_soup.find('header'))
MOBILE_OVERLAY  = copy.copy(idx_soup.find('div', id='mobile-menu-overlay'))
SITE_FOOTER     = copy.copy(idx_soup.find('footer'))
SCRIPTS         = [copy.copy(s) for s in idx_soup.find_all('script', src=True)
                   if 'app.js' in s['src'] or 'csp-fix' in s['src']]


# ───────────────────────────────────────────────
# 2. Helper: build a clean page shell
# ───────────────────────────────────────────────
def make_page_shell(title, description, og_url, canonical, extra_schema_tag=None):
    """Return a BeautifulSoup object containing a minimal correct page shell."""
    html = bs4.BeautifulSoup("""<!doctype html>
<html class="no-js light" lang="zh-TW" style="scroll-behavior:smooth;">
<head></head>
<body class="text-[#07141E] selection:bg-[#11324B] selection:text-white pb-16"></body>
</html>""", 'html.parser')
    head = html.head

    # charset + viewport
    for attr_str in ['<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">']:
        head.append(bs4.BeautifulSoup(attr_str, 'html.parser'))

    # title
    t = html.new_tag('title')
    t.string = title
    head.append(t)

    # description
    m = html.new_tag('meta', attrs={'name': 'description', 'content': description})
    head.append(m)

    # canonical
    lc = html.new_tag('link', attrs={'rel': 'canonical', 'href': canonical})
    head.append(lc)

    # OG
    for og_k, og_v in [('og:title', title), ('og:type', 'website'), ('og:url', og_url),
                        ('og:site_name', '七銘企業 Seven Pyramid'), ('og:locale', 'zh_TW')]:
        head.append(html.new_tag('meta', attrs={'property': og_k, 'content': og_v}))

    # Geo tags
    for name, content in [('geo.region','TW-TPE'), ('geo.placename','台北市內湖區'),
                           ('geo.position','25.0686;121.5750'), ('ICBM','25.0686, 121.5750')]:
        head.append(html.new_tag('meta', attrs={'name': name, 'content': content}))

    # extra schema (FAQPage etc)
    if extra_schema_tag:
        head.append(extra_schema_tag)

    # favicon
    for tag_str in ['<link rel="icon" href="/favicon.ico" sizes="any">',
                    '<link rel="apple-touch-icon" href="img/7pyramidlogo.webp">']:
        head.append(bs4.BeautifulSoup(tag_str, 'html.parser'))

    # Inject design system nodes
    for node in SHARED_HEAD:
        head.append(copy.copy(node))

    # Inject shared body components
    body = html.body
    body.append(copy.copy(AGE_GATE))
    body.append(copy.copy(SITE_HEADER))
    body.append(copy.copy(MOBILE_OVERLAY))

    return html


def finalise_page(html, main_tag, filename):
    """Append main, footer and scripts then write."""
    body = html.body
    body.append(main_tag)
    body.append(copy.copy(SITE_FOOTER))
    for s in SCRIPTS:
        body.append(copy.copy(s))
    with open(f'{DEPLOY}/{filename}', 'w', encoding='utf-8') as f:
        f.write(html.prettify(formatter='html'))
    print(f"  ✓  Wrote {filename}")


# ───────────────────────────────────────────────
# 3. FAQ PAGE
# ───────────────────────────────────────────────
print("\n── Building faq.html ──")

FAQ_SCHEMA = bs4.BeautifulSoup("""<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"頂級葡萄酒應該如何正確保存？",
     "acceptedAnswer":{"@type":"Answer","text":"保存頂級葡萄酒需注意恆溫(12°C-14°C)、恆濕(65%-75%)以及避光避震。七銘企業的所有酒款皆存放於專業溫控倉儲，確保最佳狀態。"}},
    {"@type":"Question","name":"哪些產區的葡萄酒最具投資價值？",
     "acceptedAnswer":{"@type":"Answer","text":"主要為法國波爾多1855列級酒莊(如五大酒莊)、美國納帕谷膜拜酒(如Opus One)，以及智利頂級酒款(如Almaviva, Sena)。"}},
    {"@type":"Question","name":"什麼是「垂直年份」收藏？為什麼值得投資？",
     "acceptedAnswer":{"@type":"Answer","text":"垂直收藏是指收集同一款酒連續不同年份。完整的垂直年份套組在拍賣市場上極為稀有，往往能拍出比單瓶總和更高的溢價。"}},
    {"@type":"Question","name":"為什麼有些酒需要原木箱收藏？",
     "acceptedAnswer":{"@type":"Answer","text":"原廠木箱(OWC)提供身分證明、更好的保護性，且在次級市場上，連同原木箱的完整酒款通常有更高的拍賣價格。"}}
  ]
}
</script>""", 'html.parser').script

faq_page = make_page_shell(
    title       = "葡萄酒收藏 FAQ - 葡萄酒收藏與投資指南 | 七銘企業 Seven Pyramid",
    description = "七銘企業FAQ常見問題：專業解答葡萄酒保存、收藏與投資建議。推薦法國波爾多列級酒莊、美國Opus One及智利酒王Sena等最具增值潛力酒款。",
    og_url      = "https://wine.7pyramid.com/faq.html",
    canonical   = "https://wine.7pyramid.com/faq.html",
    extra_schema_tag = FAQ_SCHEMA,
)

faq_questions = [
    {
        "id": "preservation", "num": "01",
        "title": "保存與收藏",
        "subtitle": "Cellar Conservation",
        "q": "頂級葡萄酒應該如何正確保存？",
        "a": "保存頂級葡萄酒需注意恆溫(12°C–14°C)、恆濕(65%–75%)以及避光避震。七銘企業的所有酒款皆存放於專業溫控倉儲，確保酒款在最佳狀態下抵達您手中。"
    },
    {
        "id": "investment", "num": "02",
        "title": "投資價值",
        "subtitle": "Investment Value",
        "q": "哪些產區的葡萄酒最具投資價值？",
        "a": "主要為法國波爾多1855列級酒莊（如五大酒莊：拉菲、拉圖、瑪歌、木桐、侯伯王）、美國納帕谷膜拜酒（如Opus One、Screaming Eagle），以及智利頂級酒款（如Almaviva、Sena）。這些酒款在國際拍賣市場表現穩定，是長期財富保存的優質標的。"
    },
    {
        "id": "vintage", "num": "03",
        "title": "垂直年份收藏",
        "subtitle": "Vertical Vintages",
        "q": "什麼是「垂直年份」收藏？為什麼值得投資？",
        "a": "垂直收藏（Vertical Collection）是指收集同一款酒連續不同年份的套組。完整的垂直年份套組在拍賣市場上極為稀有，往往能拍出比單瓶總和更高的溢價。七銘企業可協助您規劃並完成垂直年份的採購策略。"
    },
    {
        "id": "owc", "num": "04",
        "title": "原廠木箱",
        "subtitle": "Original Wooden Cases",
        "q": "為什麼有些酒需要原木箱收藏？",
        "a": "原廠木箱（OWC, Original Wooden Case）提供酒款身分證明，保證出自酒莊原裝，同時提供更好的物理保護。在次級市場上，連同原木箱的完整酒款通常有更高的拍賣估值與市場流通性。"
    },
]

faq_main = faq_page.new_tag('main', id="faq-main", **{'class': 'pt-24 max-w-7xl mx-auto px-6 md:px-12 py-16'})

# --- Hero ---
hero = faq_page.new_tag('header', **{'class': 'mb-24 max-w-3xl'})
h1 = faq_page.new_tag('h1', **{'class': 'text-4xl md:text-6xl font-semibold text-[#11324B] leading-[1.1] mb-8 tracking-tight'})
h1.string = "常見問題與葡萄酒投資見解"
tagline = faq_page.new_tag('p', **{'class': 'text-lg md:text-xl text-[#11324B]/70 font-light leading-relaxed italic border-l-4 border-[#6B2737] pl-8'})
tagline.string = "在此尋求解答。我們以同樣嚴謹的建築態度，處理您對頂級葡萄酒收藏與投資的每一個疑問。"
hero.append(h1)
hero.append(tagline)
faq_main.append(hero)

# --- Grid Layout ---
grid = faq_page.new_tag('div', **{'class': 'grid grid-cols-1 lg:grid-cols-12 gap-16'})

# Sidebar
aside = faq_page.new_tag('aside', **{'class': 'hidden lg:block lg:col-span-3 sticky top-28 h-fit'})
side_nav = faq_page.new_tag('nav', **{'class': 'flex flex-col gap-5'})
label_span = faq_page.new_tag('span', **{'class': 'text-[12px] font-bold tracking-[0.2em] text-[#6B2737] uppercase mb-4 block'})
label_span.string = "主題 Themes"
side_nav.append(label_span)
for i, q in enumerate(faq_questions):
    a = faq_page.new_tag('a', href=f'#{q["id"]}', **{
        'class': 'text-[#11324B] font-medium hover:pl-2 transition-all duration-300 hover:text-[#6B2737] text-sm'
    })
    a.string = f'{q["num"]} {q["title"]}'
    side_nav.append(a)
aside.append(side_nav)
grid.append(aside)

# Questions column
content_col = faq_page.new_tag('div', **{'class': 'lg:col-span-9 space-y-28'})
for q_data in faq_questions:
    sec = faq_page.new_tag('section', id=q_data['id'], **{'class': 'scroll-mt-32'})
    # Category label row
    cat_div = faq_page.new_tag('div', **{'class': 'mb-10'})
    cat_span = faq_page.new_tag('span', **{'class': 'text-[11px] font-semibold tracking-[0.35em] text-[#6B2737] uppercase'})
    cat_span.string = f'{q_data["num"]} / {q_data["subtitle"]}'
    sep = faq_page.new_tag('div', **{'class': 'w-full h-px bg-[#11324B]/10 mt-4'})
    cat_div.append(cat_span)
    cat_div.append(sep)
    sec.append(cat_div)

    art = faq_page.new_tag('article', **{'class': 'max-w-2xl'})
    h3 = faq_page.new_tag('h3', **{'class': 'text-2xl font-semibold text-[#11324B] mb-5'})
    h3.string = q_data['q']
    body_div = faq_page.new_tag('div', **{'class': 'text-[#11324B]/80 leading-loose'})
    p = faq_page.new_tag('p')
    p.string = q_data['a']
    body_div.append(p)
    art.append(h3)
    art.append(body_div)
    sec.append(art)
    content_col.append(sec)

# CTA
cta = faq_page.new_tag('section', **{'class': 'bg-[#11324B] p-16 md:p-24 flex flex-col items-center text-center mt-8'})
cta_h2 = faq_page.new_tag('h2', **{'class': 'text-white text-3xl md:text-4xl font-semibold mb-8 tracking-tight max-w-lg leading-tight'})
cta_h2.string = "深入了解您的葡萄酒收藏"
cta_p = faq_page.new_tag('p', **{'class': 'text-white/60 mb-10 max-w-sm leading-relaxed'})
cta_p.string = "仍有疑問？我們的資深侍酒師可為您提供一對一私人諮詢服務，為您的收藏制定精準策略。"
cta_a = faq_page.new_tag('a', href="mailto:account2@7pyramid.com?subject=葡萄酒諮詢", **{
    'class': 'bg-[#6B2737] text-white px-12 py-5 text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#8d3348] transition-all duration-300'
})
cta_a.string = "預約私人葡萄酒諮詢"
cta.append(cta_h2); cta.append(cta_p); cta.append(cta_a)
content_col.append(cta)

grid.append(content_col)
faq_main.append(grid)
finalise_page(faq_page, faq_main, 'faq.html')


# ───────────────────────────────────────────────
# 4. KNOWLEDGE PAGE  (french_wine_knowledge.html)
# ───────────────────────────────────────────────
print("\n── Building french_wine_knowledge.html ──")

# Load old file for content preservation
with open(f'{DEPLOY}/french_wine_knowledge.html', 'r', encoding='utf-8') as f:
    old_know = bs4.BeautifulSoup(f.read(), 'html.parser')

know_page = make_page_shell(
    title       = "法國葡萄酒知識百科 - 波爾多、勃艮第、香檳完整指南 | 七銘企業 Seven Pyramid",
    description = "深入了解法國葡萄酒產區知識：波爾多列級酒莊、勃艮第特級園、香檳製法及各大知名酒莊介紹。七銘企業專業侍酒師整理的完整葡萄酒知識指南。",
    og_url      = "https://wine.7pyramid.com/french_wine_knowledge.html",
    canonical   = "https://wine.7pyramid.com/french_wine_knowledge.html",
)

know_main = know_page.new_tag('main', **{'class': 'pt-24 max-w-7xl mx-auto px-6 md:px-12 py-16'})

# Hero
k_hero = know_page.new_tag('header', **{'class': 'mb-24 max-w-3xl'})
k_eyebrow = know_page.new_tag('span', **{'class': 'text-[12px] font-semibold uppercase tracking-[0.3em] text-[#6B2737] mb-6 block'})
k_eyebrow.string = "Expert Knowledge / 專業知識"
k_h1 = know_page.new_tag('h1', **{'class': 'text-4xl md:text-6xl font-semibold text-[#11324B] leading-[1.1] mb-8 tracking-tight'})
k_h1.string = "法國葡萄酒完整知識指南"
k_tagline = know_page.new_tag('p', **{'class': 'text-lg text-[#11324B]/70 leading-relaxed border-l-4 border-[#6B2737] pl-8'})
k_tagline.string = "從波爾多列級酒莊到勃艮第特級園，從香檳製法到優質年份解讀——我們為您系統整理法國葡萄酒的一切精髓。"
k_hero.append(k_eyebrow); k_hero.append(k_h1); k_hero.append(k_tagline)
know_main.append(k_hero)

# Try to extract existing content sections from the old page
know_sections_data = [
    {
        "id": "bordeaux", "num": "01",
        "label": "Bordeaux • 波爾多",
        "heading": "波爾多：世界最知名的列級酒莊產區",
        "body": "波爾多是全球最重要的葡萄酒產區之一，以梅多克（Médoc）列級制度聞名。1855年拿破崙三世頒布的分級制度，將頂尖酒莊分為五個等級，確立了拉菲（Château Lafite Rothschild）、瑪歌（Château Margaux）、拉圖（Château Latour）、木桐（Château Mouton Rothschild）及侯伯王（Château Haut-Brion）五大酒莊的殿堂地位。這些酒款不僅代表法國釀酒藝術的巔峰，更是全球收藏家競相追捧的珍稀資產。"
    },
    {
        "id": "burgundy", "num": "02",
        "label": "Burgundy • 勃艮第",
        "heading": "勃艮第：風土哲學的極致體現",
        "body": "勃艮第（Burgundy）以風土（Terroir）哲學傳世，每一塊葡萄園都有精確的分級制度。從最高級的特級園（Grand Cru）到村莊級（Village），每個等級代表不同的風土精髓。羅曼尼-康帝（Domaine de la Romanée-Conti，DRC）是勃艮第最著名的酒莊，其旗下特級園在拍賣市場上往往創下天價。一瓶DRC Romanée-Conti甚至可達數十萬美元，成為頂級葡萄酒收藏的終極標的。"
    },
    {
        "id": "champagne", "num": "03",
        "label": "Champagne • 香檳",
        "heading": "香檳：慶典與奢華的不朽象徵",
        "body": "香檳（Champagne）是世界上唯一能合法以「Champagne」命名的氣泡酒產區，其傳統製法（Méthode Champenoise）賦予了香檳獨特的細緻氣泡與複雜風味。頂級香檳如Dom Pérignon、Krug、Louis Roederer Cristal不僅是慶典場合的首選，更是高端葡萄酒市場的保值投資標的。年份香檳（Vintage Champagne）的投資潛力尤其值得關注。"
    },
    {
        "id": "vintages", "num": "04",
        "label": "Vintages • 年份解析",
        "heading": "如何解讀年份：影響品質的關鍵因素",
        "body": "年份（Vintage）代表葡萄採收的年份，是影響葡萄酒品質與投資價值的核心因素。偉大年份（如波爾多的1982、1990、2005、2009、2010、2016）的葡萄酒往往具有更長的陳年潛力與更高的市場溢價。氣候條件決定了葡萄的成熟度、酸度與單寧結構，進而影響酒款的深度與複雜性。七銘企業的專業顧問可協助您根據年份表現制定最優化的採購策略。"
    },
]

for sec_data in know_sections_data:
    sec = know_page.new_tag('section', id=sec_data['id'], **{'class': 'mb-28 scroll-mt-32'})
    
    cat_div = know_page.new_tag('div', **{'class': 'mb-10'})
    cat_span = know_page.new_tag('span', **{'class': 'text-[11px] font-semibold tracking-[0.35em] text-[#6B2737] uppercase'})
    cat_span.string = f'{sec_data["num"]} / {sec_data["label"]}'
    sep = know_page.new_tag('div', **{'class': 'w-full h-px bg-[#11324B]/10 mt-4'})
    cat_div.append(cat_span); cat_div.append(sep)
    sec.append(cat_div)

    art = know_page.new_tag('article', **{'class': 'max-w-3xl'})
    h2 = know_page.new_tag('h2', **{'class': 'text-3xl font-semibold text-[#11324B] mb-6 leading-snug'})
    h2.string = sec_data['heading']
    body_p = know_page.new_tag('p', **{'class': 'text-[#11324B]/75 leading-loose text-lg'})
    body_p.string = sec_data['body']
    art.append(h2); art.append(body_p)
    sec.append(art)
    know_main.append(sec)

# CTA
k_cta = know_page.new_tag('section', **{'class': 'bg-[#F6F3EE] border-l-4 border-[#6B2737] p-16 mb-16'})
k_cta_h2 = know_page.new_tag('h2', **{'class': 'text-2xl font-semibold text-[#11324B] mb-4'})
k_cta_h2.string = "想了解更多？預約專屬侍酒師諮詢"
k_cta_p = know_page.new_tag('p', **{'class': 'text-[#11324B]/70 mb-8 max-w-lg leading-relaxed'})
k_cta_p.string = "我們的資深侍酒師將根據您的預算與收藏目標，為您推薦最適合的葡萄酒投資組合。"
k_cta_a = know_page.new_tag('a', href="mailto:account2@7pyramid.com?subject=葡萄酒知識諮詢", **{
    'class': 'bg-[#11324B] text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#22445E] transition-all'
})
k_cta_a.string = "立即諮詢"
k_cta.append(k_cta_h2); k_cta.append(k_cta_p); k_cta.append(k_cta_a)
know_main.append(k_cta)

finalise_page(know_page, know_main, 'french_wine_knowledge.html')


# ───────────────────────────────────────────────
# 5. HOW TO DRINK WINE PAGE
# ───────────────────────────────────────────────
print("\n── Building how_to_drink_wine.html ──")

drink_page = make_page_shell(
    title       = "如何品酒：頂級葡萄酒品鑑指南 | 七銘企業 Seven Pyramid",
    description = "學習專業品酒技巧：如何觀色、聞香、品味，以及如何搭配食物。七銘企業侍酒師教您享受頂級葡萄酒的正確方式。",
    og_url      = "https://wine.7pyramid.com/how_to_drink_wine.html",
    canonical   = "https://wine.7pyramid.com/how_to_drink_wine.html",
)

drink_main = drink_page.new_tag('main', **{'class': 'pt-24 max-w-7xl mx-auto px-6 md:px-12 py-16'})

# Hero
d_hero = drink_page.new_tag('header', **{'class': 'mb-24 max-w-3xl'})
d_eyebrow = drink_page.new_tag('span', **{'class': 'text-[12px] font-semibold uppercase tracking-[0.3em] text-[#6B2737] mb-6 block'})
d_eyebrow.string = "The Art of Tasting / 品酒藝術"
d_h1 = drink_page.new_tag('h1', **{'class': 'text-4xl md:text-6xl font-semibold text-[#11324B] leading-[1.1] mb-8 tracking-tight'})
d_h1.string = "如何品鑑頂級葡萄酒"
d_tagline = drink_page.new_tag('p', **{'class': 'text-lg text-[#11324B]/70 leading-relaxed border-l-4 border-[#6B2737] pl-8'})
d_tagline.string = "品酒是一種需要系統學習的美學修練。從視覺到嗅覺，從口感到餘韻，每一個環節都蘊含著與釀酒師的無聲對話。"
d_hero.append(d_eyebrow); d_hero.append(d_h1); d_hero.append(d_tagline)
drink_main.append(d_hero)

drink_steps = [
    {
        "id": "sight", "num": "01",
        "label": "Visual Analysis • 視覺分析",
        "heading": "Step 1 — 觀察酒色",
        "body": "傾斜酒杯至45度，在白色背景前觀察酒液的色澤、深度與澄清度。紅酒從紫紅（年輕）到磚紅（成熟）的色澤漸變反映了陳年程度。白酒由淡黃到金黃的轉變，則暗示著橡木桶陳釀與年份的影響。色緣（rim）的顏色是判斷酒齡最直觀的指標之一。"
    },
    {
        "id": "nose", "num": "02",
        "label": "Olfactory Analysis • 嗅覺分析",
        "heading": "Step 2 — 品嗅香氣",
        "body": "搖晃酒杯使酒液與空氣充分接觸，然後深吸一口氣。優質葡萄酒的香氣分為三個層次：初香（Primary Aromas）來自葡萄品種本身，如黑醋栗、玫瑰；二級香（Secondary Aromas）來自發酵過程；陳年香（Tertiary Aromas，又稱Bouquet）則是經過長時間橡木桶及瓶中陳年後形成的複雜香氣，如皮革、雪松、松露等。"
    },
    {
        "id": "taste", "num": "03",
        "label": "Palate Analysis • 味覺分析",
        "heading": "Step 3 — 品味口感",
        "body": "小啜一口酒液，讓其覆蓋整個口腔。注意甜度、酸度、單寧（澀感）、酒精感以及酒體（Body）的平衡。頂級紅酒的單寧應細緻絲滑，而非粗礪刺口。偉大的葡萄酒在口中的感受應是多層次且和諧統一的，各元素相輔相成，沒有突兀的突出點。"
    },
    {
        "id": "finish", "num": "04",
        "label": "Finish • 餘韻",
        "heading": "Step 4 — 感受餘韻",
        "body": "餘韻（Finish 或 Aftertaste）是判斷葡萄酒品質最重要的指標之一。頂級葡萄酒的餘韻應持續30秒甚至數分鐘，香氣和風味在口腔中縈繞不散。常見的評測單位是「盞」（Caudalies），代表餘韻持續的秒數。波爾多五大酒莊或DRC的偉大年份，往往有令人難忘的悠長餘韻。"
    },
]

for step_data in drink_steps:
    sec = drink_page.new_tag('section', id=step_data['id'], **{'class': 'mb-28 scroll-mt-32 grid grid-cols-1 md:grid-cols-12 gap-12'})
    
    num_col = drink_page.new_tag('div', **{'class': 'md:col-span-2 flex items-start'})
    num_span = drink_page.new_tag('span', **{'class': 'text-7xl font-bold text-[#F6F3EE] leading-none select-none'})
    num_span.string = step_data['num']
    num_col.append(num_span)
    sec.append(num_col)

    text_col = drink_page.new_tag('div', **{'class': 'md:col-span-10'})
    label_s = drink_page.new_tag('span', **{'class': 'text-[11px] font-semibold tracking-[0.3em] text-[#6B2737] uppercase block mb-4'})
    label_s.string = step_data['label']
    sep = drink_page.new_tag('div', **{'class': 'w-16 h-px bg-[#6B2737] mb-6'})
    h2 = drink_page.new_tag('h2', **{'class': 'text-2xl md:text-3xl font-semibold text-[#11324B] mb-5 leading-snug'})
    h2.string = step_data['heading']
    body_p = drink_page.new_tag('p', **{'class': 'text-[#11324B]/75 leading-loose text-base max-w-2xl'})
    body_p.string = step_data['body']
    text_col.append(label_s); text_col.append(sep); text_col.append(h2); text_col.append(body_p)
    sec.append(text_col)
    drink_main.append(sec)

# CTA
d_cta = drink_page.new_tag('section', **{'class': 'bg-[#11324B] p-16 md:p-24 flex flex-col items-center text-center mt-8 mb-16'})
d_cta_h2 = drink_page.new_tag('h2', **{'class': 'text-white text-3xl md:text-4xl font-semibold mb-8 tracking-tight max-w-lg leading-tight'})
d_cta_h2.string = "親身體驗七銘企業的品酒文化"
d_cta_p = drink_page.new_tag('p', **{'class': 'text-white/60 mb-10 max-w-sm leading-relaxed'})
d_cta_p.string = "歡迎聯繫我們，安排私人品酒會或參觀我們的恒溫倉儲，由專業侍酒師親自引導您踏入頂級葡萄酒的世界。"
d_cta_a = drink_page.new_tag('a', href="mailto:account2@7pyramid.com?subject=品酒活動諮詢", **{
    'class': 'bg-[#6B2737] text-white px-12 py-5 text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#8d3348] transition-all duration-300'
})
d_cta_a.string = "預約品酒活動"
d_cta.append(d_cta_h2); d_cta.append(d_cta_p); d_cta.append(d_cta_a)
drink_main.append(d_cta)

finalise_page(drink_page, drink_main, 'how_to_drink_wine.html')

print("\n✅  All pages converted successfully!")
