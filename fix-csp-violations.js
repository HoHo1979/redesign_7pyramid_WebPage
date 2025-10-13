#!/usr/bin/env node

/**
 * Seven Pyramid CSP Violations Fixer
 * Automatically removes inline event handlers and adds appropriate CSS classes
 * Usage: node fix-csp-violations.js
 */

const fs = require('fs');
const path = require('path');

class CSPFixer {
  constructor() {
    this.htmlFiles = [];
    this.fixedCount = 0;
    this.backupDir = './backups-csp';
  }

  /**
   * Find all HTML files in the project
   */
  findHtmlFiles() {
    const files = fs.readdirSync('.')
      .filter(file => file.endsWith('.html'))
      .filter(file => !file.includes('backup'))
      .filter(file => !file.includes('generated'));

    this.htmlFiles = files;
    console.log(`📄 Found ${files.length} HTML files to process:`);
    files.forEach(file => console.log(`  - ${file}`));
  }

  /**
   * Create backup directory and backup files
   */
  createBackups() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

    this.htmlFiles.forEach(file => {
      const backupFile = path.join(this.backupDir, `${file}-${timestamp}.backup`);
      fs.copyFileSync(file, backupFile);
    });

    console.log(`💾 Created backups in ${this.backupDir}/`);
  }

  /**
   * Fix CSP violations in a single HTML file
   */
  fixHtmlFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    let modified = false;

    const fixes = [
      // Navigation links hover
      {
        pattern: /onmouseover="this\.style\.color='var\(--md-sys-color-primary\)'"\s*onmouseout="this\.style\.color='var\(--md-sys-color-on-surface\)'"/g,
        replacement: 'class="nav-link"',
        description: 'Navigation hover effects'
      },

      // Dropdown trigger
      {
        pattern: /onmouseover="this\.style\.color='var\(--md-sys-color-primary\)';\s*this\.nextElementSibling\.style\.display='block'"\s*onmouseout="this\.style\.color='var\(--md-sys-color-on-surface\)'"/g,
        replacement: 'class="nav-link dropdown-trigger"',
        description: 'Dropdown trigger'
      },

      // Dropdown menu
      {
        pattern: /onmouseover="this\.style\.display='block'"\s*onmouseout="this\.style\.display='none'"/g,
        replacement: 'class="dropdown-menu"',
        description: 'Dropdown menu'
      },

      // Dropdown items
      {
        pattern: /style="([^"]*)"[^>]*onmouseover="this\.style\.color='var\(--md-sys-color-primary\)'"\s*onmouseout="this\.style\.color='var\(--md-sys-color-on-surface\)'"/g,
        replacement: 'class="dropdown-item" style="$1"',
        description: 'Dropdown items'
      },

      // Primary button hover effects
      {
        pattern: /onmouseover="this\.style\.transform='translateY\(-2px\)';\s*this\.style\.boxShadow='0 6px 20px rgba\(0,0,0,0\.2\)'"\s*onmouseout="this\.style\.transform='translateY\(0\)';\s*this\.style\.boxShadow='0 4px 12px rgba\(0,0,0,0\.15\)'"/g,
        replacement: 'class="primary-btn"',
        description: 'Primary button hover'
      },

      // Secondary button hover effects
      {
        pattern: /onmouseover="this\.style\.background='var\(--md-sys-color-on-primary-container\)';\s*this\.style\.color='var\(--md-sys-color-primary-container\)'"\s*onmouseout="this\.style\.background='transparent';\s*this\.style\.color='var\(--md-sys-color-on-primary-container\)'"/g,
        replacement: 'class="secondary-btn"',
        description: 'Secondary button hover'
      },

      // Large button hover effects
      {
        pattern: /onmouseover="this\.style\.transform='translateY\(-3px\) scale\(1\.02\)';\s*this\.style\.boxShadow='0 10px 30px rgba\(0,0,0,0\.2\)'"\s*onmouseout="this\.style\.transform='translateY\(0\) scale\(1\)';\s*this\.style\.boxShadow='0 6px 20px rgba\(0,0,0,0\.15\)'"/g,
        replacement: 'class="large-btn"',
        description: 'Large button hover'
      },

      // Wine card hover effects
      {
        pattern: /onmouseover="this\.style\.transform='translateY\(-5px\)';\s*this\.style\.boxShadow='0 8px 30px rgba\(0,0,0,0\.15\)'"\s*onmouseout="this\.style\.transform='translateY\(0\)';\s*this\.style\.boxShadow='0 4px 20px rgba\(0,0,0,0\.1\)'"/g,
        replacement: 'class="wine-card"',
        description: 'Wine card hover'
      },

      // Service card hover effects
      {
        pattern: /onmouseover="this\.style\.transform='translateY\(-5px\)';\s*this\.style\.boxShadow='0 8px 30px rgba\(0,0,0,0\.15\)'"\s*onmouseout="this\.style\.transform='translateY\(0\)';\s*this\.style\.boxShadow='0 4px 20px rgba\(0,0,0,0\.1\)'"/g,
        replacement: 'class="service-card"',
        description: 'Service card hover'
      },

      // Contact card hover effects
      {
        pattern: /onmouseover="this\.style\.transform='translateY\(-3px\)';\s*this\.style\.boxShadow='0 8px 25px rgba\(0,0,0,0\.12\)'"\s*onmouseout="this\.style\.transform='translateY\(0\)';\s*this\.style\.boxShadow='0 4px 15px rgba\(0,0,0,0\.08\)'"/g,
        replacement: 'class="contact-card"',
        description: 'Contact card hover'
      },

      // Generic onclick handlers
      {
        pattern: /onclick="window\.scrollTo\(\{top:\s*0,\s*behavior:\s*'smooth'\}\)"/g,
        replacement: 'id="back-to-top-btn"',
        description: 'Back to top click'
      },

      {
        pattern: /onclick="window\.location\.reload\(\)"/g,
        replacement: 'class="reload-btn"',
        description: 'Reload button click'
      },

      // Remove any remaining inline handlers
      {
        pattern: /\s*on(click|mouseover|mouseout|mouseenter|mouseleave)="[^"]*"/g,
        replacement: '',
        description: 'Remaining inline handlers'
      }
    ];

    fixes.forEach(fix => {
      const beforeCount = (content.match(fix.pattern) || []).length;
      if (beforeCount > 0) {
        content = content.replace(fix.pattern, fix.replacement);
        console.log(`  ✅ Fixed ${beforeCount} instances of ${fix.description}`);
        modified = true;
      }
    });

    // Add CSP-fix script if not already present
    if (!content.includes('js/csp-fix.js') && content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="js/csp-fix.js"></script>\n</body>'
      );
      console.log(`  ✅ Added CSP-fix script`);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filename, content);
      this.fixedCount++;
      console.log(`✅ Fixed ${filename}`);
    } else {
      console.log(`ℹ️  ${filename} - no changes needed`);
    }
  }

  /**
   * Process all HTML files
   */
  fixAllFiles() {
    console.log('\n🔧 Processing HTML files...\n');

    this.htmlFiles.forEach(file => {
      console.log(`📝 Processing ${file}:`);
      this.fixHtmlFile(file);
      console.log('');
    });
  }

  /**
   * Generate summary report
   */
  generateReport() {
    console.log('🛡️  CSP VIOLATION FIX REPORT');
    console.log('=' .repeat(50));
    console.log(`📄 Files processed: ${this.htmlFiles.length}`);
    console.log(`✅ Files modified: ${this.fixedCount}`);
    console.log(`💾 Backups created in: ${this.backupDir}/`);

    console.log('\n📋 What was fixed:');
    console.log('  • Inline onmouseover/onmouseout events → CSS classes + event listeners');
    console.log('  • Inline onclick events → ID/class + event listeners');
    console.log('  • Added CSP-compliant JavaScript files');

    console.log('\n🚀 Next steps:');
    console.log('  1. Test your website to ensure all interactions work');
    console.log('  2. Add Content-Security-Policy header to your server');
    console.log('  3. Recommended CSP header:');
    console.log('     Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; font-src \'self\';');

    if (this.fixedCount > 0) {
      console.log('\n⚠️  If something breaks:');
      console.log(`  • Restore from backups in ${this.backupDir}/`);
      console.log('  • Check browser console for JavaScript errors');
    }

    console.log(`\n⏰ Fix completed at: ${new Date().toLocaleString('zh-TW')}`);
  }

  /**
   * Main fixing process
   */
  fix() {
    console.log('🛡️  Seven Pyramid CSP Violations Fixer');
    console.log('🍷 Making your wine website Content Security Policy compliant\n');

    try {
      this.findHtmlFiles();
      this.createBackups();
      this.fixAllFiles();
      this.generateReport();

      return true;
    } catch (error) {
      console.error('❌ CSP fix failed:', error.message);
      console.error('\n🔄 You can restore from backups if needed:');
      console.error(`cp ${this.backupDir}/*.backup ./`);
      return false;
    }
  }
}

// Command line interface
if (require.main === module) {
  const fixer = new CSPFixer();
  const success = fixer.fix();
  process.exit(success ? 0 : 1);
}

module.exports = CSPFixer;