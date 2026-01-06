#!/bin/bash

# Start Vivino Image Search Session
# Usage: ./start-vivino-search.sh

echo ""
echo "🍷 Vivino Image Search Session Starter"
echo "========================================"
echo ""

# Check if files exist
if [ ! -f "VIVINO_SEARCH_TRACKER.csv" ]; then
  echo "❌ Error: VIVINO_SEARCH_TRACKER.csv not found"
  exit 1
fi

if [ ! -f "VIVINO_SEARCH_GUIDE.md" ]; then
  echo "❌ Error: VIVINO_SEARCH_GUIDE.md not found"
  exit 1
fi

echo "✅ All files found!"
echo ""
echo "What would you like to do?"
echo ""
echo "1) Open Progress Tracker (browser)"
echo "2) Open CSV Tracker (spreadsheet)"
echo "3) Open Vivino Website"
echo "4) View Search Guide"
echo "5) View Quick Start"
echo "6) Merge collected URLs into wine data"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
  1)
    echo "📊 Opening Progress Tracker..."
    open vivino-progress-tracker.html || xdg-open vivino-progress-tracker.html
    ;;
  2)
    echo "📋 Opening CSV Tracker..."
    open VIVINO_SEARCH_TRACKER.csv || xdg-open VIVINO_SEARCH_TRACKER.csv
    ;;
  3)
    echo "🔗 Opening Vivino Website..."
    open "https://www.vivino.com/search" || xdg-open "https://www.vivino.com/search"
    ;;
  4)
    echo "📖 Opening Search Guide..."
    open VIVINO_SEARCH_GUIDE.md || xdg-open VIVINO_SEARCH_GUIDE.md
    ;;
  5)
    echo "⚡ Opening Quick Start..."
    open VIVINO_QUICK_START.md || xdg-open VIVINO_QUICK_START.md
    ;;
  6)
    echo "🔄 Merging URLs into wine data..."
    if [ -f "merge-vivino-images.js" ]; then
      node merge-vivino-images.js
    else
      echo "❌ Error: merge-vivino-images.js not found"
    fi
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✨ All set! Happy searching! 🥂"
echo ""
