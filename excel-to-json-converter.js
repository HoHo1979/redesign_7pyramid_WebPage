#!/usr/bin/env node

/**
 * Seven Pyramid Wine Excel to JSON Converter
 * Converts info/sevenStock.xlsx into wines-data-template.json format
 *
 * Usage: node excel-to-json-converter.js
 *
 * Supports:
 * - Bilingual wine names (Chinese + English)
 * - Automatic wine ID generation (e.g., FR-BDX-001)
 * - SEO-friendly slug generation
 * - Intelligent field mapping and default values
 * - Data validation and error reporting
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

class ExcelToJsonConverter {
  constructor() {
    this.excelPath = './info/sevenStock.xlsx';
    this.outputPath = './wines-data-template.json';
    this.backupPath = './wines-data-template.backup.json';

    // Country code mappings
    this.countryCodes = {
      '法國': 'FR', 'france': 'FR', 'french': 'FR',
      '澳洲': 'AU', 'australia': 'AU', 'australian': 'AU',
      '智利': 'CL', 'chile': 'CL', 'chilean': 'CL',
      '美國': 'US', 'usa': 'US', 'american': 'US', 'california': 'US',
      '阿根廷': 'AR', 'argentina': 'AR', 'argentinian': 'AR',
      '西班牙': 'ES', 'spain': 'ES', 'spanish': 'ES'
    };

    // Region code mappings
    this.regionCodes = {
      // France
      '波爾多': 'BDX', 'bordeaux': 'BDX',
      '勃艮第': 'BUR', 'burgundy': 'BUR',
      '香檳': 'CHA', 'champagne': 'CHA',
      // Australia
      '巴羅莎': 'BAR', 'barossa': 'BAR',
      '獵人谷': 'HUN', 'hunter': 'HUN',
      // Chile
      '邁坡': 'MAI', 'maipo': 'MAI',
      '卡薩布蘭卡': 'CAS', 'casablanca': 'CAS',
      // USA
      '納帕': 'NAP', 'napa': 'NAP',
      '索諾瑪': 'SON', 'sonoma': 'SON',
      // Argentina
      '門多薩': 'MEN', 'mendoza': 'MEN',
      // Spain
      '里奧哈': 'RIO', 'rioja': 'RIO'
    };

    this.stats = {
      totalWines: 0,
      countries: {},
      regions: {},
      validationErrors: [],
      validationWarnings: [],
      idCounters: {}
    };
  }

  /**
   * Main execution method
   */
  async run() {
    console.log('🍷 Seven Pyramid Wine Excel to JSON Converter\n');

    try {
      // Step 1: Check if Excel file exists
      if (!fs.existsSync(this.excelPath)) {
        console.error(`❌ Excel file not found: ${this.excelPath}`);
        process.exit(1);
      }
      console.log(`✅ Found Excel file: ${this.excelPath}`);

      // Step 2: Read Excel file using exceljs
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(this.excelPath);
      const worksheet = workbook.getWorksheet(1);

      // Convert worksheet rows to JSON-like format
      const jsonData = [];
      worksheet.eachRow((row, rowNumber) => {
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          const colKey = colNumber === 1 ? '1141212' : `__EMPTY${colNumber > 2 ? '_' + (colNumber - 2) : ''}`;
          rowData[colKey] = cell.value;
        });
        jsonData.push(rowData);
      });

      console.log(`✅ Read ${jsonData.length} rows from Excel\n`);

      // Step 3: Create backup of existing JSON
      if (fs.existsSync(this.outputPath)) {
        fs.copyFileSync(this.outputPath, this.backupPath);
        console.log(`✅ Created backup: ${this.backupPath}`);
      }

      // Step 4: Extract headers and process wine data
      const wineTemplate = this.createEmptyTemplate();

      // First row is headers, skip it
      const rows = jsonData.slice(1).filter(row => {
        // Filter out empty rows
        return Object.values(row).some(v => v && v !== '');
      });

      console.log(`✅ Processing ${rows.length} wine records\n`);

      for (const row of rows) {
        try {
          this.processWineRow(row, wineTemplate);
        } catch (error) {
          this.stats.validationErrors.push(`Row error: ${error.message}`);
        }
      }

      // Step 5: Write output JSON
      fs.writeFileSync(
        this.outputPath,
        JSON.stringify(wineTemplate, null, 2),
        'utf8'
      );
      console.log(`\n✅ Generated: ${this.outputPath}`);

      // Step 6: Print statistics
      this.printStatistics();

      // Step 7: Print validation results
      this.printValidationResults();

      console.log('\n✅ Conversion completed successfully!\n');
      return true;

    } catch (error) {
      console.error(`\n❌ Conversion failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Create empty template structure
   */
  createEmptyTemplate() {
    return {
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
        totalWines: 0,
        currencies: ['TWD', 'USD'],
        priceUpdateFrequency: 'weekly',
        dataSource: 'Seven Pyramid Wine Management System',
        contact: {
          phone: '+886-2-2791-2147',
          email: 'info@7pyramid.com',
          website: 'https://wine.7pyramid.com'
        }
      },
      countries: {}
    };
  }

  /**
   * Process a single wine row from Excel
   */
  processWineRow(row, template) {
    // Map Excel column names (using actual column headers from sevenStock.xlsx)
    // Row 0: ProductCode, EnglishName, ChineseName, Score, Stock, WholesalePrice, Bundle, SuggestedPrice, UnitPrice, DirectPrice

    // Check for nulls in specific columns as requested (C4 or C6 equivalent)
    // In our mapping: Col 4 is __EMPTY_2, Col 6 is __EMPTY_4
    const col4Value = row['__EMPTY_2'];
    const col6Value = row['__EMPTY_4'];

    if (!col4Value || col4Value === '' || !col6Value || col6Value === '') {
      // Skip this row as it's likely a header, spacer, or incomplete record
      return;
    }

    // Extract and validate core fields
    const nameEn = this.getField(row, ['__EMPTY', 'English Name', 'Product Name', '產品名稱']);
    const nameCh = this.getField(row, ['__EMPTY_1', 'Chinese Name', 'Name', '中文名稱']);
    const priceStr = this.getField(row, ['__EMPTY_8', '__EMPTY_9', '__EMPTY_7', 'Price', '每瓶單價', '直銷價/瓶']);
    const stockStr = this.getField(row, ['__EMPTY_3', 'Stock', '七銘庫存/瓶']);

    // Try to extract country/region from wine name (heuristic approach)
    const fullName = (nameEn || nameCh || '').toLowerCase();
    const countryField = this.inferCountry(fullName);
    const regionField = this.inferRegion(fullName);

    // For vintage, try to extract from name or use default
    let vintage = this.extractVintageFromName(nameEn || nameCh);
    if (!vintage) vintage = new Date().getFullYear().toString();

    // Validate required fields
    if (!nameCh && !nameEn) {
      throw new Error('Missing wine name (both Chinese and English)');
    }

    // Country and region should always be set by inference
    if (!countryField || !regionField) {
      throw new Error(`Missing country/region inference: country=${countryField}, region=${regionField}`);
    }

    if (!priceStr) {
      this.stats.validationWarnings.push(`Wine "${nameCh || nameEn}" missing price`);
    }

    // Parse country and region codes - these should always succeed with inference
    const countryCode = this.getCountryCode(countryField);
    const regionCode = this.getRegionCode(regionField);

    const countryKey = countryField.toLowerCase().includes('france') ? 'france' :
                       countryField.toLowerCase().includes('australia') ? 'australia' :
                       countryField.toLowerCase().includes('chile') ? 'chile' :
                       countryField.toLowerCase().includes('america') || countryField.includes('美') ? 'usa' :
                       countryField.toLowerCase().includes('argentina') ? 'argentina' :
                       countryField.toLowerCase().includes('spain') ? 'spain' : 'other';

    // Initialize country if needed
    if (!template.countries[countryKey]) {
      template.countries[countryKey] = {
        name: this.getCountryChineseName(countryKey),
        nameEn: countryField,
        emoji: this.getCountryEmoji(countryKey),
        description: '',
        seoTitle: '',
        seoDescription: '',
        regions: {}
      };
    }

    // Initialize region if needed
    const regionKey = regionField.toLowerCase().replace(/\s+/g, '');
    if (!template.countries[countryKey].regions[regionKey]) {
      template.countries[countryKey].regions[regionKey] = {
        name: regionField,
        nameEn: regionField,
        description: '',
        mapImage: '',
        wines: []
      };
      this.stats.regions[`${countryKey}-${regionKey}`] = 0;
    }

    // Initialize ID counter
    const counterKey = `${countryCode}-${regionCode || 'GEN'}`;
    if (!this.stats.idCounters[counterKey]) {
      this.stats.idCounters[counterKey] = 0;
    }
    this.stats.idCounters[counterKey]++;

    // Generate unique wine ID
    const wineId = `${countryCode}-${regionCode || 'GEN'}-${String(this.stats.idCounters[counterKey]).padStart(3, '0')}`;

    // Create slug
    const slug = this.createSlug(nameEn || nameCh);

    // Parse price
    const price = this.parsePrice(priceStr);

    // Parse stock info
    const stockLevel = this.parseInteger(stockStr, 0);
    const inStock = stockLevel > 0; // In stock if stock level > 0

    // Create wine object
    const wineObject = {
      id: wineId,
      name: nameEn || nameCh,
      nameCh: nameCh || nameEn,
      vintage: vintage || new Date().getFullYear().toString(),
      region: regionField,
      subRegion: '',
      appellation: '',
      classification: '',
      price: {
        twd: price,
        usd: Math.round(price / 30), // Rough conversion
        originalPrice: price,
        discount: 0
      },
      inStock: inStock,
      stockLevel: stockLevel,
      category: this.getCategory(row),
      wineType: this.getWineType(row),
      grapes: this.getGrapes(row),
      alcohol: this.parseFloat(this.getField(row, ['酒精度', 'Alcohol', 'ABV']), 13.5),
      servingTemp: '16-18°C',
      agingPotential: this.getAgingPotential(vintage),
      bottleSize: '750ml',
      closure: 'Cork',
      producer: nameEn || nameCh,
      importer: 'Seven Pyramid 七銘企業',
      description: this.getField(row, ['描述', 'Description', 'Notes']) || '',
      tastingNotes: {
        appearance: this.getField(row, ['外觀', 'Appearance']) || '',
        aroma: this.getField(row, ['香氣', 'Aroma', 'Nose']) || '',
        palate: this.getField(row, ['口感', 'Palate', 'Taste']) || '',
        finish: this.getField(row, ['餘韻', 'Finish']) || ''
      },
      foodPairing: this.getFoodPairing(row),
      awards: [],
      seoKeywords: [nameCh || nameEn, regionField, countryField],
      lastPriceUpdate: new Date().toISOString(),
      imageUrl: `img/wines/${slug}.jpg`,
      available: {
        taipei: true,
        hsinchu: Math.random() > 0.3 // 70% of wines available
      },
      tags: this.generateTags(price, inStock)
    };

    // Add to template
    template.countries[countryKey].regions[regionKey].wines.push(wineObject);

    // Update statistics
    this.stats.totalWines++;
    if (!this.stats.countries[countryKey]) {
      this.stats.countries[countryKey] = 0;
    }
    this.stats.countries[countryKey]++;
    this.stats.regions[`${countryKey}-${regionKey}`]++;

    // Update template metadata
    template.metadata.totalWines = this.stats.totalWines;
  }

  /**
   * Helper: Infer country from wine name
   */
  inferCountry(name) {
    if (name.includes('france') || name.includes('法') || name.includes('bordeaux') || name.includes('champagne') || name.includes('burgundy')) return 'France';
    if (name.includes('australia') || name.includes('澳') || name.includes('barossa')) return 'Australia';
    if (name.includes('chile') || name.includes('智')) return 'Chile';
    if (name.includes('america') || name.includes('usa') || name.includes('california') || name.includes('napa')) return 'USA';
    if (name.includes('argentina') || name.includes('阿根廷') || name.includes('mendoza')) return 'Argentina';
    if (name.includes('spain') || name.includes('西班牙') || name.includes('rioja')) return 'Spain';
    return 'France'; // Default
  }

  /**
   * Helper: Infer region from wine name
   */
  inferRegion(name) {
    if (name.includes('bordeaux')) return 'Bordeaux';
    if (name.includes('burgundy') || name.includes('bourgogne')) return 'Burgundy';
    if (name.includes('champagne')) return 'Champagne';
    if (name.includes('barossa')) return 'Barossa';
    if (name.includes('hunter')) return 'Hunter Valley';
    if (name.includes('maipo')) return 'Maipo';
    if (name.includes('casablanca')) return 'Casablanca';
    if (name.includes('napa')) return 'Napa';
    if (name.includes('sonoma')) return 'Sonoma';
    if (name.includes('mendoza')) return 'Mendoza';
    if (name.includes('rioja')) return 'Rioja';
    return 'Central'; // Default
  }

  /**
   * Helper: Extract vintage year from wine name
   */
  extractVintageFromName(name) {
    if (!name) return null;
    const match = String(name).match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
  }

  /**
   * Helper: Get field value from row (supports multiple column names)
   */
  getField(row, fieldNames) {
    for (const fieldName of fieldNames) {
      if (row[fieldName] && row[fieldName] !== '') {
        return String(row[fieldName]).trim();
      }
    }
    return null;
  }

  /**
   * Helper: Convert country name to code
   */
  getCountryCode(countryName) {
    const normalized = countryName.toLowerCase();
    return this.countryCodes[normalized] || this.countryCodes[countryName] || null;
  }

  /**
   * Helper: Convert region name to code
   */
  getRegionCode(regionName) {
    const normalized = regionName.toLowerCase();
    return this.regionCodes[normalized] || this.regionCodes[regionName] || null;
  }

  /**
   * Helper: Get Chinese country name
   */
  getCountryChineseName(countryKey) {
    const names = {
      'france': '法國葡萄酒',
      'australia': '澳洲葡萄酒',
      'chile': '智利葡萄酒',
      'usa': '美國葡萄酒',
      'argentina': '阿根廷葡萄酒',
      'spain': '西班牙葡萄酒'
    };
    return names[countryKey] || '葡萄酒';
  }

  /**
   * Helper: Get country emoji
   */
  getCountryEmoji(countryKey) {
    const emojis = {
      'france': '🇫🇷',
      'australia': '🇦🇺',
      'chile': '🇨🇱',
      'usa': '🇺🇸',
      'argentina': '🇦🇷',
      'spain': '🇪🇸'
    };
    return emojis[countryKey] || '🍷';
  }

  /**
   * Helper: Create SEO-friendly slug
   */
  createSlug(text) {
    if (!text) return 'wine';

    return text
      .toLowerCase()
      // Remove Chinese characters (simple approach - keep as is or romanize)
      .replace(/[\u4e00-\u9fff]/g, '')
      // Convert accented characters
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      // Remove special characters, keep only alphanumeric and hyphens
      .replace(/[^\w\s-]/g, '')
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length
      .substring(0, 60);
  }

  /**
   * Helper: Parse price from string
   */
  parsePrice(priceStr) {
    if (!priceStr) return 5000;
    const match = String(priceStr).match(/\d+/);
    return match ? parseInt(match[0]) : 5000;
  }

  /**
   * Helper: Parse in-stock status
   */
  parseInStock(statusStr) {
    if (!statusStr) return true;
    const status = String(statusStr).toLowerCase();
    return !status.includes('out') && !status.includes('no') && status !== '缺貨';
  }

  /**
   * Helper: Parse integer
   */
  parseInteger(str, defaultValue = 0) {
    if (!str) return defaultValue;
    const num = parseInt(str);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Helper: Parse float
   */
  parseFloat(str, defaultValue = 13.5) {
    if (!str) return defaultValue;
    const num = parseFloat(str);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * Helper: Get wine category
   */
  getCategory(row) {
    const category = this.getField(row, ['類型', 'Category', 'Type']);
    if (!category) return 'Red Wine';

    const lower = category.toLowerCase();
    if (lower.includes('red')) return 'Red Wine';
    if (lower.includes('white')) return 'White Wine';
    if (lower.includes('spark') || lower.includes('champagne')) return 'Sparkling Wine';
    if (lower.includes('rose') || lower.includes('rosé')) return 'Rosé Wine';
    if (lower.includes('desert') || lower.includes('dessert')) return 'Dessert Wine';
    return 'Red Wine';
  }

  /**
   * Helper: Get wine type
   */
  getWineType(row) {
    const type = this.getField(row, ['酒類', 'Wine Type', 'Style']);
    return type || 'Dry Red';
  }

  /**
   * Helper: Get grape varieties
   */
  getGrapes(row) {
    const grapes = this.getField(row, ['葡萄', 'Grapes', 'Varieties']);
    if (!grapes) return [];

    return grapes.split(/[,;、]/).map(g => g.trim()).filter(g => g);
  }

  /**
   * Helper: Get aging potential
   */
  getAgingPotential(vintage) {
    if (!vintage) return `${new Date().getFullYear()}-${new Date().getFullYear() + 20}`;

    const year = parseInt(vintage);
    if (isNaN(year)) return `${new Date().getFullYear()}-${new Date().getFullYear() + 20}`;

    return `${year + 3}-${year + 25}`;
  }

  /**
   * Helper: Get food pairings
   */
  getFoodPairing(row) {
    const pairings = this.getField(row, ['配餐', 'Food Pairing', 'Pairing']);
    if (!pairings) return ['肉類', '起司'];

    return pairings.split(/[,;、]/).map(p => p.trim()).filter(p => p);
  }

  /**
   * Helper: Generate tags
   */
  generateTags(price, inStock) {
    const tags = [];

    if (price > 20000) tags.push('Luxury');
    if (price > 10000) tags.push('Premium');
    if (price < 3000) tags.push('Everyday');

    if (inStock) tags.push('Available');

    return tags.length > 0 ? tags : ['Standard'];
  }

  /**
   * Print statistics
   */
  printStatistics() {
    console.log('📊 Conversion Statistics:');
    console.log(`   Total Wines: ${this.stats.totalWines}`);
    console.log(`   Countries: ${Object.keys(this.stats.countries).length}`);

    console.log('\n   Wines by Country:');
    for (const [country, count] of Object.entries(this.stats.countries)) {
      console.log(`     - ${country}: ${count} wines`);
    }

    console.log('\n   Wines by Region:');
    for (const [region, count] of Object.entries(this.stats.regions)) {
      console.log(`     - ${region}: ${count} wines`);
    }
  }

  /**
   * Print validation results
   */
  printValidationResults() {
    if (this.stats.validationWarnings.length > 0) {
      console.log('\n⚠️  Validation Warnings:');
      this.stats.validationWarnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
    }

    if (this.stats.validationErrors.length > 0) {
      console.log('\n❌ Validation Errors:');
      this.stats.validationErrors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }

    if (this.stats.validationWarnings.length === 0 && this.stats.validationErrors.length === 0) {
      console.log('\n✅ No validation issues found!');
    }
  }
}

// Run converter
(async () => {
  const converter = new ExcelToJsonConverter();
  try {
    await converter.run();
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
