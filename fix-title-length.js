const fs = require('fs');
const path = require('path');

// Directory containing wine HTML files
const winesDir = path.join(__dirname, 'deploy', 'wines');

// Function to extract wine info from HTML
function extractWineInfo(html) {
  // Extract wine name from hero title
  const heroTitleMatch = html.match(/<h1 class="hero-title serif-en">(.*?)<\/h1>/);
  const wineName = heroTitleMatch ? heroTitleMatch[1].trim() : '';
  
  // Extract Chinese name
  const heroTitleTwMatch = html.match(/<h2 class="hero-title-tw serif-tw">(.*?)<\/h2>/);
  const wineNameTw = heroTitleTwMatch ? heroTitleTwMatch[1].trim() : '';
  
  // Extract current title
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const currentTitle = titleMatch ? titleMatch[1] : '';
  
  return { wineName, wineNameTw, currentTitle };
}

// Function to generate optimized title (under 70 chars)
function generateOptimizedTitle(wineInfo) {
  const { wineName, wineNameTw } = wineInfo;
  
  let title = '';
  
  // Strategy: Wine Name + Chinese Name (if fits) + Brand
  const brand = ' | 七銘企業';
  const maxLength = 70;
  
  if (wineName && wineNameTw) {
    // Try: Wine Name + Chinese Name + Brand
    let candidate = `${wineName} ${wineNameTw}${brand}`;
    
    if (candidate.length <= maxLength) {
      title = candidate;
    } else {
      // Try: Wine Name + Brand
      candidate = `${wineName}${brand}`;
      if (candidate.length <= maxLength) {
        title = candidate;
      } else {
        // Truncate wine name if needed
        const maxWineNameLength = maxLength - brand.length - 3; // 3 for "..."
        if (wineName.length > maxWineNameLength) {
          title = `${wineName.substring(0, maxWineNameLength)}...${brand}`;
        } else {
          title = candidate;
        }
      }
    }
  } else if (wineName) {
    title = `${wineName}${brand}`;
    if (title.length > maxLength) {
      const maxWineNameLength = maxLength - brand.length - 3;
      title = `${wineName.substring(0, maxWineNameLength)}...${brand}`;
    }
  } else {
    title = `頂級葡萄酒${brand}`;
  }
  
  return title;
}

// Function to update title in HTML
function updateTitle(html, newTitle) {
  const titleRegex = /<title>.*?<\/title>/;
  
  if (titleRegex.test(html)) {
    return html.replace(titleRegex, `<title>${newTitle}</title>`);
  }
  
  return html;
}

// Function to check if title needs updating (has old format)
function needsUpdate(title) {
  // Check if title is over 70 chars OR has old format markers
  return title.length > 70 || 
         title.includes('Seven Pyramid') || 
         /\d{4}\s+\d{4}\s+\|/.test(title); // Has duplicate year like "2020 2020 |"
}

// Main function to process all wine files
function processWineFiles() {
  try {
    const files = fs.readdirSync(winesDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`Found ${htmlFiles.length} HTML files to process\n`);
    
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const longTitles = [];
    
    htmlFiles.forEach((file, index) => {
      const filePath = path.join(winesDir, file);
      
      try {
        // Read the HTML file
        const html = fs.readFileSync(filePath, 'utf8');
        
        // Extract wine information
        const wineInfo = extractWineInfo(html);
        
        // Check if title needs updating
        const currentTitleLength = wineInfo.currentTitle.length;
        
        if (!needsUpdate(wineInfo.currentTitle)) {
          skippedCount++;
          console.log(`[${index + 1}/${htmlFiles.length}] OK (${currentTitleLength} chars): ${file}`);
          return;
        }
        
        // Generate optimized title
        const newTitle = generateOptimizedTitle(wineInfo);
        
        // Update title in HTML
        const updatedHtml = updateTitle(html, newTitle);
        
        // Write the updated HTML back to file
        fs.writeFileSync(filePath, updatedHtml, 'utf8');
        processedCount++;
        
        console.log(`[${index + 1}/${htmlFiles.length}] UPDATED: ${file}`);
        console.log(`  Old (${currentTitleLength} chars): ${wineInfo.currentTitle}`);
        console.log(`  New (${newTitle.length} chars): ${newTitle}`);
        
        if (newTitle.length > 70) {
          longTitles.push({ file, length: newTitle.length, title: newTitle });
        }
        
      } catch (error) {
        errorCount++;
        console.error(`[${index + 1}/${htmlFiles.length}] ERROR processing ${file}:`, error.message);
      }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY:');
    console.log(`  Total files: ${htmlFiles.length}`);
    console.log(`  Updated: ${processedCount}`);
    console.log(`  Already OK: ${skippedCount}`);
    console.log(`  Errors: ${errorCount}`);
    
    if (longTitles.length > 0) {
      console.log(`\n  WARNING: ${longTitles.length} titles still exceed 70 characters:`);
      longTitles.forEach(item => {
        console.log(`    - ${item.file} (${item.length} chars)`);
      });
    } else {
      console.log('\n  ✓ All titles are now under 70 characters!');
    }
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('Error reading wines directory:', error.message);
    process.exit(1);
  }
}

// Run the script
console.log('Starting title optimization process...\n');
processWineFiles();
console.log('\nProcess completed!');
