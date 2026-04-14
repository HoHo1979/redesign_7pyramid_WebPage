import bs4

# 1. Load the original file
with open('../../deploy/faq.html', 'r', encoding='utf-8') as f:
    old_html = f.read()
old_soup = bs4.BeautifulSoup(old_html, 'html.parser')

# 2. Load the template
with open('../../queue/faq.html', 'r', encoding='utf-8') as f:
    tpl_html = f.read()
tpl_soup = bs4.BeautifulSoup(tpl_html, 'html.parser')

# 3. Load the components (Header, Footer, Age Gate)
with open('components.html', 'r', encoding='utf-8') as f:
    comp_html = f.read()
comp_soup = bs4.BeautifulSoup(comp_html, 'html.parser')
age_gate = comp_soup.find('div', id='age-gate-banner')
header = comp_soup.find('nav', id='header')
footer = comp_soup.find('footer', id='footer')

# --- Merge Head ---
for meta in old_soup.head.find_all(['meta', 'script']):
    if meta.get('src') and 'tailwindcss' in meta.get('src'):
        continue
    if not tpl_soup.head.find(lambda t: t.name == meta.name and dict(t.attrs) == dict(meta.attrs)):
        tpl_soup.head.append(meta)

# Fix title
tpl_soup.head.title.string = old_soup.head.title.string if old_soup.head.title else "葡萄酒收藏 FAQ"

# --- Update Body ---
body = tpl_soup.body
body_classes = body.get('class', [])
body.clear()
body['class'] = body_classes

# Append standardized components
body.append(age_gate)
body.append(header)

# Extract layout from template
main_content = bs4.BeautifulSoup(tpl_html, 'html.parser').body.find('main')

# Fix translations
# Hero section
main_content.find('h1').string = "常見問題與見解"
main_content.find('p').string = "在此尋求解答，我們以同樣嚴謹的態度與精準度，處理您對頂級葡萄酒收藏與投資的每一個疑問。"

# Sidebar navigation
nav = main_content.find('aside').find('nav')
nav.find('span').string = "主題"
links = nav.find_all('a')
links[0].string = "保存與收藏"
links[0]['href'] = "#preservation"
if len(links) > 1:
    links[1].string = "投資價值"
    links[1]['href'] = "#investment"
if len(links) > 2:
    links[2].string = "垂直年份"
    links[2]['href'] = "#vintage"
if len(links) > 3:
    links[3].string = "原木箱"
    links[3]['href'] = "#owc"

# Sections
sections_container = main_content.find('div', class_='lg:col-span-9')
sections_container.clear()

# Add Questions
questions_data = [
    {
        "id": "preservation",
        "title": "01 / 保存與收藏",
        "q": "頂級葡萄酒應該如何正確保存？",
        "a": "保存頂級葡萄酒需注意恆溫(12°C-14°C)、恆濕(65%-75%)以及避光避震。七銘企業的所有酒款皆存放於專業溫控倉儲，確保最佳狀態。"
    },
    {
        "id": "investment",
        "title": "02 / 投資價值",
        "q": "哪些產區的葡萄酒最具投資價值？",
        "a": "主要為法國波爾多1855列級酒莊(如五大酒莊)、美國納帕谷膜拜酒(如Opus One)，以及智利頂級酒款(如Almaviva, Sena)。"
    },
    {
        "id": "vintage",
        "title": "03 / 垂直年份",
        "q": "什麼是「垂直年份」收藏？為什麼值得投資？",
        "a": "垂直收藏是指收集同一款酒連續不同年份。完整的垂直年份套組在拍賣市場上極為稀有，往往能拍出比單瓶總和更高的溢價。"
    },
    {
        "id": "owc",
        "title": "04 / 原廠木箱",
        "q": "為什麼有些酒需要原木箱收藏？",
        "a": "原廠木箱(OWC)提供身分證明、更好的保護性，且在次級市場上，連同原木箱的完整酒款通常有更高的拍賣價格。"
    }
]

for section_data in questions_data:
    section = tpl_soup.new_tag('section', id=section_data['id'], **{'class': 'scroll-mt-40'})
    header_div = tpl_soup.new_tag('div', **{'class': 'mb-12'})
    span = tpl_soup.new_tag('span', **{'class': 'text-[12px] font-semibold tracking-[0.3em] text-[#6B2737] uppercase'})
    span.string = section_data['title']
    sep = tpl_soup.new_tag('div', **{'class': 'w-full h-[1px] bg-[#11324B]/10 mt-4'})
    header_div.append(span)
    header_div.append(sep)
    
    content_div = tpl_soup.new_tag('div', **{'class': 'space-y-20'})
    article = tpl_soup.new_tag('article', **{'class': 'max-w-2xl'})
    h3 = tpl_soup.new_tag('h3', **{'class': 'text-2xl font-semibold text-[#11324B] mb-6'})
    h3.string = section_data['q']
    
    body_div = tpl_soup.new_tag('div', **{'class': 'text-[#11324B] leading-relaxed'})
    p = tpl_soup.new_tag('p')
    p.string = section_data['a']
    body_div.append(p)
    
    article.append(h3)
    article.append(body_div)
    content_div.append(article)
    
    section.append(header_div)
    section.append(content_div)
    
    sections_container.append(section)

# Append CTA
cta_section = tpl_soup.new_tag('section', **{'class': 'bg-[#11324B] p-16 md:p-24 flex flex-col items-center text-center mt-32'})
cta_h2 = tpl_soup.new_tag('h2', **{'class': 'text-white text-3xl md:text-5xl font-semibold mb-10 tracking-tight max-w-2xl leading-tight'})
cta_h2.string = "深入了解您的收藏"
cta_p = tpl_soup.new_tag('p', **{'class': 'text-white/60 mb-12 max-w-lg'})
cta_p.string = "若您的疑問需要更詳細的解答，我們的資深侍酒師可為您提供私人諮詢服務。"
cta_btn = tpl_soup.new_tag('button', **{'class': 'bg-[#6B2737] text-white px-12 py-5 text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#8d3348] transition-all duration-500'})
cta_btn.string = "預約私人諮詢"
cta_section.append(cta_h2)
cta_section.append(cta_p)
cta_section.append(cta_btn)
sections_container.append(cta_section)

body.append(main_content)
body.append(footer)

print("Writing mapped FAQ to deploy/faq.html...")
with open('../../deploy/faq.html', 'w', encoding='utf-8') as f:
    f.write(tpl_soup.prettify(formatter="html"))
print("Done!")
