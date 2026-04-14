import bs4
import re

print("Loading index.html...")
with open('../../deploy/index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

index_soup = bs4.BeautifulSoup(index_html, 'html.parser')
tailwind_config = index_soup.find('script', id='tailwind-config')
tailwind_script = index_soup.find('script', src=re.compile(r'cdn\.tailwindcss\.com'))
google_fonts = index_soup.find_all('link', href=re.compile(r'fonts\.googleapis\.com'))
custom_style = index_soup.find('style') # index.html style block for fonts etc

header_top = index_soup.find('header', class_=re.compile(r'fixed top-0'))
mobile_menu = index_soup.find('div', id='mobile-menu-overlay')
footer = index_soup.find('footer')
age_gate = index_soup.find('div', id='age-gate-banner')

print("Loading wine_catalog.html template...")
with open('../../queue/wine_catalog.html', 'r', encoding='utf-8') as f:
    cat_html = f.read()
cat_soup = bs4.BeautifulSoup(cat_html, 'html.parser')
page_header = cat_soup.find('header', class_=re.compile(r'mb-24'))
# Remove the search filter UI to keep it simpler if needed, or leave it as is.
# page_header is the "Curated Vintages" block.

print("Loading original wine_list.html...")
with open('../../deploy/wine_list.html', 'r', encoding='utf-8') as f:
    wl_html = f.read()

wl_soup = bs4.BeautifulSoup(wl_html, 'html.parser')

print("Processing head...")
# Append new design system links to head
head = wl_soup.head
# Remove old CSS
for link in head.find_all('link', rel='stylesheet'):
    if 'css/' in link.get('href', ''):
        link.decompose()
for style in head.find_all('style'):
    style.decompose()

for font in google_fonts:
    head.append(font)
if tailwind_script: head.append(tailwind_script)
if tailwind_config: head.append(tailwind_config)
if custom_style: head.append(custom_style)

# Add class to body
body = wl_soup.body
body.attrs['class'] = ['text-[#07141E]', 'selection:bg-[#11324B]', 'selection:text-white', 'pb-16', 'bg-white', 'dark:bg-stone-950']
body.clear()

if age_gate: body.append(age_gate)
if header_top: body.append(header_top)
if mobile_menu: body.append(mobile_menu)

main = wl_soup.new_tag('main')
main['id'] = 'home'
main['class'] = ['pt-32', 'pb-20', 'bg-white', 'dark:bg-stone-950']

section_container = wl_soup.new_tag('section')
section_container['class'] = ['max-w-screen-xl', 'mx-auto', 'px-6', 'md:px-12', 'py-10']

if page_header:
    section_container.append(page_header)

print("Parsing wines...")
original_wl_soup = bs4.BeautifulSoup(wl_html, 'html.parser')

# Get wine sections
wine_idx = 1
for old_section in original_wl_soup.find_all('section', class_='wine-section'):
    country_h2 = old_section.find('h2', class_='country-header')
    region_h3 = old_section.find('h3', class_='region-header')
    
    country_name = country_h2.text.strip() if country_h2 else ""
    region_name = region_h3.text.strip() if region_h3 else ""
    cat_title = f"{country_name} - {region_name}".strip(" -")
    
    region_div = wl_soup.new_tag('div')
    region_div['class'] = ['mb-32']
    
    # Title header
    title_wrap = wl_soup.new_tag('div')
    title_wrap['class'] = ['flex', 'items-center', 'gap-8', 'mb-12']
    
    title_h2 = wl_soup.new_tag('h2')
    title_h2['class'] = ['text-sm', 'font-semibold', 'uppercase', 'tracking-[0.4em]', 'text-slate-400', 'whitespace-nowrap']
    title_h2.string = cat_title
    
    line_div = wl_soup.new_tag('div')
    line_div['class'] = ['editorial-line', 'w-full', 'bg-[#11324B]/10', 'h-px']
    
    title_wrap.append(title_h2)
    title_wrap.append(line_div)
    region_div.append(title_wrap)
    
    # List of wines
    list_div = wl_soup.new_tag('div')
    list_div['class'] = ['space-y-16']
    
    for tr in old_section.find_all('tr'):
        tds = tr.find_all('td')
        if len(tds) < 5: continue
        
        # Structure: Name (with link), Chinese, Vintage, Region, Price, Inventory
        a_tag = tds[0].find('a')
        wine_url = a_tag['href'] if a_tag else "#"
        wine_en = a_tag.text.strip() if a_tag else tds[0].text.strip()
        wine_ch = tds[1].text.strip()
        vintage = tds[2].text.strip()
        spec_region = tds[3].text.strip()
        price = tds[4].text.strip()
        inventory = tds[5].text.strip() if len(tds) > 5 else ""
        
        # Create article
        article = wl_soup.new_tag('article')
        article['class'] = ['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-8', 'md:gap-12', 'group', 'pt-16', 'border-t', 'border-[#11324B]/5']
        
        idx_div = wl_soup.new_tag('div')
        idx_div['class'] = ['md:col-span-1', 'text-2xl', 'font-light', 'text-slate-300', 'group-hover:text-[#6B2737]', 'transition-colors']
        idx_div.string = f"{wine_idx:02d}"
        wine_idx += 1
        
        # Col 6 main text
        col6 = wl_soup.new_tag('div')
        col6['class'] = ['md:col-span-6']
        
        tags_div = wl_soup.new_tag('div')
        tags_div['class'] = ['flex', 'items-center', 'gap-4', 'mb-2']
        tag1 = wl_soup.new_tag('span')
        tag1['class'] = ['text-[11px]', 'font-semibold', 'tracking-widest', 'text-[#11324B]', 'uppercase', 'bg-[#F6F3EE]', 'px-2', 'py-1']
        tag1.string = spec_region
        tag2 = wl_soup.new_tag('span')
        tag2['class'] = ['text-[11px]', 'font-semibold', 'tracking-widest', 'text-slate-400', 'uppercase']
        tag2.string = vintage
        tags_div.append(tag1)
        tags_div.append(tag2)
        
        h3 = wl_soup.new_tag('h3')
        h3['class'] = ['text-2xl', 'md:text-3xl', 'font-semibold', 'tracking-tight', 'text-[#11324B]', 'mb-2', 'leading-tight']
        h3_a = wl_soup.new_tag('a')
        h3_a['href'] = wine_url
        h3_a.string = wine_en
        h3.append(h3_a)
        
        ch_p = wl_soup.new_tag('p')
        ch_p['class'] = ['text-lg', 'text-[#6B2737]', 'font-medium', 'mb-4', 'font-sans']
        ch_p.string = wine_ch
        
        inv_p = wl_soup.new_tag('p')
        inv_p['class'] = ['text-xs', 'uppercase', 'tracking-widest', 'text-slate-500']
        inv_p.string = inventory
        
        col6.append(tags_div)
        col6.append(h3)
        col6.append(ch_p)
        col6.append(inv_p)
        
        # Col 3 price
        col3 = wl_soup.new_tag('div')
        col3['class'] = ['md:col-span-3', 'flex', 'flex-col', 'justify-end', 'pb-1', 'mt-4', 'md:mt-0']
        p_label = wl_soup.new_tag('div')
        p_label['class'] = ['text-[11px]', 'uppercase', 'tracking-widest', 'text-slate-400', 'mb-1']
        p_label.string = "Market Price (NT$)"
        p_val = wl_soup.new_tag('div')
        p_val['class'] = ['text-lg', 'font-medium', 'text-[#11324B]']
        p_val.string = price
        col3.append(p_label)
        col3.append(p_val)
        
        # Col 2 action
        col2 = wl_soup.new_tag('div')
        col2['class'] = ['md:col-span-2', 'flex', 'flex-col', 'justify-end', 'mt-4', 'md:mt-0']
        act_a = wl_soup.new_tag('a')
        act_a['href'] = wine_url
        act_a['class'] = ['text-[11px]', 'font-bold', 'uppercase', 'tracking-widest', 'text-[#6B2737]', 'border-b-2', 'border-[#6B2737]', 'pb-1', 'w-fit', 'hover:opacity-60', 'transition-opacity']
        act_a.string = ("See Detail" if "wines/" in wine_url else "Inquire")
        col2.append(act_a)
        
        article.append(idx_div)
        article.append(col6)
        article.append(col3)
        article.append(col2)
        
        list_div.append(article)
        
    region_div.append(list_div)
    section_container.append(region_div)

main.append(section_container)
body.append(main)
if footer: body.append(footer)

print(f"Total articles generated: {len(main.find_all('article'))}")
print("Writing mapped wine catalog to ../../queue/wine_list_new.html...")
with open('../../queue/wine_list_new.html', 'w', encoding='utf-8') as f:
    f.write(wl_soup.prettify(formatter="html"))

print("Conversion complete!")
