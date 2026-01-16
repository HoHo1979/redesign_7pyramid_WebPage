const fs = require('fs');
const path = require('path');

// Directory containing wine HTML files
const winesDir = path.join(__dirname, 'deploy', 'wines');

// Function to extract wine info from HTML
function extractWineInfo(html) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Extract wine name from hero title
  const heroTitleMatch = html.match(/<h1 class="hero-title serif-en">(.*?)<\/h1>/);
  const wineName = heroTitleMatch ? heroTitleMatch[1].trim() : '';
  
  // Extract Chinese name
  const heroTitleTwMatch = html.match(/<h2 class="hero-title-tw serif-tw">(.*?)<\/h2>/);
  const wineNameTw = heroTitleTwMatch ? heroTitleTwMatch[1].trim() : '';
  
  // Extract region
  const regionMatch = html.match(/<h3 class="hero-subtitle serif-en text-gold">(.*?)<\/h3>/);
  const region = regionMatch ? regionMatch[1].trim() : '';
  
  // Extract price
  const priceMatch = html.match(/<div class="price-amount">NT\$ ([\d,]+)<\/div>/);
  const price = priceMatch ? priceMatch[1] : '';
  
  return { title, wineName, wineNameTw, region, price };
}

// Function to generate meta description
function generateMetaDescription(wineInfo) {
  const { wineName, wineNameTw, region, price } = wineInfo;
  
  let description = '';
  
  if (wineName && wineNameTw) {
    description = `${wineName} ${wineNameTw} - 來自${region}的頂級葡萄酒`;
  } else if (wineName) {
    description = `${wineName} - Premium wine from ${region}`;
  } else {
    description = `頂級葡萄酒收藏 - Seven Pyramid 七銘企業`;
  }
  
  description += '。專業溫控儲存，原廠木箱供應。';
  
  if (price) {
    description += ` NT$ ${price}`;
  }
  
  description += ' | Seven Pyramid 七銘企業 - 葡萄酒烈酒進口商';
  
  // Limit to 160 characters for optimal SEO
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description;
}

// Function to add meta description to HTML
function addMetaDescription(html, description) {
  // Check if meta description already exists
  if (html.includes('<meta name="description"') || html.includes('<meta name=\'description\'')) {
    console.log('Meta description already exists, skipping...');
    return html;
  }
  
  // Find the viewport meta tag and insert after it
  const viewportMetaRegex = /(<meta name="viewport"[^>]*>)/;
  
  if (viewportMetaRegex.test(html)) {
    const metaDescriptionTag = `\n  <meta name="description" content="${description}">`;
    return html.replace(viewportMetaRegex, `$1${metaDescriptionTag}`);
  }
  
  // If viewport not found, insert after charset
  const charsetMetaRegex = /(<meta charset="[^"]*">)/;
  if (charsetMetaRegex.test(html)) {
    const metaDescriptionTag = `\n  <meta name="description" content="${description}">`;
    return html.replace(charsetMetaRegex, `$1${metaDescriptionTag}`);
  }
  
  return html;
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
    
    htmlFiles.forEach((file, index) => {
      const filePath = path.join(winesDir, file);
      
      try {
        // Read the HTML file
        const html = fs.readFileSync(filePath, 'utf8');
        
        // Extract wine information
        const wineInfo = extractWineInfo(html);
        
        // Generate meta description
        const metaDescription = generateMetaDescription(wineInfo);
        
        // Add meta description to HTML
        const updatedHtml = addMetaDescription(html, metaDescription);
        
        // Check if file was modified
        if (updatedHtml === html) {
          skippedCount++;
          console.log(`[${index + 1}/${htmlFiles.length}] SKIPPED: ${file}`);
        } else {
          // Write the updated HTML back to file
          fs.writeFileSync(filePath, updatedHtml, 'utf8');
          processedCount++;
          console.log(`[${index + 1}/${htmlFiles.length}] UPDATED: ${file}`);
          console.log(`  Description: ${metaDescription.substring(0, 80)}...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`[${index + 1}/${htmlFiles.length}] ERROR processing ${file}:`, error.message);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY:');
    console.log(`  Total files: ${htmlFiles.length}`);
    console.log(`  Updated: ${processedCount}`);
    console.log(`  Skipped: ${skippedCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error reading wines directory:', error.message);
    process.exit(1);
  }
}

// Run the script
console.log('Starting meta description addition process...\n');
processWineFiles();
console.log('\nProcess completed!');
