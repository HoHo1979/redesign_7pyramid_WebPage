# 🍷 Vivino Automation System - START HERE

## What You're Getting

A **browser-based automation system** that reduces manual wine searching from **5-6 hours → 2-3 hours** ⚡

**Before**: Manual search, find, copy, paste for each wine (slow)
**After**: Automatic tab opening, copy buttons, single-tab workflow (fast)

---

## ⚡ Quick Start (10 mins)

### 1. Install Tampermonkey (5 mins)
- Chrome: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobblb
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
- Safari/Edge: See full guide (VIVINO_AUTOMATION_SETUP.md)

### 2. Install Helper Script (3 mins)
- Open: `vivino-helper.user.js` (copy all code)
- Open: Tampermonkey Dashboard (click icon)
- Click: "+" to create new script
- Paste: The code
- Save: (Ctrl+S)

### 3. Open Command Center (2 mins)
- Open in browser: `vivino-command-center.html`
- Load CSV: `VIVINO_SEARCH_TRACKER.csv`
- **You're ready to go!**

---

## 🎯 The Workflow (Per Wine: 30-45 seconds)

```
1. Click "Open Vivino Search"      (auto-opens tab with wine name pre-filled)
2. Find the wine, click result      (you do this manually for accuracy)
3. Right-click image → Copy URL     (helper script adds easy copy button)
4. Return to Command Center         (alt+tab)
5. Paste URL in field              (ctrl+v)
6. Click "Save & Next"             (or press Enter)
7. Next wine loads automatically
```

**That's it!** Repeat 164 times = ~2-3 hours total

---

## 📚 Documentation Files

**Read in this order:**

1. **AUTOMATION_QUICK_REF.md** ← **Read this first** (1 min)
   - Cheat sheet with all you need
   - Keyboard shortcuts
   - Workflow diagram

2. **VIVINO_AUTOMATION_SETUP.md** (10 min read)
   - Detailed setup instructions
   - Screenshots/steps
   - Troubleshooting guide

3. **Reference when needed:**
   - `vivino-command-center.html` - The app itself
   - `vivino-helper.user.js` - The Tampermonkey script

---

## 🚀 The Three Tools You're Using

### 1. vivino-helper.user.js
**What**: Tampermonkey script
**Where**: Runs on Vivino website
**Does**: Adds "Copy Image URL" button when you hover wine image

### 2. vivino-command-center.html
**What**: Browser app/dashboard
**Where**: Opens in your browser
**Does**:
- Shows wine queue
- Opens Vivino searches automatically
- Tracks progress
- Saves URLs and progress

### 3. merge-vivino-images.js
**What**: Node.js automation script
**When**: After you collect all URLs
**Does**: Automatically merges URLs back into wine database
**Run**: `node merge-vivino-images.js`

---

## 📊 Time Breakdown

| Task | Time |
|------|------|
| Install Tampermonkey | 5 min |
| Install helper script | 3 min |
| Open Command Center | 1 min |
| Load wine CSV | 1 min |
| **Collect 164 URLs** | **90-150 min** |
| Merge into database | 5 min |
| **TOTAL** | **~2-3 hours** |

**Compare to manual:**
- Manual: 5-6 hours (2-3 min per wine)
- Automated: 2-3 hours (30-45 sec per wine)
- **Saves: 2-3 hours!** ⏱️

---

## 🎮 Quick Commands

```bash
# After collecting all URLs, run this to merge:
node merge-vivino-images.js

# Validate it worked:
npm run validate

# Build your wine catalog:
npm run build:wine
```

---

## ✨ What Makes This Fast

1. **Auto Search Opens**: Click once, tab opens with wine name pre-filled
2. **Smart Copy Button**: Hover image → button appears → click to copy
3. **Single Tab Workflow**: Open search → find → copy → return → paste → save
4. **Keyboard Shortcuts**: Press Enter to save & next (no mouse clicks)
5. **Progress Tracking**: See % complete, skip problematic wines
6. **Auto Storage**: Everything saves to browser automatically

---

## 🔄 Typical Session Flow

```
Monday (30 mins) - Bordeaux First Growth
├─ Open Command Center
├─ Filter: "Bordeaux First Growth"
├─ Search & collect 30 wines
└─ Close

Tuesday (20 mins) - Bordeaux Second Growth
├─ Open Command Center (data still there!)
├─ Filter: "Bordeaux Second Growth"
├─ Search & collect 38 wines
└─ Close

(Continue with 3rd Growth, 5th Growth, International...)

Final Session (5 mins)
├─ Run: node merge-vivino-images.js
├─ Run: npm run validate
└─ Done!
```

---

## 💡 Pro Tips

### Go Even Faster
- **Open 2 Vivino tabs** and rotate between them
- **Use side-by-side windows** (Command Center on left, Vivino on right)
- **Keyboard only**: Copy/Paste/Save all with keyboard
- **Do one region** at a time (builds momentum)

### Handle Hard Cases
- **Wine not found?** Click "Skip" and continue
- **Wrong image?** Just don't save and try again
- **Same image?** You can copy-paste same URL for similar wines (note in tracker)

### Efficiency Hacks
- **Pre-load searches**: Have 2-3 Vivino tabs open
- **Batch similar wines**: All 2015-2020 vintages of same wine (often same image)
- **Take breaks**: 50 wines → 5 min break → 50 more

---

## ❌ Common Questions Answered

**Q: Will Vivino block me?**
A: No! You're clicking manually (not a bot). The automation just opens tabs and helps with copying.

**Q: How accurate is this?**
A: 100% - you're doing the finding and confirming, automation just helps with opening/copying.

**Q: Can I stop and resume?**
A: Yes! Progress saves automatically to browser storage.

**Q: What if I close the browser?**
A: Just reopen `vivino-command-center.html` - your progress is still there!

**Q: How long does one wine take?**
A: 30-45 seconds (after the first few).

**Q: Is it worth the setup time?**
A: YES! 10 min setup saves 2-3 hours of collection.

---

## 🎯 Next Steps

### Right Now (30 seconds)
1. Read: `AUTOMATION_QUICK_REF.md` (1 min)
2. Decide: Start setup now? (yes/no)

### Setup Phase (10 mins)
1. Follow: `VIVINO_AUTOMATION_SETUP.md`
2. Install Tampermonkey
3. Install helper script
4. Open Command Center

### Collection Phase (2-3 hours)
1. Load your wine CSV
2. Start clicking through wines
3. Open search → Find → Copy → Return → Paste → Save
4. Repeat!

### Merge Phase (5 mins)
1. Run: `node merge-vivino-images.js`
2. Run: `npm run validate`
3. Done! 🎉

---

## 📍 Files in This System

```
vivino-helper.user.js
└─ The Tampermonkey script (adds copy button to Vivino)

vivino-command-center.html
└─ The main app you use (opens in browser)

VIVINO_AUTOMATION_SETUP.md
└─ Full installation & troubleshooting guide

AUTOMATION_QUICK_REF.md
└─ One-page cheat sheet

merge-vivino-images.js
└─ Merge script (run after collecting)

VIVINO_SEARCH_TRACKER.csv
└─ Your wine list (load into command center)
```

---

## ✅ Checklist to Get Started

- [ ] Install Tampermonkey browser extension
- [ ] Copy & paste vivino-helper.user.js into Tampermonkey
- [ ] Open vivino-command-center.html in browser
- [ ] Load VIVINO_SEARCH_TRACKER.csv into command center
- [ ] Click "Open Vivino Search" for first wine
- [ ] Find wine, copy image URL
- [ ] Return and paste URL
- [ ] Click "Save & Next"
- [ ] **You're officially collecting! 🎉**

---

## 🎁 What You'll Have When Done

✅ **All 164 wine image URLs collected**
✅ **Automatic merge into wine database**
✅ **Complete wine catalog with images**
✅ **Ready to deploy**
✅ **2-3 hours saved vs manual method**

---

## 🚀 Ready to Start?

**1 minute read:** `AUTOMATION_QUICK_REF.md`
**10 minute setup:** `VIVINO_AUTOMATION_SETUP.md`
**2-3 hour collection:** Use the Command Center
**5 minute merge:** `node merge-vivino-images.js`

**Total time investment: ~3 hours**
**Time saved vs manual: 2-3 hours**
**Your result: Complete wine database with images**

---

## 💬 Questions?

- **Quick question?** Check `AUTOMATION_QUICK_REF.md`
- **Setup help?** See `VIVINO_AUTOMATION_SETUP.md`
- **Troubleshooting?** See "Troubleshooting" in setup guide
- **How it works?** See workflow diagrams in quick ref

---

## 🍷 Let's Go!

You have everything you need. This system is designed to:
- ✅ Be fast (2-3 hours vs 5-6)
- ✅ Be accurate (100% human controlled)
- ✅ Be safe (respects Vivino ToS)
- ✅ Be reliable (saves progress automatically)

**Start with**: `AUTOMATION_QUICK_REF.md` (1 min read)
**Then**: Follow `VIVINO_AUTOMATION_SETUP.md` (10 min setup)
**Then**: Use `vivino-command-center.html` (2-3 hour collection)
**Finally**: Run merge script (5 mins)

**You've got this! 🥂 Cheers!**
