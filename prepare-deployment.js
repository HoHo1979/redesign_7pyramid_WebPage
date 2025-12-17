#!/usr/bin/env node

/**
 * Seven Pyramid Wine Website - Deployment Preparation Script
 * Creates a 'deploy' folder with only the files needed for web server upload
 * Usage: node prepare-deployment.js
 */

const fs = require('fs');
const path = require('path');

class DeploymentPreparation {
  constructor() {
    this.deployDir = './deploy';
    this.filesToDeploy = [
      // Core HTML files
      'index.html',
      'wine_list.html',
      '404.html',

      // SEO and PWA files
      'robots.txt',
      'sitemap.xml',
      'site.webmanifest',
      'favicon.ico',
      'icon.png',
      'icon.svg',
    ];

    this.foldersToDeployCompletely = [
      'css',
      'js',
      'img'
    ];

    this.copiedFiles = 0;
  }

  /**
   * Create deployment directory
   */
  createDeployDirectory() {
    if (fs.existsSync(this.deployDir)) {
      console.log('📁 Cleaning existing deploy directory...');
      fs.rmSync(this.deployDir, { recursive: true, force: true });
    }

    fs.mkdirSync(this.deployDir, { recursive: true });
    console.log(`✅ Created deployment directory: ${this.deployDir}/`);
  }

  /**
   * Copy a single file to deployment directory
   */
  copyFile(sourceFile, targetPath) {
    try {
      if (!fs.existsSync(sourceFile)) {
        console.log(`⚠️  Warning: ${sourceFile} not found - skipping`);
        return false;
      }

      // Create target directory if it doesn't exist
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.copyFileSync(sourceFile, targetPath);
      this.copiedFiles++;
      return true;
    } catch (error) {
      console.log(`❌ Error copying ${sourceFile}: ${error.message}`);
      return false;
    }
  }

  /**
   * Copy a directory recursively
   */
  copyDirectory(sourceDir, targetDir) {
    if (!fs.existsSync(sourceDir)) {
      console.log(`⚠️  Warning: ${sourceDir}/ not found - skipping`);
      return;
    }

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    const items = fs.readdirSync(sourceDir);

    items.forEach(item => {
      const sourcePath = path.join(sourceDir, item);
      const targetPath = path.join(targetDir, item);

      const stat = fs.statSync(sourcePath);

      if (stat.isDirectory()) {
        this.copyDirectory(sourcePath, targetPath);
      } else {
        this.copyFile(sourcePath, targetPath);
      }
    });
  }

  /**
   * Copy all required files for deployment
   */
  prepareFiles() {
    console.log('\n📄 Copying individual files...');

    // Copy individual files
    this.filesToDeploy.forEach(file => {
      const targetPath = path.join(this.deployDir, file);
      if (this.copyFile(file, targetPath)) {
        console.log(`  ✅ ${file}`);
      }
    });

    console.log('\n📁 Copying complete folders...');

    // Copy entire folders
    this.foldersToDeployCompletely.forEach(folder => {
      const targetPath = path.join(this.deployDir, folder);
      console.log(`  📁 ${folder}/`);
      this.copyDirectory(folder, targetPath);
    });
  }

  /**
   * Generate deployment summary
   */
  generateSummary() {
    const deploySize = this.calculateDirectorySize(this.deployDir);

    console.log('\n🚀 DEPLOYMENT PREPARATION COMPLETE');
    console.log('=' .repeat(50));
    console.log(`📁 Deployment folder: ${this.deployDir}/`);
    console.log(`📄 Files copied: ${this.copiedFiles}`);
    console.log(`💾 Total size: ${this.formatBytes(deploySize)}`);

    console.log('\n📋 Directory structure:');
    this.displayDirectoryTree(this.deployDir, '');

    console.log('\n🌐 Next steps:');
    console.log('1. Review files in deploy/ folder');
    console.log('2. Upload entire deploy/ folder contents to your web server');
    console.log('3. Test your website after upload');
    console.log('4. Submit sitemap.xml to Google Search Console');

    console.log('\n📤 Upload methods:');
    console.log('• FTP/SFTP: Upload all files in deploy/ to your web root');
    console.log('• cPanel File Manager: Drag & drop deploy/ contents');
    console.log('• SSH: scp -r deploy/* username@server:/path/to/webroot/');

    console.log(`\n⏰ Prepared at: ${new Date().toLocaleString('zh-TW')}`);
  }

  /**
   * Calculate directory size recursively
   */
  calculateDirectorySize(dirPath) {
    let size = 0;

    if (!fs.existsSync(dirPath)) return 0;

    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        size += this.calculateDirectorySize(itemPath);
      } else {
        size += stat.size;
      }
    });

    return size;
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Display directory tree structure
   */
  displayDirectoryTree(dirPath, prefix) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath).sort();

    items.forEach((item, index) => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      const isLast = index === items.length - 1;
      const currentPrefix = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');

      if (stat.isDirectory()) {
        console.log(`${prefix}${currentPrefix}${item}/`);
        this.displayDirectoryTree(itemPath, nextPrefix);
      } else {
        const size = this.formatBytes(stat.size);
        console.log(`${prefix}${currentPrefix}${item} (${size})`);
      }
    });
  }

  /**
   * Create deployment preparation report
   */
  createDeploymentReport() {
    const reportContent = `# Seven Pyramid Wine Website - Deployment Report
Generated: ${new Date().toLocaleString('zh-TW')}

## Files Prepared for Deployment
Total files: ${this.copiedFiles}

### HTML Files
- index.html (Main landing page)
- wine_list.html (Wine catalog)
- 404.html (Error page)

### Assets
- css/ folder (All stylesheets)
- js/ folder (JavaScript files)
- img/ folder (All images and logos)

### SEO & PWA Files
- robots.txt (Search engine instructions)
- sitemap.xml (SEO sitemap)
- site.webmanifest (PWA manifest)
- favicon.ico (Website icon)
- icon.png (PWA icon)
- icon.svg (Vector icon)

## Upload Instructions
1. Connect to your web server via FTP/SFTP
2. Navigate to your website's root directory (usually public_html/, www/, or htdocs/)
3. Upload all files and folders from the deploy/ directory
4. Set proper file permissions (644 for files, 755 for folders)
5. Test your website

## Post-Deployment Checklist
- [ ] Website loads correctly
- [ ] All images display properly
- [ ] Navigation works
- [ ] Theme switching functions
- [ ] Wine catalog displays
- [ ] Mobile view works
- [ ] Submit sitemap.xml to Google Search Console

## Support
For issues, refer to DEPLOYMENT-GUIDE.md
`;

    const reportPath = path.join(this.deployDir, 'DEPLOYMENT-REPORT.txt');
    fs.writeFileSync(reportPath, reportContent);
    console.log(`📋 Created deployment report: ${reportPath}`);
  }

  /**
   * Main preparation process
   */
  prepare() {
    console.log('🍷 Seven Pyramid Wine Website - Deployment Preparation');
    console.log('📦 Preparing files for web server upload...\n');

    try {
      this.createDeployDirectory();
      this.prepareFiles();
      this.createDeploymentReport();
      this.generateSummary();

      return true;
    } catch (error) {
      console.error('❌ Deployment preparation failed:', error.message);
      return false;
    }
  }
}

// Command line interface
if (require.main === module) {
  const preparer = new DeploymentPreparation();
  const success = preparer.prepare();
  process.exit(success ? 0 : 1);
}

module.exports = DeploymentPreparation;