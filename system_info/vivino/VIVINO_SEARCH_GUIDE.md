# Vivino Systematic Search Guide

## Overview
You have **164 wines** organized by region in `VIVINO_SEARCH_TRACKER.csv`. This guide shows how to efficiently search Vivino and collect image URLs.

---

## Step-by-Step Vivino Search Process

### 1. Start with Vivino Search
- Go to: https://www.vivino.com/search
- Search format: **"Chateau Name Vintage"** or **"Chateau Name Year"**
  - Example: `Margaux 2015` or `Château Margaux 2015`
  - Try simpler names first if full name doesn't work

### 2. Finding the Product Page
Once you search:
1. **Click on the first result** that matches your wine
2. Look for matching **vintage year** and **wine name**
3. You'll see a product page with the wine image

### 3. Collecting the Image URL
Once on the product page:
1. **Right-click on the wine bottle image**
2. Select **"Copy Image Link"** (or **"Copy Link"**)
3. This gives you the direct image URL
4. **Paste into the CSV in the `Image_URL` column**

### 4. Example Workflow
```
Search: "Margaux 2015"
  ↓
Click first result matching "CH MARGAUX 2015"
  ↓
Product page loads with bottle image
  ↓
Right-click image → Copy Image Link
  ↓
URL: https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png
  ↓
Paste into CSV → Mark status as FOUND
```

---

## Search Strategy by Region (Recommended Order)

### Priority 1: Bordeaux First Growth (Highest Volume)
- **CH MARGAUX**: Start with 2015-2021 (7 vintages)
- **CH LAFITE ROTHSCHILD**: 2019-2021
- **CH LATOUR**: 2011, 2015
- **CH HAUT BRION**: 2011, 2016, 2019-2021
- **CH MOUTON ROTHSCHILD**: 2016, 2018-2019, 2021

**Tip**: These bottles often share the same image across vintages. If you find Margaux 2015, check if 2016-2021 use the same image.

### Priority 2: Bordeaux Second Growth
- **RAUZAN SEGLA**, **LEOVILLE LAS CASES**, **COS D'ESTOURNEL**, **PICHON BARON**, etc.

### Priority 3: Bordeaux Third Growth & Fifth Growth
- **KIRWAN**, **PALMER**, **CANTENAC BROWN**, **PONTET CANET**, etc.

### Priority 4: Secondary/Second Wines
- **Carruades de Lafite**, **Pavillon Rouge Margaux**, **Le Clarence de Haut-Brion**

### Priority 5: USA (Napa)
- **OPUS ONE**: Should have consistent images across vintages
- Search: "Opus One 2015", "Opus One 2018", etc.

### Priority 6: Chile & Italy
- **ALMAVIVA**, **SENA**, **Vinedo Chadwick**, **Masseto**, **Solaia**

### Priority 7: Sauternes & White Wines
- **D'YQUEM**, **CH Smith Haut Lafitte Blanc**, **LE PETIT CHEVAL BLANC**

---

## Efficient Search Tips

### 1. Use Simpler Wine Names First
- If **"CH MARGAUX 2015"** doesn't work
- Try: **"Margaux 2015"** or just **"Margaux"** then filter by vintage
- Or: **"Château Margaux"**

### 2. Handle Special Cases
| Wine Name | Search Tip |
|-----------|-----------|
| CH. (with period) | Try without period: "CH Mouton" |
| Typos (CHAT, Chteau) | Search the correct spelling, not the typo |
| Spaces issues | Remove extra spaces, try variations |
| 375ML / 1.5L sizes | Main image is usually same across bottle sizes |

### 3. Copy Multiple Vintages at Once
- Many wines reuse the same bottle image
- Example: Margaux 2015-2021 likely use same image
- **Test one vintage first**, then use the same URL for similar years if consistent

### 4. Handle Missing Wines
If you can't find a wine after 2-3 searches:
- **Mark as "NOT_FOUND"** in Status column
- **Note reason** in Notes (e.g., "Sold out", "Very old vintage")
- **Skip to next wine** - don't spend >5 minutes searching

### 5. Browser Tips
- **Open Vivino in one tab**, CSV tracker in another
- **Copy URL** from image, **paste into CSV**
- **Keep a count** of how many you've completed

---

## How to Update the CSV

### CSV Format
```csv
Wine_Name,Vintage,Region,Status,Vivino_URL,Image_URL,Notes
CH MARGAUX,2015,Bordeaux First Growth,FOUND,https://www.vivino.com/...,https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png,
```

### Status Values
- **PENDING** = Not searched yet
- **FOUND** = Image URL collected
- **NOT_FOUND** = Couldn't find after searching
- **DUPLICATE** = Same image as another wine
- **CHECKING** = Currently searching

### Columns
- **Wine_Name**: Exact name from no_image_link.md
- **Vintage**: Year
- **Region**: Category for grouping
- **Status**: PENDING/FOUND/NOT_FOUND
- **Vivino_URL**: Optional - full Vivino product page URL
- **Image_URL**: The direct image URL (what you copy)
- **Notes**: Special info (bottle size, typos, duplicates)

---

## Template for Quick Copy-Paste

When you find an image URL, copy this format:
```
CH MARGAUX,2015,Bordeaux First Growth,FOUND,https://www.vivino.com/...,https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png,
```

---

## Expected Image URL Format

**All URLs should look like this:**
```
https://images.vivino.com/thumbs/{ID}_pb_x960.png
```

Examples:
- `https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png` ✓ GOOD
- `https://images.vivino.com/thumbs/H7dWxKzJTKyaV_9rM2OPlg_pb_x960.png` ✓ GOOD
- `https://vivino.com/wines/123` ✗ WRONG (not image URL)

---

## Progress Tracking

### Session Goals
- **Session 1**: Complete Bordeaux First Growth (30-40 wines)
- **Session 2**: Complete Bordeaux Second Growth (30-35 wines)
- **Session 3**: Complete Bordeaux Third & Fifth Growth (40-50 wines)
- **Session 4**: Complete USA, Chile, Italy (25-30 wines)
- **Session 5**: Finalize Sauternes & White Wines (5-10 wines)

### Quick Checklist
- [ ] Update CSV status column as you go
- [ ] Copy exact image URLs (not product page URLs)
- [ ] Note duplicates (same image for multiple wines)
- [ ] Flag typos/malformed names for later fixing
- [ ] Save CSV frequently

---

## After Collecting All URLs

Once you complete the CSV, run this command to merge the URLs back:
```bash
npm run merge-wine-images
```
This will update your wine database with the new image URLs automatically.

---

## Troubleshooting

### Issue: URL shows "Access Denied"
**Solution**: You're on the Vivino product page viewing it. The URL works from Vivino's domain. It will work when properly integrated.

### Issue: Can't find the wine on Vivino
**Solution**:
1. Try alternative spelling (remove accents, hyphens)
2. Search just the château name without vintage
3. Check if it's a very old vintage (pre-2000) - may be out of stock
4. Mark as "NOT_FOUND" and move on

### Issue: Multiple versions of same wine
**Solution**:
- Use the **standard bottle image** (750ml)
- Ignore 375ML or 1.5L - they usually share same label image
- If different, note in Notes column

---

## Time Estimate
- Average: **1-2 minutes per wine** (faster once you get rhythm)
- Total for 164 wines: **4-5 hours** if done in focused sessions
- Recommend: **2 hours per session**, breaks every 50 wines

Good luck! 🍷
