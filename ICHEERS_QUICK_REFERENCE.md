# iCheers Wine Search Quick Reference Guide

## How to Find Wines on iCheers.tw

### Method 1: Direct Search Bar

1. Go to https://www.icheers.tw
2. Use search box at top of page
3. Enter wine name (e.g., "Chateau Ausone" or just "Ausone")
4. Results will show available vintages
5. Click on desired vintage to open product page
6. Extract image URL from page (see "How to Extract Image URLs" below)

### Method 2: Browse by Region

1. Go to https://www.icheers.tw
2. Click on "葡萄酒" (Wine) in navigation
3. Select region:
   - "法國" (France) for Bordeaux wines
   - "智利" (Chile) for Chilean wines
   - "美國" (USA) for Napa wines
4. Browse or filter by price
5. Click on wine to view product page

### Method 3: Direct Product Link

If you have the product ID from wine_mapping.json:

```
https://www.icheers.tw/iCheers/Wine/WineDetail/wine_detail/{PRODUCT_ID}
```

Example: Product ID 2182 becomes:
`https://www.icheers.tw/iCheers/Wine/WineDetail/wine_detail/2182`

## How to Extract Image URLs

### From Product Page (Browser Method)

1. Open product page in browser
2. Right-click on wine bottle image
3. Select "Copy image address"
4. Paste URL into spreadsheet
5. Verify URL format matches iCheers patterns

**Expected URL Format:**
```
https://www.icheers.tw/fileserver/Upload/DomaineData/WR{id}/WI{id}/VT{year}/VL00750/WI{id}_btl.jpg
```

### From Page Source (Advanced Method)

1. Open product page in browser
2. Right-click → "View Page Source" (or Ctrl+U)
3. Search for "fileserver/Upload" or "fileserver/upload"
4. Copy the complete URL

### Using Browser Developer Tools

1. Open product page
2. Press F12 to open Developer Tools
3. Go to "Network" tab
4. Reload page
5. Look for image requests (jpg files)
6. Click on request and copy full URL from Headers

## Known Product IDs (From Research)

### Bordeaux First Growths (一級酒莊)

| Winery | WR ID | Typical Product IDs |
|--------|-------|-------------------|
| Chateau Lafite Rothschild | WR000068 | 2834, 2830, 35855, 54515 |
| Chateau Margaux | WR000088 | 3197, 3202, 35867 |
| Chateau Latour | WR000151 | 2957, 2946, 2928 |
| Chateau Haut Brion | WR000060 | 2678, 2677, 16578 |
| Chateau Mouton Rothschild | WR000262 | 3278, 3284, 21769 |

### Bordeaux Right Bank (Right Bank/Right Bordeaux)

| Winery | WR ID | Typical Product IDs |
|--------|-------|-------------------|
| Chateau Ausone | WR000432 | 2182, 10628, 10637 |
| Chateau Cheval Blanc | WR000433 | 2356, 2369, 41469 |
| Chateau Angelus | WR000047 | 2897, 11218, 14854 |
| Chateau Pavie | WR000076 | 3378, 3383, 25974 |
| Chateau Figeac | WR000058 | 3961, 14864 |

### USA - Napa Valley

| Winery | WR ID | Typical Product IDs |
|--------|-------|-------------------|
| Opus One | WR000239 | 4974, 6983, 12487, 28273, 52497, 54093 |

### Chile

| Winery | WR ID | Typical Product IDs |
|--------|-------|-------------------|
| Almaviva | WR000259 | 2150, 34580, 35528, 46437 |
| Sena | WR001133 | 8134, 14682, 17968, 20496, 25033, 40244 |
| Vinedo Chadwick | (Vina Errazuriz) | 6982, 20295 |
| Cheval des Andes | WR001546 | (Winery page) |

## Wine Name Variations on iCheers

iCheers uses traditional Chinese names. Here are common translations:

| English | Chinese | Pinyin |
|---------|---------|--------|
| Chateau Ausone | 歐頌城堡/堡 | Ōu Sòng Chéng Bǎo |
| Chateau Cheval Blanc | 白馬堡 | Báimǎ Bǎo |
| Chateau Angelus | 金鐘堡 | Jīnzhōng Bǎo |
| Chateau Pavie | 帕維城堡/帕彌堡 | Pàwéi/Pàmǐ Chéng Bǎo |
| Chateau Figeac | 費賈克堡 | Fèi Jiǎ Kè Bǎo |
| Chateau Lafite | 拉菲堡 | Lā Fěi Bǎo |
| Chateau Margaux | 瑪歌堡 | Mǎ Gē Bǎo |
| Chateau Latour | 拉圖堡 | Lā Tú Bǎo |
| Chateau Haut Brion | 歐布里翁堡/歐布里雍堡 | Ōu Bù Lǐ Yuán Bǎo |
| Chateau Mouton Rothschild | 木桐堡 | Mù Tóng Bǎo |
| Opus One | 第一樂章/作品一號 | Dì Yī Lèzhāng |
| Almaviva | 阿瑪維亞/愛馬維瑪 | Ā Mǎ Wéi Yà |
| Sena | 希娜 | Xī Nà |
| Vinedo Chadwick | 查德維克 | Chá Dé Wéi Kè |

## Image URL Troubleshooting

### If URL is 404 Not Found

1. Check if wine exists on iCheers by searching
2. Verify product ID is correct
3. Try alternate image suffix:
   - Change `_btl.jpg` to `_L.jpg`
   - Change `_btl.jpg` to `_cu.jpg`
4. Check URL for typos (especially WR and WI IDs)

### If Image URL Has UUID Instead of Structured Name

This is normal for some wines. URLs like:
```
https://www.icheers.tw/fileserver/upload/68a25169-1dfb-4586-85f2-816416f68a4e.jpg
```

Are valid and can be used as-is.

### If Vintage Doesn't Match URL

Example: Product 54515 (2021 vintage) has URL showing VT2024

This appears to be a data entry error on iCheers but the image is still correct. Use the URL as-is.

## Batch Processing Tips

### Export Product Links for Analysis

Use browser console to extract all product links from search results:

```javascript
Array.from(document.querySelectorAll('a[href*="/wine_detail/"]'))
  .map(a => ({
    name: a.textContent.trim(),
    href: a.href
  }))
  .filter(item => item.name)
  .slice(0, 50)
```

### Create CSV of Wines for Mapping

If you want to create a structured file of wines found:

**wine_icheers.csv**
```csv
wine_name,vintage,product_id,chinese_name,image_url
Chateau Ausone,2005,2182,歐頌城堡,https://www.icheers.tw/fileserver/Upload/DomaineData/WR000432/WI00043201/VT2005/VL00750/WI00043201_btl.jpg
Chateau Cheval Blanc,2020,41469,白馬堡,https://www.icheers.tw/fileserver/Upload/DomaineData/WR000433/WI00043301/VT2020/VL00750/WI00043301_btl.jpg
```

## Common Issues and Solutions

### Issue: Wine not found in search

**Solution:**
1. Try searching by just last name (e.g., "Ausone" instead of "Chateau Ausone")
2. Try searching in Chinese (use wine_mapping.json for names)
3. Try searching by region (e.g., "Saint Emilion")
4. Check if wine is out of stock (iCheers may hide unavailable items)

### Issue: Multiple product IDs for same wine

**Solution:**
1. This is normal - different product IDs = different vintages or box quantities
2. Choose the product ID matching your desired vintage
3. Check packaging notation (e.g., "6入木箱" = 6-bottle wood case)

### Issue: Image URL returns 403 Forbidden

**Solution:**
1. This may be a temporary server issue
2. Try refreshing the URL
3. Check if Referer header is needed (might require visiting from iCheers.tw first)
4. As fallback, use Vivino image URL instead

### Issue: Chinese characters not displaying correctly

**Solution:**
1. Ensure file is saved as UTF-8 encoding
2. In markdown, wrap Chinese in proper quotes: `"中文名稱"`
3. In JSON, UTF-8 is standard - should work automatically

## Quick Command Line Tools

### Download Image from iCheers URL

```bash
wget "https://www.icheers.tw/fileserver/Upload/DomaineData/WR000432/WI00043201/VT2005/VL00750/WI00043201_btl.jpg" -O chateau_ausone_2005.jpg
```

### Test if URL is Valid (Curl)

```bash
curl -I "https://www.icheers.tw/fileserver/Upload/DomaineData/WR000432/WI00043201/VT2005/VL00750/WI00043201_btl.jpg"
```

If you get `HTTP/1.1 200 OK`, the URL is valid.

## Contact iCheers Support

If you have questions about product availability or need bulk data:

- **Email**: service(at)icheers.tw
- **Phone**: +886 2 2926 3667
- **Website**: https://www.icheers.tw
- **Hours**: Mon-Sun 10:00-21:00 (Taiwan time)

---

**Last Updated**: 2025-12-19
**Purpose**: Manual reference for finding wines on iCheers.tw and extracting image URLs
