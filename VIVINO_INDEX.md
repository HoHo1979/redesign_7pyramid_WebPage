# 🍷 Vivino Image Collection System - File Index

## 📚 Quick Navigation

### Getting Started (Read These First)
- 📖 **VIVINO_SYSTEM_SUMMARY.md** ← Start here! Complete overview
- ⚡ **VIVINO_QUICK_START.md** ← 3-step quick guide
- 🚀 **start-vivino-search.sh** ← Launch script (run: `./start-vivino-search.sh`)

### Main Files You'll Use
- 📋 **VIVINO_SEARCH_TRACKER.csv** ← The main file you edit with image URLs
- 📖 **VIVINO_SEARCH_GUIDE.md** ← Detailed step-by-step instructions
- 📊 **vivino-progress-tracker.html** ← Visual progress dashboard (open in browser)

### Automation Scripts
- 🔄 **merge-vivino-images.js** ← Merges collected URLs into wine data
- 🚀 **start-vivino-search.sh** ← Interactive menu launcher

---

## 📊 System Architecture

```
Your Session Workflow:
    ↓
1. Start with VIVINO_QUICK_START.md (overview)
    ↓
2. Use VIVINO_SEARCH_TRACKER.csv (main file)
    ↓
3. Follow VIVINO_SEARCH_GUIDE.md (detailed steps)
    ↓
4. Search Vivino.com (copy image URLs)
    ↓
5. Update CSV with collected URLs
    ↓
6. Track progress with vivino-progress-tracker.html
    ↓
7. Run: merge-vivino-images.js (automatic merge)
    ↓
Complete! 🎉
```

---

## 📁 File Descriptions

### 📖 VIVINO_SYSTEM_SUMMARY.md
**What**: Complete system overview and reference
**When to read**: First thing - gives you the big picture
**Content**:
- What's been created
- Complete workflow
- Time estimates
- FAQ
- Getting help

### ⚡ VIVINO_QUICK_START.md
**What**: Quick reference guide for quick actions
**When to read**: After system summary, before you start
**Content**:
- 3-step process
- Session plan
- Command reference
- Quick tips

### 📖 VIVINO_SEARCH_GUIDE.md
**What**: Detailed step-by-step instructions
**When to read**: When actually searching wines
**Content**:
- How to search Vivino
- Search strategies by region
- Tips and tricks
- Troubleshooting
- Time breakdown

### 📋 VIVINO_SEARCH_TRACKER.csv
**What**: The main CSV file with all 164 wines
**When to use**: Every time you search
**Format**:
```
Wine_Name, Vintage, Region, Status, Vivino_URL, Image_URL, Notes
```
**Columns**:
- Wine_Name: Name of wine
- Vintage: Year
- Region: Category (for organization)
- Status: PENDING / FOUND / NOT_FOUND
- Vivino_URL: Optional full product page
- Image_URL: The image link (what you copy)
- Notes: Special info

### 📊 vivino-progress-tracker.html
**What**: Visual progress dashboard
**When to use**: Track progress across sessions
**How to use**:
1. Open in web browser
2. Click "Load CSV Progress"
3. Select VIVINO_SEARCH_TRACKER.csv
4. See real-time progress by region

### 🔄 merge-vivino-images.js
**What**: Automation script to merge collected URLs
**When to use**: After collecting all/most images
**How to run**:
```bash
node merge-vivino-images.js
```
**Does**:
- Reads your CSV
- Matches wines by name+vintage
- Updates wines-data-template.json
- Creates backup
- Shows summary

### 🚀 start-vivino-search.sh
**What**: Interactive menu launcher
**When to use**: To start your session
**How to run**:
```bash
./start-vivino-search.sh
```
**Options**:
1. Open Progress Tracker
2. Open CSV Tracker
3. Open Vivino Website
4. View Search Guide
5. View Quick Start
6. Merge URLs

---

## 🎯 How to Use This System

### Day 1: Setup (30 minutes)
1. Read: VIVINO_SYSTEM_SUMMARY.md
2. Read: VIVINO_QUICK_START.md
3. Open: VIVINO_SEARCH_TRACKER.csv
4. Review: The organized wine list by region

### Day 2-6: Collection (1-2 hours per day)
1. Run: `./start-vivino-search.sh` → Choose option 2 (CSV)
2. Run: `./start-vivino-search.sh` → Choose option 3 (Vivino)
3. Search each wine, copy image URL
4. Update CSV: Mark FOUND, paste URL
5. Optional: `./start-vivino-search.sh` → Choose option 1 (tracker)

### Day 7: Merge
1. Run: `node merge-vivino-images.js`
2. Run: `npm run validate`
3. Run: `npm run build:wine`
4. Done! ✅

---

## 📝 CSV Column Reference

### Example Row
```csv
CH MARGAUX,2015,Bordeaux First Growth,FOUND,https://www.vivino.com/wines/123456,https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png,
```

### Status Values
- **PENDING** = Not searched yet (default)
- **FOUND** = Image URL collected, paste URL here
- **NOT_FOUND** = Couldn't find after searching
- **CHECKING** = Currently searching

### Notes Examples
```csv
,,,FOUND,,https://...,Same as 2015
,,,FOUND,,https://...,1.5L (same as 750ml)
,,,NOT_FOUND,,,"Very old vintage, not on Vivino"
,,,PENDING,,,"Check under alternative name"
```

---

## 🔍 Quick Search Reference

| If Wine Name Is | Try Searching |
|---|---|
| CH MARGAUX | `Margaux 2015` |
| CH. Mouton Rothschild | `Mouton 2018` |
| Château Pichon | `Pichon 2019` |
| Pavillon Rouge Margaux | `Pavillon 2015` |
| LE PETIT MOUTON | `Petit Mouton 2020` |

---

## ⏱️ Time Breakdown

| Task | Time |
|------|------|
| Read system summary | 10 min |
| Read quick start | 5 min |
| Bordeaux First Growth (30 wines) | 1 hour |
| Bordeaux Second Growth (38 wines) | 1 hour |
| Bordeaux Third & Fifth (54 wines) | 1.5 hours |
| USA, Chile, Italy (30 wines) | 1 hour |
| Sauternes & White (12 wines) | 30 min |
| Merge & validate | 5 min |
| **TOTAL** | **~5-6 hours** |

---

## 🎯 Recommended Reading Order

1. **START HERE**: VIVINO_SYSTEM_SUMMARY.md (10 min read)
2. **THEN**: VIVINO_QUICK_START.md (5 min read)
3. **BEFORE SEARCHING**: VIVINO_SEARCH_GUIDE.md (reference only)
4. **WHILE SEARCHING**: Keep VIVINO_SEARCH_TRACKER.csv open
5. **TO TRACK**: Open vivino-progress-tracker.html in browser
6. **TO MERGE**: Run `node merge-vivino-images.js`

---

## 🚀 TL;DR (Just Get Started!)

```bash
# 1. Launch interactive menu
./start-vivino-search.sh

# 2. Choose option 3 to go to Vivino
# 3. Search and copy image URLs
# 4. Update CSV with collected URLs

# 5. When done, merge everything
node merge-vivino-images.js

# 6. Validate
npm run validate
```

---

## 📞 Questions?

### Where do I find it?
- **System overview?** → VIVINO_SYSTEM_SUMMARY.md
- **Quick steps?** → VIVINO_QUICK_START.md
- **Detailed guide?** → VIVINO_SEARCH_GUIDE.md
- **Search tips?** → VIVINO_SEARCH_GUIDE.md (Tips section)
- **CSV format?** → This file (CSV Column Reference)
- **What file to edit?** → VIVINO_SEARCH_TRACKER.csv

### How do I...?
- **Start searching?** → Run `./start-vivino-search.sh`
- **Track progress?** → Run `./start-vivino-search.sh` → option 1
- **Update the CSV?** → Open VIVINO_SEARCH_TRACKER.csv in Excel/Sheets
- **Merge collected URLs?** → Run `node merge-vivino-images.js`
- **Know if it worked?** → Run `npm run validate`

---

## 🎉 You're All Set!

Everything you need is created and ready to go. Just:
1. Read VIVINO_SYSTEM_SUMMARY.md
2. Start with `./start-vivino-search.sh`
3. Follow the guide and search systematically
4. Run merge script when done

**Total time**: 5-6 hours across multiple days
**Result**: All 164 wines with proper image URLs

Good luck! 🍷 Cheers! 🥂
