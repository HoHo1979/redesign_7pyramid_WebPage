#!/usr/bin/env node

/**
 * Seven Pyramid Wine Data Validator
 * Validates wine data structure, checks for errors, and provides analytics
 * Usage: node validate-wine-data.js
 */

const fs = require('fs');
const path = require('path');

class WineDataValidator {
  constructor() {
    this.dataFile = './wines-data-template.json';
    this.wineData = null;
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalWines: 0,
      countries: 0,
      regions: 0,
      inStock: 0,
      outOfStock: 0,
      priceRanges: {
        budget: 0,      // < 3000
        mid: 0,         // 3000-10000
        premium: 0,     // 10000-30000
        luxury: 0       // > 30000
      },
      categories: {},
      vintages: {},
      missingImages: 0,
      duplicateIds: [],
      priceInconsistencies: []
    };
  }

  /**
   * Load and parse wine data
   */
  loadWineData() {
    try {
      if (!fs.existsSync(this.dataFile)) {
        throw new Error(`Data file not found: ${this.dataFile}`);
      }

      const rawData = fs.readFileSync(this.dataFile, 'utf8');
      this.wineData = JSON.parse(rawData);
      console.log('✅ Wine data loaded successfully');
    } catch (error) {
      this.errors.push(`Failed to load wine data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate metadata structure
   */
  validateMetadata() {
    const required = ['lastUpdated', 'totalWines', 'currencies'];
    const metadata = this.wineData.metadata;

    if (!metadata) {
      this.errors.push('Missing metadata section');
      return;
    }

    required.forEach(field => {
      if (!metadata[field]) {
        this.errors.push(`Missing required metadata field: ${field}`);
      }
    });

    // Validate date format
    if (metadata.lastUpdated) {
      const date = new Date(metadata.lastUpdated);
      if (isNaN(date.getTime())) {
        this.errors.push('Invalid lastUpdated date format');
      }
    }

    // Validate currencies
    if (metadata.currencies && !Array.isArray(metadata.currencies)) {
      this.errors.push('Currencies should be an array');
    }
  }

  /**
   * Validate country and region structure
   */
  validateStructure() {
    if (!this.wineData.countries || typeof this.wineData.countries !== 'object') {
      this.errors.push('Missing or invalid countries section');
      return;
    }

    this.stats.countries = Object.keys(this.wineData.countries).length;

    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      this.validateCountry(countryCode, country);
    });
  }

  /**
   * Validate individual country data
   */
  validateCountry(countryCode, country) {
    const requiredFields = ['name', 'nameEn', 'emoji', 'regions'];

    requiredFields.forEach(field => {
      if (!country[field]) {
        this.errors.push(`Country ${countryCode} missing field: ${field}`);
      }
    });

    if (!country.regions || typeof country.regions !== 'object') {
      this.errors.push(`Country ${countryCode} has invalid regions structure`);
      return;
    }

    Object.entries(country.regions).forEach(([regionCode, region]) => {
      this.validateRegion(countryCode, regionCode, region);
    });
  }

  /**
   * Validate individual region data
   */
  validateRegion(countryCode, regionCode, region) {
    this.stats.regions++;

    const requiredFields = ['name', 'nameEn', 'wines'];
    requiredFields.forEach(field => {
      if (!region[field]) {
        this.errors.push(`Region ${countryCode}-${regionCode} missing field: ${field}`);
      }
    });

    if (!Array.isArray(region.wines)) {
      this.errors.push(`Region ${countryCode}-${regionCode} wines should be an array`);
      return;
    }

    region.wines.forEach(wine => {
      this.validateWine(countryCode, regionCode, wine);
    });
  }

  /**
   * Validate individual wine data
   */
  validateWine(countryCode, regionCode, wine) {
    this.stats.totalWines++;

    const requiredFields = [
      'id', 'name', 'nameCh', 'vintage', 'region', 'price',
      'category', 'grapes', 'alcohol', 'producer', 'description'
    ];

    requiredFields.forEach(field => {
      if (!wine[field]) {
        this.errors.push(`Wine ${wine.id || 'Unknown'} missing field: ${field}`);
      }
    });

    // Validate wine ID format
    if (wine.id) {
      const idPattern = /^[A-Z]{2}-[A-Z]{3}-\d{3}$/;
      if (!idPattern.test(wine.id)) {
        this.warnings.push(`Wine ${wine.id} has non-standard ID format`);
      }

      // Check for duplicate IDs
      if (this.getAllWineIds().filter(id => id === wine.id).length > 1) {
        this.stats.duplicateIds.push(wine.id);
      }
    }

    // Validate price structure
    if (wine.price) {
      this.validatePrice(wine);
    }

    // Validate vintage
    if (wine.vintage) {
      const currentYear = new Date().getFullYear();
      const vintage = parseInt(wine.vintage);

      if (wine.vintage !== 'NV' && (isNaN(vintage) || vintage < 1900 || vintage > currentYear + 2)) {
        this.warnings.push(`Wine ${wine.id} has questionable vintage: ${wine.vintage}`);
      }

      // Track vintage statistics
      this.stats.vintages[wine.vintage] = (this.stats.vintages[wine.vintage] || 0) + 1;
    }

    // Validate alcohol content
    if (wine.alcohol) {
      const alcohol = parseFloat(wine.alcohol);
      if (isNaN(alcohol) || alcohol < 0 || alcohol > 20) {
        this.warnings.push(`Wine ${wine.id} has unusual alcohol content: ${wine.alcohol}%`);
      }
    }

    // Validate grapes array
    if (wine.grapes && !Array.isArray(wine.grapes)) {
      this.errors.push(`Wine ${wine.id} grapes should be an array`);
    }

    // Check stock status
    if (wine.inStock === true) {
      this.stats.inStock++;
    } else {
      this.stats.outOfStock++;
    }

    // Track categories
    if (wine.category) {
      this.stats.categories[wine.category] = (this.stats.categories[wine.category] || 0) + 1;
    }

    // Check for image
    if (!wine.imageUrl || wine.imageUrl === 'img/wine-placeholder.jpg') {
      this.stats.missingImages++;
    }

    // Categorize by price
    if (wine.price && wine.price.twd) {
      const price = wine.price.twd;
      if (price < 3000) this.stats.priceRanges.budget++;
      else if (price < 10000) this.stats.priceRanges.mid++;
      else if (price < 30000) this.stats.priceRanges.premium++;
      else this.stats.priceRanges.luxury++;
    }
  }

  /**
   * Validate price structure and consistency
   */
  validatePrice(wine) {
    const price = wine.price;

    if (typeof price !== 'object') {
      this.errors.push(`Wine ${wine.id} price should be an object`);
      return;
    }

    // Check required price fields
    if (!price.twd || isNaN(price.twd)) {
      this.errors.push(`Wine ${wine.id} missing or invalid TWD price`);
    }

    // Validate discount logic
    if (price.discount && price.originalPrice) {
      const expectedPrice = price.originalPrice * (1 - price.discount / 100);
      const actualPrice = price.twd;
      const difference = Math.abs(expectedPrice - actualPrice);

      if (difference > 100) {  // Allow 100 TWD tolerance
        this.stats.priceInconsistencies.push({
          wineId: wine.id,
          expected: Math.round(expectedPrice),
          actual: actualPrice,
          difference: Math.round(difference)
        });
      }
    }

    // Validate USD conversion if present
    if (price.usd && price.twd) {
      const exchangeRate = price.twd / price.usd;
      if (exchangeRate < 25 || exchangeRate > 35) {  // Reasonable TWD/USD range
        this.warnings.push(`Wine ${wine.id} has unusual TWD/USD exchange rate: ${exchangeRate.toFixed(2)}`);
      }
    }
  }

  /**
   * Get all wine IDs for duplicate checking
   */
  getAllWineIds() {
    const ids = [];
    Object.values(this.wineData.countries).forEach(country => {
      Object.values(country.regions).forEach(region => {
        region.wines.forEach(wine => {
          if (wine.id) ids.push(wine.id);
        });
      });
    });
    return ids;
  }

  /**
   * Check metadata consistency
   */
  validateMetadataConsistency() {
    const declaredTotal = this.wineData.metadata.totalWines;
    const actualTotal = this.stats.totalWines;

    if (declaredTotal !== actualTotal) {
      this.warnings.push(`Metadata totalWines (${declaredTotal}) doesn't match actual count (${actualTotal})`);
    }
  }

  /**
   * Validate SEO elements
   */
  validateSEO() {
    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      if (!country.seoTitle) {
        this.warnings.push(`Country ${countryCode} missing SEO title`);
      }
      if (!country.seoDescription) {
        this.warnings.push(`Country ${countryCode} missing SEO description`);
      }

      Object.entries(country.regions).forEach(([regionCode, region]) => {
        region.wines.forEach(wine => {
          if (!wine.seoKeywords || !Array.isArray(wine.seoKeywords)) {
            this.warnings.push(`Wine ${wine.id} missing or invalid SEO keywords`);
          }
          if (!wine.description || wine.description.length < 50) {
            this.warnings.push(`Wine ${wine.id} description too short for SEO`);
          }
        });
      });
    });
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log('\n🍷 SEVEN PYRAMID WINE DATA VALIDATION REPORT');
    console.log('=' .repeat(60));

    // Summary
    console.log('\n📊 DATA SUMMARY');
    console.log(`Total Wines: ${this.stats.totalWines}`);
    console.log(`Countries: ${this.stats.countries}`);
    console.log(`Regions: ${this.stats.regions}`);
    console.log(`In Stock: ${this.stats.inStock}`);
    console.log(`Out of Stock: ${this.stats.outOfStock}`);
    console.log(`Missing Images: ${this.stats.missingImages}`);

    // Price ranges
    console.log('\n💰 PRICE DISTRIBUTION');
    console.log(`Budget (< NT$3,000): ${this.stats.priceRanges.budget}`);
    console.log(`Mid-range (NT$3,000-10,000): ${this.stats.priceRanges.mid}`);
    console.log(`Premium (NT$10,000-30,000): ${this.stats.priceRanges.premium}`);
    console.log(`Luxury (> NT$30,000): ${this.stats.priceRanges.luxury}`);

    // Categories
    console.log('\n🍷 WINE CATEGORIES');
    Object.entries(this.stats.categories).forEach(([category, count]) => {
      console.log(`${category}: ${count}`);
    });

    // Top vintages
    console.log('\n📅 TOP VINTAGES');
    const sortedVintages = Object.entries(this.stats.vintages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    sortedVintages.forEach(([vintage, count]) => {
      console.log(`${vintage}: ${count} wines`);
    });

    // Errors
    if (this.errors.length > 0) {
      console.log(`\n❌ ERRORS (${this.errors.length})`);
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length})`);
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    // Duplicate IDs
    if (this.stats.duplicateIds.length > 0) {
      console.log(`\n🔄 DUPLICATE IDs (${this.stats.duplicateIds.length})`);
      this.stats.duplicateIds.forEach(id => console.log(`  - ${id}`));
    }

    // Price inconsistencies
    if (this.stats.priceInconsistencies.length > 0) {
      console.log(`\n💸 PRICE INCONSISTENCIES (${this.stats.priceInconsistencies.length})`);
      this.stats.priceInconsistencies.forEach(inconsistency => {
        console.log(`  - ${inconsistency.wineId}: Expected NT$${inconsistency.expected}, Got NT$${inconsistency.actual} (diff: ${inconsistency.difference})`);
      });
    }

    // Overall status
    console.log('\n🎯 VALIDATION STATUS');
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All validations passed! Data is ready for production.');
    } else if (this.errors.length === 0) {
      console.log('⚠️  Data is valid but has some warnings to review.');
    } else {
      console.log('❌ Data has errors that must be fixed before production.');
    }

    console.log(`\n⏰ Validation completed at: ${new Date().toLocaleString('zh-TW')}`);
  }

  /**
   * Run complete validation
   */
  validate() {
    console.log('🍷 Starting Seven Pyramid Wine Data Validation...\n');

    try {
      this.loadWineData();
      this.validateMetadata();
      this.validateStructure();
      this.validateMetadataConsistency();
      this.validateSEO();
      this.generateReport();

      return this.errors.length === 0;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      return false;
    }
  }
}

// Export validation stats for other scripts
class WineStatsGenerator extends WineDataValidator {
  generateDetailedStats() {
    this.loadWineData();
    this.validateStructure(); // This populates stats

    const detailedStats = {
      ...this.stats,
      validation: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        isValid: this.errors.length === 0
      },
      countries: {},
      regions: {}
    };

    // Country-specific stats
    Object.entries(this.wineData.countries).forEach(([countryCode, country]) => {
      const countryWines = [];
      Object.values(country.regions).forEach(region => {
        countryWines.push(...region.wines);
      });

      detailedStats.countries[countryCode] = {
        name: country.name,
        totalWines: countryWines.length,
        averagePrice: countryWines.reduce((sum, wine) => sum + (wine.price?.twd || 0), 0) / countryWines.length,
        inStock: countryWines.filter(w => w.inStock).length
      };

      // Region-specific stats
      Object.entries(country.regions).forEach(([regionCode, region]) => {
        detailedStats.regions[`${countryCode}-${regionCode}`] = {
          name: region.name,
          country: country.name,
          totalWines: region.wines.length,
          averagePrice: region.wines.reduce((sum, wine) => sum + (wine.price?.twd || 0), 0) / region.wines.length
        };
      });
    });

    return detailedStats;
  }
}

// Command line interface
if (require.main === module) {
  const validator = new WineDataValidator();
  const success = validator.validate();
  process.exit(success ? 0 : 1);
}

module.exports = { WineDataValidator, WineStatsGenerator };