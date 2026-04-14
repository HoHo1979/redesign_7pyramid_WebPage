# Seven Pyramid Wine Project - Git Guide
## Best Practices for Version Control

### 🗂️ What's Ignored by .gitignore

#### ❌ Never Committed (Ignored):
- `node_modules/` - Dependencies (can be reinstalled)
- `backups/`, `backups-csp/` - Auto-generated backups
- `.DS_Store`, `.idea/` - System and IDE files
- `generated/` - Auto-generated wine catalog HTML
- `*.log` - Log files
- `*.backup` - Temporary backup files
- `wine-analytics.json` - Generated analytics reports

#### ✅ Always Committed (Tracked):
- `package.json`, `package-lock.json` - Project configuration
- `wines-data-template.json` - Wine database template
- `build-wine-catalog.js` - Build system
- `css/`, `js/`, `img/` - Source assets
- `index.html`, `wine_list.html` - Main HTML files
- `*.md` - Documentation files

---

## 📋 Recommended Git Workflow

### Initial Setup
```bash
# Add all appropriate files
git add .

# First commit
git commit -m "Initial commit: Seven Pyramid wine catalog system

🍷 Added wine catalog management system with:
- Static site generator for 2000+ wine records
- CSP-compliant JavaScript
- SEO optimization with structured data
- Price update utilities
- Data validation and analytics

🚀 Generated with Claude Code"

# Connect to remote repository (if you have one)
git remote add origin https://github.com/yourusername/seven-pyramid-wine.git
git branch -M main
git push -u origin main
```

### Daily Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Update wine prices for December 2024

- Added 15 new Bordeaux wines
- Updated pricing for 2018 vintages
- Fixed CSP violations in navigation"

# Push to remote
git push
```

---

## 📝 Commit Message Guidelines

### Format:
```
Brief description (50 chars max)

Optional detailed explanation:
- What was changed
- Why it was changed
- Any business impact

🍷 Wine business related
🚀 Generated with Claude Code
```

### Examples:
```bash
# Wine data updates
git commit -m "Add 25 new Australian wines to catalog

- Added Barossa Valley Shiraz collection
- Updated pricing for premium range
- Added tasting notes and food pairings

🍷 Inventory expansion for Q1 2025"

# Technical updates
git commit -m "Fix mobile responsive layout issues

- Improved wine card display on mobile
- Fixed navigation dropdown on tablets
- Updated CSS media queries

🚀 Generated with Claude Code"

# Price updates
git commit -m "Weekly price update - December 2024

- Updated 147 wine prices
- Applied 5-15% discounts for holiday promotion
- Fixed pricing inconsistencies in French wines

🍷 Holiday promotion pricing"
```

---

## 🌿 Branch Strategy

### Main Branch
- `main` - Production-ready code
- Always deployable
- Protected from direct pushes

### Feature Branches
```bash
# Create feature branch
git checkout -b feature/new-wine-region
git checkout -b fix/mobile-navigation
git checkout -b update/holiday-pricing

# Work on changes...
git add .
git commit -m "Descriptive commit message"

# Push feature branch
git push -u origin feature/new-wine-region

# Merge back to main (after testing)
git checkout main
git merge feature/new-wine-region
git push origin main

# Clean up
git branch -d feature/new-wine-region
git push origin --delete feature/new-wine-region
```

---

## 🔐 Sensitive Data Protection

### Never Commit:
- Customer databases
- Payment information
- API keys or passwords
- Private inventory data
- Sales reports with customer info

### If You Accidentally Commit Sensitive Data:
```bash
# Remove from history (DANGEROUS - use carefully)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch sensitive-file.json' \
--prune-empty --tag-name-filter cat -- --all

# Force push (if using remote)
git push origin --force --all
```

---

## 📊 Wine Business Specific Workflows

### Updating Wine Catalog
```bash
# 1. Update wine data
# Edit wines-data-template.json

# 2. Validate data
npm run validate

# 3. Build new catalog
npm run build:wine

# 4. Test locally
npm run serve

# 5. Commit changes
git add wines-data-template.json
git commit -m "Add new Champagne collection for New Year 2025

- Added 12 premium Champagne bottles
- Updated pricing and availability
- Added tasting notes and vintage information

🍷 New Year collection launch"

# 6. Deploy
npm run deploy
git push
```

### Price Updates
```bash
# 1. Create price update CSV
node update-wine-prices.js --sample

# 2. Edit price-updates.csv with new prices

# 3. Apply updates
node update-wine-prices.js price-updates.csv

# 4. Rebuild catalog
npm run build:wine

# 5. Commit changes
git add wines-data-template.json
git commit -m "Weekly price update - $(date +%Y-%m-%d)

- Updated $(grep -v wine_id price-updates.csv | wc -l) wine prices
- Applied seasonal discounts
- Synchronized with supplier pricing

🍷 Automated price synchronization"

# 6. Clean up temporary file
rm price-updates.csv
git push
```

### Adding New Features
```bash
# 1. Create feature branch
git checkout -b feature/wine-reviews

# 2. Develop feature
# ... make changes ...

# 3. Test thoroughly
npm run validate
npm run csp-check
npm run build:wine

# 4. Commit with detailed message
git commit -m "Add customer wine review system

Features added:
- Customer rating (1-5 stars)
- Written reviews with character limit
- Review moderation system
- Display on individual wine pages

Technical implementation:
- Added review schema to JSON structure
- Updated build system for review HTML
- Added CSS for star ratings
- Implemented review validation

🚀 Generated with Claude Code
🍷 Customer engagement enhancement"

# 5. Merge to main
git checkout main
git merge feature/wine-reviews
git push origin main
```

---

## 🚨 Emergency Procedures

### Rollback to Previous Version
```bash
# See recent commits
git log --oneline -5

# Rollback to specific commit
git revert [commit-hash]
git push

# Or reset (DANGEROUS - only if not pushed)
git reset --hard [commit-hash]
```

### Fix Broken Build
```bash
# Quick fix for broken wine catalog
git checkout main
git pull

# Restore from backup if needed
cp backups/wines-data-backup-*.json wines-data-template.json

# Rebuild and test
npm run validate
npm run build:wine
npm run serve

# Commit fix
git add .
git commit -m "Emergency fix: restore wine data from backup

- Restored from backup due to data corruption
- Rebuilt catalog successfully
- All validation tests passing

🚨 Emergency recovery"
git push
```

---

## 📈 Git Analytics

### Track Your Progress
```bash
# See commit history
git log --oneline --graph

# See file changes over time
git log --stat wines-data-template.json

# See who changed what
git blame wines-data-template.json

# See changes between versions
git diff HEAD~1 wines-data-template.json
```

### Wine Business Metrics
```bash
# Count wine additions over time
git log --grep="new.*wine" --oneline | wc -l

# Track price updates
git log --grep="price update" --since="1 month ago"

# See feature development
git log --grep="feature" --oneline
```

---

## ✅ Pre-Commit Checklist

Before every commit:
- [ ] `npm run validate` - Data validation passes
- [ ] `npm run csp-check` - No CSP violations
- [ ] `npm run build:wine` - Catalog builds successfully
- [ ] Test wine catalog locally
- [ ] Check for sensitive data in commit
- [ ] Write descriptive commit message
- [ ] Files properly categorized in .gitignore

---

## 🔗 Useful Git Aliases

Add to your `~/.gitconfig`:
```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    wine-log = log --grep="wine" --oneline
    wine-stats = !git log --since="1 month ago" --grep="wine\\|price\\|catalog" --oneline | wc -l
    recent = log --oneline -10
    wine-diff = diff wines-data-template.json
```

---

**🍷 Happy coding and wine cataloging!**

*Remember: Good version control is like good wine - it gets better with proper care and attention to detail.*