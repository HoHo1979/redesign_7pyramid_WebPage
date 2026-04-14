# ⚡ Vivino Automation - Quick Reference Card

## 📥 Installation (5 mins)

```
1. Install Tampermonkey (browser extension)
   Chrome: https://chrome.google.com/webstore/...
   Firefox: https://addons.mozilla.org/en-US/...
   Safari/Edge: See full guide

2. Install vivino-helper.user.js
   - Copy the code from file
   - Open Tampermonkey Dashboard
   - Click "+" → Paste code → Save

3. Open vivino-command-center.html in browser
   - Bookmark it!
```

## 🚀 Workflow (Per Wine)

```
Step 1: Click "🔗 Open Vivino Search"
        ↓ (new tab opens with wine name pre-filled)

Step 2: Find the wine in results
        Click the correct vintage
        ↓ (product page shows bottle image)

Step 3: Right-click bottle image
        Click "📋 Copy Image URL" (helper button)
        OR right-click → Copy Image Link
        ↓ (URL copied to clipboard)

Step 4: Return to Command Center tab
        Paste URL (Ctrl+V)
        ↓ (URL appears in field)

Step 5: Click "✅ Save URL & Next Wine"
        OR press Enter
        ↓ (moves to next wine automatically)

REPEAT!
```

## ⌨️ Keyboard Shortcuts

| Press | Action |
|-------|--------|
| **Enter** | Save & next wine |
| **Shift+Enter** | Skip wine |
| **Ctrl+N** | Open search |
| **Tab** | Jump to URL field |

## 📊 Command Center Layout

```
LEFT SIDE                    RIGHT SIDE
├─ Wine Queue               ├─ Current Wine Info
├─ Status (Total/Done)      ├─ Paste URL Here
├─ Progress Bar             ├─ Open Search Button
├─ Wine List                ├─ Save & Next Button
└─ Filter by Region         ├─ Skip Button
                            └─ Prev Button
```

## 🎯 Session Goals

| Session | Region | Wines | Time |
|---------|--------|-------|------|
| 1 | Bordeaux 1st Growth | 30 | 15 min |
| 2 | Bordeaux 2nd Growth | 38 | 20 min |
| 3 | Bordeaux 3rd Growth | 20 | 12 min |
| 4 | Bordeaux 5th Growth | 28 | 18 min |
| 5 | USA/Chile/Italy | 30 | 18 min |
| 6 | Sauternes/White | 12 | 8 min |
| **TOTAL** | **ALL** | **164** | **~1.5 hrs** |

## 🔄 After Collection

```bash
# 1. Export Command Center data (if needed)
npm run export-vivino-data

# 2. Merge into wine database
node merge-vivino-images.js

# 3. Validate
npm run validate

# 4. Build catalog
npm run build:wine
```

## 📝 What Happens Automatically

✅ Wine list loads into Command Center
✅ Vivino search opens with wine name pre-filled
✅ Copy button appears when you hover image
✅ Progress saves to browser storage
✅ URLs stored in memory
✅ Completed wines marked in list
✅ Can skip/view/navigate any wine

## 🚨 URL Format Check

**GOOD (Copy this):**
```
https://images.vivino.com/thumbs/7sQ6hL5K0T5Ug9DfZn8HrA_pb_x960.png
```

**WRONG (Don't copy this):**
```
https://www.vivino.com/wines/123456 ❌
```

## 💾 Data Persistence

- ✅ Saves to browser storage automatically
- ✅ Persists if you close browser
- ✅ Survives page refresh
- ✅ Can be exported via DevTools
- ✅ Can clear and start over

## 🎁 Expected Benefits

- **Time Saved**: 1-2 hours vs manual
- **Accuracy**: 100% (you control it)
- **Safety**: Respects Vivino ToS
- **Convenience**: One browser tab workflow
- **Tracking**: Visual progress dashboard

## 📞 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Copy button not showing | Hover over image, check Tampermonkey is on |
| Wine not found | Try simpler name or skip it |
| URL not pasting | Make sure it's an image URL not page URL |
| Lost data | Reopen HTML file, data is in browser storage |
| Keyboard shortcuts not working | Click URL field first |

## 🎬 Start Now

1. Open: `vivino-command-center.html`
2. Load: `VIVINO_SEARCH_TRACKER.csv`
3. Click: "🔗 Open Vivino Search"
4. Find: The wine on Vivino
5. Copy: Image URL
6. Paste: Back in Command Center
7. Save: Press Enter
8. **Repeat 163 more times!** ⚡

## 📈 Pro Tips

- Use full-screen + side-by-side windows
- Do one region at a time for momentum
- Take 5-min break every 50 wines
- Many wines share same image (can copy-paste)
- Open multiple Vivino tabs and rotate

## ✨ You've Got This!

Expected time: 2-3 hours total
Expected quality: 100% accuracy
Expected satisfaction: Very high! 🍷

---

**Questions?** See full guide: `VIVINO_AUTOMATION_SETUP.md`
