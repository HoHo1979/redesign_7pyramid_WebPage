#!/usr/bin/env node

/**
 * Merge Vivino image URLs from CSV back into wines-data-template.json
 * Run: node merge-vivino-images.js
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/lib/sync');

const TRACKER_CSV = './VIVINO_SEARCH_TRACKER.csv';
const WINE_DATA = './wines-data-template.json';
const BACKUP_FILE = './wines-data-template.backup.json';

try {
  console.log('🍷 Merging Vivino image URLs...\n');

  // 1. Read CSV tracker
  if (!fs.existsSync(TRACKER_CSV)) {
    console.error(`❌ Error: ${TRACKER_CSV} not found`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(TRACKER_CSV, 'utf-8');
  const records = csv(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`📊 Found ${records.length} wines in CSV tracker`);

  // 2. Build mapping from CSV
  const imageMap = {};
  let foundCount = 0;
  let notFoundCount = 0;
  let skipCount = 0;

  records.forEach((record) => {
    const status = record.Status?.trim().toUpperCase();
    const wineName = record.Wine_Name?.trim();
    const vintage = record.Vintage?.trim();
    const imageUrl = record.Image_URL?.trim();

    if (status === 'FOUND' && imageUrl) {
      // Create keys for matching
      const key1 = `${wineName} ${vintage}`.toLowerCase();
      const key2 = `${wineName.toUpperCase()} ${vintage}`.toUpperCase();

      imageMap[key1] = imageUrl;
      imageMap[key2] = imageUrl;
      foundCount++;
    } else if (status === 'NOT_FOUND') {
      notFoundCount++;
    } else {
      skipCount++;
    }
  });

  console.log(`✅ FOUND: ${foundCount} | ❌ NOT_FOUND: ${notFoundCount} | ⏭️  PENDING: ${skipCount}\n`);

  // 3. Read wine data
  if (!fs.existsSync(WINE_DATA)) {
    console.error(`❌ Error: ${WINE_DATA} not found`);
    process.exit(1);
  }

  const wineDataContent = fs.readFileSync(WINE_DATA, 'utf-8');
  const wineData = JSON.parse(wineDataContent);

  // 4. Backup original
  if (!fs.existsSync(BACKUP_FILE)) {
    fs.writeFileSync(BACKUP_FILE, wineDataContent, 'utf-8');
    console.log(`💾 Backup created: ${BACKUP_FILE}\n`);
  }

  // 5. Update wine data with new image URLs
  let updated = 0;
  let alreadyHad = 0;

  wineData.forEach((wine) => {
    const wineName = wine.name?.trim();
    const vintage = wine.vintage?.toString().trim();

    if (!wineName || !vintage) return;

    // Try exact match
    const key1 = `${wineName} ${vintage}`.toLowerCase();
    const key2 = `${wineName.toUpperCase()} ${vintage}`.toUpperCase();

    let newImageUrl = imageMap[key1] || imageMap[key2];

    if (newImageUrl) {
      if (wine.image_url && wine.image_url.includes('vivino')) {
        alreadyHad++;
      } else if (!wine.image_url) {
        wine.image_url = newImageUrl;
        updated++;
        console.log(`✅ Updated: ${wineName} ${vintage}`);
      } else {
        wine.image_url = newImageUrl;
        updated++;
        console.log(`🔄 Replaced: ${wineName} ${vintage}`);
      }
    }
  });

  // 6. Save updated wine data
  fs.writeFileSync(WINE_DATA, JSON.stringify(wineData, null, 2), 'utf-8');

  // 7. Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📈 MERGE SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Updated:        ${updated} wines`);
  console.log(`👍 Already had:    ${alreadyHad} wines`);
  console.log(`❓ Not matched:    ${wineData.length - updated - alreadyHad} wines`);
  console.log(`${'='.repeat(60)}\n`);

  // 8. Generate report
  const unmatched = [];
  wineData.forEach((wine) => {
    if (!wine.image_url) {
      unmatched.push(`${wine.name} ${wine.vintage}`);
    }
  });

  if (unmatched.length > 0) {
    console.log(`⚠️  Wines still missing images: ${unmatched.length}`);
    console.log('(Check VIVINO_SEARCH_TRACKER.csv for remaining NOT_FOUND wines)\n');
  } else {
    console.log('🎉 All wines now have image URLs!\n');
  }

  console.log(`✨ Updated: ${WINE_DATA}`);
  console.log('✨ Backup saved to: ' + BACKUP_FILE);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
