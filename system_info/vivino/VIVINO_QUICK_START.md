# 🍷 Vivino Image Collection - Quick Start

## What You Have

✅ **VIVINO_SEARCH_TRACKER.csv** - All 164 wines organized by region
✅ **VIVINO_SEARCH_GUIDE.md** - Detailed instructions
✅ **vivino-progress-tracker.html** - Visual progress dashboard
✅ **merge-vivino-images.js** - Auto-merge script

---

## 3-Step Process

### Step 1: Search & Collect (2-5 hours)
1. Open: https://www.vivino.com/search
2. Search each wine name + vintage
3. Copy image URL when found
4. Update CSV: Mark Status = "FOUND" and paste URL in Image_URL column

### Step 2: Track Progress (Optional)
1. Open: `vivino-progress-tracker.html` in your browser
2. Click "Load CSV Progress"
3. Select your CSV file
4. See real-time progress by region

### Step 3: Merge & Done
```bash
npm run merge-wine-images
```
This automatically updates `wines-data-template.json` with all collected URLs!

---

## Quick Search Tips

| Search | Example |
|--------|---------|
| **Standard** | `Margaux 2015` |
| **Full Name** | `Château Margaux 2015` |
| **Simplify** | If full name fails, try just `Margaux` |
| **Remove Accents** | `Haut Brion` instead of `Haut-Brion` |

---

## CSV Update Format

After searching and finding an image:

```csv
CH MARGAUX,2015,Bordeaux First Growth,FOUND,https://www.vivino.com/wines/123456,https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png,
```

**What to fill:**
- **Status**: Change from `PENDING` to `FOUND` or `NOT_FOUND`
- **Image_URL**: Paste the direct image link from Vivino
- **Notes** (optional): Any special info

---

## Session Plan (Recommended)

### Session 1 (1 hour) - Bordeaux First Growth
- CH MARGAUX (7 vintages)
- CH LAFITE ROTHSCHILD (3 vintages)
- CH LATOUR (2 vintages)
- CH HAUT BRION (6 vintages)
- CH MOUTON ROTHSCHILD (4 vintages)

**💡 Tip**: Many of these share the same bottle image across vintages!

### Session 2 (1 hour) - Bordeaux Second Growth
- RAUZAN SEGLA, LEOVILLE LAS CASES
- PICHON BARON, COS D'ESTOURNEL
- Secondary wines (Pavillon Rouge, etc.)

### Session 3 (1 hour) - Bordeaux Third & Fifth Growth
- KIRWAN, PALMER, CANTENAC BROWN
- PONTET CANET, LANGOA BARTON
- HAUT BAGES LIBERAL, etc.

### Session 4 (30 mins) - USA & Special
- OPUS ONE (multiple vintages)
- OVERTURE
- Vintage Sauternes (D'YQUEM, Rieussec)

### Session 5 (30 mins) - Chile & Italy
- ALMAVIVA, SENA, Vinedo Chadwick
- Masseto, Solaia, Bibi Graetz

---

## Important Notes

### About Vivino URLs
- ✅ Working URLs access through Vivino.com directly
- ✅ Copy image links BY RIGHT-CLICKING the bottle image
- ✅ Format: `https://images.vivino.com/thumbs/{ID}_pb_x960.png`

### Image URL Format
- **GOOD**: `https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png`
- **WRONG**: `https://vivino.com/wines/123456` (product page, not image)

### Handling Missing Wines
- Some very old vintages may not be on Vivino anymore
- If you can't find after 2-3 searches: Mark as `NOT_FOUND` and move on
- Don't spend >5 minutes per wine

### About Duplicates
- Many wines share the same image (same label, different vintage)
- **OK to reuse** the same image URL for similar wines
- **Note in CSV** if you're doing this

---

## After Collecting

### Run the Merge Script
```bash
node merge-vivino-images.js
```

This will:
- ✅ Read your VIVINO_SEARCH_TRACKER.csv
- ✅ Match wines by name + vintage
- ✅ Update wines-data-template.json
- ✅ Create backup automatically
- ✅ Show summary report

### Verify It Worked
```bash
npm run validate
```

This checks that all wines now have valid image URLs.

---

## Troubleshooting

### Issue: Can't find wine on Vivino
**Solution**: Try these search variations:
1. `Château Margaux 2015`
2. `Margaux 2015` (shorter)
3. `Margaux` (just the name, filter by vintage manually)
4. `Ch Margaux` (abbreviation)

### Issue: Multiple results
**Solution**: Choose the one with correct vintage year

### Issue: URL says "Access Denied" in browser
**Solution**: That's normal! The URL works from Vivino.com context. It will work when integrated on your site.

### Issue: Image is low quality
**Solution**: That's Vivino's standard size. All wines use `_pb_x960.png` format.

---

## Files You'll Edit

📝 **VIVINO_SEARCH_TRACKER.csv** - Your main tracking file
- This is where you paste image URLs as you search
- Format: Wine Name, Vintage, Region, Status, Vivino URL, Image URL, Notes

---

## Quick Reference URLs

- **Vivino Search**: https://www.vivino.com/search
- **Progress Tracker**: Open `vivino-progress-tracker.html` in browser
- **CSV File**: `VIVINO_SEARCH_TRACKER.csv` (in your project folder)

---

## Command Reference

```bash
# After collecting all URLs, run this to merge:
node merge-vivino-images.js

# Or using npm:
npm run merge-wine-images

# Validate that all wines have images:
npm run validate

# Build your wine catalog:
npm run build:wine
```

---

## Estimated Time

- **Per wine**: 1-2 minutes average
- **Full collection**: 4-5 hours over multiple sessions
- **Total effort**: 1-2 hours per focused session

---

## Need Help?

1. Check **VIVINO_SEARCH_GUIDE.md** for detailed steps
2. Look at **VIVINO_SEARCH_TRACKER.csv** for examples
3. Open **vivino-progress-tracker.html** to track progress visually

---

## Let's Go! 🚀

1. ✅ Save VIVINO_SEARCH_TRACKER.csv (already created)
2. 🔗 Go to https://www.vivino.com/search
3. 🍷 Start with Bordeaux First Growth wines
4. 📋 Update CSV as you find each image
5. 📊 Monitor progress in vivino-progress-tracker.html
6. ✨ Once done, run: `node merge-vivino-images.js`

**Good luck! Cheers! 🥂**
