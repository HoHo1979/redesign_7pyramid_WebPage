#!/usr/bin/env node

/**
 * Seven Pyramid Wine Price Update System
 * Updates wine prices from CSV/Excel files while maintaining SEO structure
 * Usage: node update-wine-prices.js [price-file.csv]
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class WinePriceUpdater {
  constructor() {
    this.wineDataFile = './wines-data-template.json';
    this.backupDir = './backups';
    this.updatedWines = 0;
    this.errors = [];
  }

  /**
   * Create backup of current wine data
   */
  createBackup() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupFile = path.join(this.backupDir, `wines-data-backup-${timestamp}.json`);

    try {
      fs.copyFileSync(this.wineDataFile, backupFile);
      console.log(`✅ Backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ Failed to create backup:', error.message);
      throw error;
    }
  }

  /**
   * Load current wine data
   */
  loadWineData() {
    try {
      const rawData = fs.readFileSync(this.wineDataFile, 'utf8');
      this.wineData = JSON.parse(rawData);
      console.log(`📖 Loaded wine data with ${this.wineData.metadata.totalWines} wines`);
    } catch (error) {
      console.error('❌ Failed to load wine data:', error.message);
      throw error;
    }
  }

  /**
   * Update prices from CSV file
   * CSV format: wine_id,new_price_twd,new_price_usd,discount_percent,updated_date
   */
  async updatePricesFromCSV(csvFile) {
    if (!fs.existsSync(csvFile)) {
      throw new Error(`Price file not found: ${csvFile}`);
    }

    console.log(`📊 Reading price updates from: ${csvFile}`);

    const priceUpdates = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFile)
        .pipe(csv())
        .on('data', (row) => {
          priceUpdates.push({
            id: row.wine_id?.trim(),
            priceTwd: parseFloat(row.new_price_twd),
            priceUsd: parseFloat(row.new_price_usd),
            discount: parseFloat(row.discount_percent) || 0,
            updatedDate: row.updated_date || new Date().toISOString()
          });
        })
        .on('end', () => {
          console.log(`📋 Found ${priceUpdates.length} price updates`);
          this.applyPriceUpdates(priceUpdates);
          resolve();
        })
        .on('error', reject);
    });
  }

  /**
   * Apply price updates to wine data
   */
  applyPriceUpdates(priceUpdates) {
    const updateTime = new Date().toISOString();

    priceUpdates.forEach(update => {
      if (!update.id || isNaN(update.priceTwd)) {
        this.errors.push(`Invalid update data for wine ID: ${update.id}`);
        return;
      }

      const wine = this.findWineById(update.id);
      if (!wine) {
        this.errors.push(`Wine not found: ${update.id}`);
        return;
      }

      // Store original price as originalPrice if not already set
      if (!wine.price.originalPrice) {
        wine.price.originalPrice = wine.price.twd;
      }

      // Update prices
      wine.price.twd = update.priceTwd;
      if (update.priceUsd && !isNaN(update.priceUsd)) {
        wine.price.usd = update.priceUsd;
      }

      // Update discount
      if (update.discount > 0) {
        wine.price.discount = update.discount;
        // Calculate original price if discount is provided
        if (!wine.price.originalPrice || wine.price.originalPrice === wine.price.twd) {
          wine.price.originalPrice = Math.round(wine.price.twd / (1 - update.discount / 100));
        }
      }

      // Update timestamp
      wine.lastPriceUpdate = update.updatedDate || updateTime;

      this.updatedWines++;
      console.log(`✅ Updated ${wine.nameCh} (${wine.id}): NT$${wine.price.twd.toLocaleString()}`);
    });

    // Update metadata
    this.wineData.metadata.lastUpdated = updateTime;
    this.wineData.metadata.priceUpdateFrequency = "As updated";
  }

  /**
   * Find wine by ID across all countries and regions
   */
  findWineById(wineId) {
    for (const country of Object.values(this.wineData.countries)) {
      for (const region of Object.values(country.regions)) {
        const wine = region.wines.find(w => w.id === wineId);
        if (wine) return wine;
      }
    }
    return null;
  }

  /**
   * Save updated wine data
   */
  saveWineData() {
    try {
      const jsonData = JSON.stringify(this.wineData, null, 2);
      fs.writeFileSync(this.wineDataFile, jsonData);
      console.log(`💾 Saved updated wine data to ${this.wineDataFile}`);
    } catch (error) {
      console.error('❌ Failed to save wine data:', error.message);
      throw error;
    }
  }

  /**
   * Generate price update report
   */
  generateReport() {
    console.log('\n📊 PRICE UPDATE REPORT');
    console.log('=' .repeat(50));
    console.log(`🍷 Wines updated: ${this.updatedWines}`);
    console.log(`❌ Errors: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\nErrors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log(`\n⏰ Update completed at: ${new Date().toLocaleString('zh-TW')}`);
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm run build:wine');
    console.log('2. Review generated HTML files');
    console.log('3. Deploy updated catalog');
  }

  /**
   * Create sample CSV file for price updates
   */
  createSampleCSV() {
    const sampleData = `wine_id,new_price_twd,new_price_usd,discount_percent,updated_date
FR-BDX-001,29800,932,5,2024-12-20T10:00:00Z
FR-BDX-002,36900,1154,3,2024-12-20T10:00:00Z
AU-BAR-001,23500,735,7,2024-12-20T10:00:00Z
CL-MAI-001,8900,278,4,2024-12-20T10:00:00Z`;

    const sampleFile = './sample-price-update.csv';
    fs.writeFileSync(sampleFile, sampleData);
    console.log(`📋 Created sample CSV file: ${sampleFile}`);
    console.log('Edit this file with your price updates and run:');
    console.log(`node update-wine-prices.js ${sampleFile}`);
  }

  /**
   * Main update process
   */
  async updatePrices(csvFile) {
    console.log('🍷 Starting Seven Pyramid Wine Price Update...\n');

    try {
      // Create backup before making changes
      this.createBackup();

      // Load current data
      this.loadWineData();

      // Update prices from CSV
      await this.updatePricesFromCSV(csvFile);

      // Save updated data
      this.saveWineData();

      // Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Price update failed:', error.message);
      console.error('\n🔄 Restore from backup if needed:');
      console.error(`cp ${this.backupDir}/wines-data-backup-*.json ${this.wineDataFile}`);
      process.exit(1);
    }
  }
}

// Command line interface
if (require.main === module) {
  const updater = new WinePriceUpdater();
  const csvFile = process.argv[2];

  if (!csvFile) {
    console.log('🍷 Seven Pyramid Wine Price Updater\n');
    console.log('Usage:');
    console.log('  node update-wine-prices.js <price-file.csv>');
    console.log('  node update-wine-prices.js --sample    # Create sample CSV');
    console.log('\nCSV Format:');
    console.log('  wine_id,new_price_twd,new_price_usd,discount_percent,updated_date');
    console.log('\nExample:');
    console.log('  FR-BDX-001,29800,932,5,2024-12-20T10:00:00Z');

    if (process.argv[2] === '--sample') {
      updater.createSampleCSV();
    }
  } else {
    updater.updatePrices(csvFile);
  }
}

module.exports = WinePriceUpdater;