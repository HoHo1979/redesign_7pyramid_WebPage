# 🍷 Vivino Automation Setup Guide

## What You're Getting

A **browser-based automation system** that:
- ✅ Opens Vivino searches automatically with wine names pre-filled
- ✅ Helps you copy image URLs with one click
- ✅ Tracks your progress across sessions
- ✅ Organizes wines by region
- ✅ Saves everything locally (respects Vivino's policies)

**Time to setup**: 5-10 minutes
**Time to collect 164 URLs**: 2-3 hours (much faster than manual!)

---

## 📦 Installation (Step by Step)

### Step 1: Install Tampermonkey (Choose Your Browser)

**Chrome:**
1. Go to: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobblb
2. Click "Add to Chrome" → "Add Extension"
3. Done! You'll see a new icon in your toolbar

**Firefox:**
1. Go to: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
2. Click "Add to Firefox" → "Add"
3. Done!

**Safari:**
1. Go to: https://www.tampermonkey.net/
2. Click "Safari" → Download .zip file
3. Unzip and install
4. Done!

**Edge:**
1. Go to: https://www.microsoft.com/en-us/edge/extensions/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd
2. Click "Get" → "Add Extension"
3. Done!

### Step 2: Install the Vivino Helper Script

1. **Open the script file**: `vivino-helper.user.js` (in your project folder)
2. **Copy all the code** (Ctrl+A → Ctrl+C)
3. **Go to Tampermonkey dashboard**: Click the Tampermonkey icon in toolbar → "Dashboard"
4. **Click "+" to create new script**
5. **Delete the template code** and **paste the vivino-helper.user.js code**
6. **Save** (Ctrl+S)
7. **Done!** You should see a confirmation message

### Step 3: Open the Command Center

1. **Open this file in your browser**: `vivino-command-center.html`
2. **Bookmark it** for easy access next time
3. **Done!**

---

## 🚀 How to Use (Complete Walkthrough)

### The Basic Workflow

```
Command Center          →  Vivino Website           →  Back to Command Center
Load CSV                →  See wine name
Click "Open Search"     →  Pre-filled search box
                        →  Click on wine result
                        →  Right-click bottle image
                        →  Click "Copy Image URL"  (from helper script)
                        →  Return to Command Center
Paste URL               →  Click "Save & Next"
                        →  Move to next wine
(Repeat)
```

### Detailed Steps

#### Session Setup (First Time)

1. **Open Command Center**
   - File: `vivino-command-center.html`
   - Bookmark this page!

2. **Load Your Wine CSV**
   - Click: "📁 Load Wine List"
   - Select: `VIVINO_SEARCH_TRACKER.csv`
   - You'll see all 164 wines organized by region

3. **Optional: Filter by Region**
   - Dropdown shows progress by region
   - Click "Bordeaux First Growth" to focus on just those wines

#### Per-Wine Workflow

**Step 1: Open Search**
- Click: "🔗 Open Vivino Search"
- New tab opens: Vivino with wine name pre-filled in search box
- Example: `CH MARGAUX 2015`

**Step 2: Find the Wine**
- Browse results
- Click the correct wine (match vintage year)
- You'll see the product page with bottle image

**Step 3: Copy Image URL**
- **Right-click** on the bottle image
- Look for: **"Copy Image Link"** option
  - If using helper script: You'll see a **"📋 Copy Image URL"** button overlay
  - Click that button (much easier!)
- OR standard right-click → "Copy Image Link"

**Step 4: Return to Command Center**
- Go back to the Command Center tab
- Paste URL in: "Wine Image URL" field (Ctrl+V)

**Step 5: Save & Continue**
- Click: "✅ Save URL & Next Wine"
- Or press: **Enter** (keyboard shortcut)
- Automatically moves to next wine
- Repeat!

---

## ⌨️ Keyboard Shortcuts (Super Fast!)

Once you get the rhythm, use keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| **Enter** | Save current URL & go to next wine |
| **Shift+Enter** | Skip this wine |
| **Ctrl+N** | Open Vivino search in new tab |
| **Tab** | Jump to image URL field |

**Super Fast Workflow:**
1. Ctrl+N (opens Vivino search)
2. Find wine, right-click image, copy URL
3. Alt+Tab back to Command Center
4. Paste URL
5. Press Enter
6. Repeat! ⚡

**Expected time per wine**: 30-45 seconds (after first few)

---

## 🎯 Session Planning

### Session 1: Bordeaux First Growth (30 wines, 15-20 mins)
1. Open Command Center
2. Filter: "Bordeaux First Growth"
3. Open search for each wine
4. Copy & save URLs
5. Takes about 15-20 minutes

### Session 2: Bordeaux Second Growth (38 wines, 20-25 mins)
(Similar workflow)

### Session 3: Bordeaux Third Growth (20 wines, 12-15 mins)

### Session 4: Bordeaux Fifth Growth (28 wines, 18-22 mins)

### Session 5: USA, Chile, Italy (30 wines, 18-22 mins)

### Session 6: Sauternes & White (12 wines, 8-10 mins)

**Total: ~6 hours across 6 sessions = 1 hour per day**

---

## 📊 Understanding the Command Center Interface

### Left Panel: Wine Queue
- **Status numbers**: Total, Remaining, Complete
- **Progress bar**: Visual % complete
- **Wine list**: All wines, colored by region
- **Filter dropdown**: Focus on one region at a time
- **View/Remove buttons**: Manage wine list

### Right Panel: Current Wine
- **Current wine display**: Name, vintage, region
- **Image URL input**: Where you paste the copied URL
- **Open Vivino Search**: Opens new tab with pre-filled search
- **Save & Next**: Saves URL and moves to next wine
- **Skip/Previous**: Navigate through wines

### Tips
- ✅ Wine list shows which wines are completed (green checkmark)
- ✅ Click "View" on any wine to jump to it
- ✅ Remove wines you can't find (won't break anything)
- ✅ Session saves automatically to browser storage

---

## 💾 Data Saving

**How it works:**
- ✅ All progress saves to browser storage (automatically)
- ✅ Wine list and completed wines stored locally
- ✅ Persists even if you close the page
- ✅ Clear "Clear Completed" button to reset progress if needed

**Export Your Results:**
After you're done, the image URLs are stored in memory. To save them permanently:

1. **Open your browser's developer tools** (F12 or Ctrl+Shift+I)
2. **Go to Application → Local Storage**
3. **Find entry**: `vivino_wines_data`
4. **Copy the JSON data**
5. **Paste into a text file** for backup

Or better yet, run the **merge script** (see below).

---

## 🔄 After Collection: Merging Data

Once you've collected all (or most) URLs, merge them back:

### Step 1: Export Your Data
The command center stores data in browser storage. You need to export it:

**Option A: Simple Export (Recommended)**
```bash
# Run this to save your command center data
npm run export-vivino-data
```

**Option B: Manual Export**
1. Open Command Center
2. Open Browser DevTools (F12)
3. Go to: Application → Local Storage → vivino_wines_data
4. Copy all the data
5. Paste into a temporary text file

### Step 2: Update Your CSV Tracker
1. Export the Command Center data
2. Update `VIVINO_SEARCH_TRACKER.csv` with collected URLs
3. Mark Status as "FOUND" for completed wines

### Step 3: Run the Merge Script
```bash
cd /path/to/seven_pyramid
node merge-vivino-images.js
```

This automatically:
- ✅ Reads your CSV
- ✅ Matches wines by name+vintage
- ✅ Updates wines-data-template.json
- ✅ Creates backup
- ✅ Shows summary

### Step 4: Verify
```bash
npm run validate
```

---

## 🐛 Troubleshooting

### Issue: Tampermonkey script not working
**Solution:**
1. Check Tampermonkey is enabled (icon in toolbar)
2. Go to Vivino website
3. Check browser console (F12) for errors
4. Re-copy and paste the script code into Tampermonkey

### Issue: "Copy Image URL" button not showing on Vivino
**Solution:**
1. Make sure Tampermonkey is installed and enabled
2. Make sure vivino-helper.user.js is in Tampermonkey dashboard
3. Refresh Vivino page
4. Hover over the wine image (button appears on hover)

### Issue: Can't find wine on Vivino
**Solution:**
1. Try simpler name: "Margaux" instead of "CH MARGAUX"
2. Remove accents: "Haut Brion" instead of "Haut-Brion"
3. Just the winery: "Mouton" instead of "CH. Mouton Rothschild"
4. Click "Skip" in Command Center, come back to it later

### Issue: Command Center lost my data
**Solution:**
1. Refresh the page (data should still be in browser storage)
2. If page was closed, re-open `vivino-command-center.html`
3. Data should auto-load
4. If lost, reload your CSV again

### Issue: Can't paste URL
**Solution:**
1. Make sure you copied the image URL (not product page URL)
2. Image URL format: `https://images.vivino.com/thumbs/...`
3. Right-click image and select "Copy Image Link"
4. Or use the helper button if available

### Issue: Keyboard shortcuts not working
**Solution:**
1. Make sure you're focused in the image URL field
2. Click on the URL input box first
3. Try again

---

## 📈 Expected Results

### Time Savings
- Manual method: 1-2 minutes per wine = 2.5-5 hours total
- **Automated method**: 30-45 seconds per wine = **1.5-2.5 hours total**
- **Savings: 1-2.5 hours!** ⚡

### Accuracy
- 100% accuracy (you're doing the clicking/confirming)
- Respects Vivino's policies (manual interaction)
- Safe from bot detection (human-controlled)

### Data Quality
- Proper Vivino image URLs
- Works on your website
- Future-proof (Vivino's official CDN)

---

## ✨ Tips for Maximum Speed

1. **Use keyboard shortcuts** - Much faster than clicking buttons
2. **Open in full screen** - Vivino on left, Command Center on right
3. **Do one region at a time** - Builds momentum
4. **Take breaks** - 50 wines, then 5-minute break
5. **Pre-load searches** - Have 2-3 tabs open and rotate
6. **Copy-paste workflow**: Open → Find → Copy → Return → Paste → Save → Next

---

## Files You Have

| File | Purpose |
|------|---------|
| vivino-helper.user.js | Tampermonkey script - adds copy buttons to Vivino |
| vivino-command-center.html | Main automation interface |
| VIVINO_SEARCH_TRACKER.csv | Your wine list (load into command center) |
| VIVINO_AUTOMATION_SETUP.md | This file |

---

## Questions?

**How long to setup?** 5-10 minutes (mostly installing Tampermonkey)

**How long to use?** 1.5-2.5 hours for all 164 wines

**Is it safe?** Yes! Human-controlled, respects Vivino's ToS

**Can I stop and resume?** Yes! Progress saves automatically

**What if I close the page?** Data persists in browser storage, just reopen the HTML file

---

## Let's Get Started! 🚀

1. ✅ Install Tampermonkey (5 mins)
2. ✅ Install vivino-helper.user.js script (2 mins)
3. ✅ Open vivino-command-center.html (1 min)
4. ✅ Load your CSV (1 min)
5. ✅ Start collecting URLs! (1.5-2.5 hours)
6. ✅ Run merge script (5 mins)

**Total setup time: 10 minutes**
**Total collection time: 2-3 hours**
**Total automation time: ~3 hours**

Good luck! 🍷 Let me know if you hit any issues! 🥂
