const fs = require('fs');
const https = require('https');
const http = require('http');

// Load wine inventory
const wineData = JSON.parse(fs.readFileSync('./sevenStock_final.json', 'utf8'));
const wines = wineData.grade_wine_inventory;

// Manual image mappings based on producer/winery research
// This approach works better than automated searching
const wineImageMap = {
  // Bordeaux - Saint-Emilion
  'ausone': {
    winery: 'https://en.wikipedia.org/wiki/Château_Ausone#/media/File:Ch%C3%A2teau_Ausone_2014.jpg',
    producer: 'Château Ausone'
  },
  'cheval blanc': {
    winery: 'https://en.wikipedia.org/wiki/Château_Cheval_Blanc#/media/File:Ch%C3%A2teau_Cheval_Blanc.jpg',
    producer: 'Château Cheval Blanc'
  },
  'angelus': {
    winery: 'https://en.wikipedia.org/wiki/Château_Angelus#/media/File:Ch%C3%A2teau_Ang%C3%A9lus.jpg',
    producer: 'Château Angelus'
  },
  'pavie': {
    winery: 'https://en.wikipedia.org/wiki/Château_Pavie#/media/File:Ch%C3%A2teau_Pavie.jpg',
    producer: 'Château Pavie'
  },
  'figeac': {
    winery: 'https://en.wikipedia.org/wiki/Château_Figeac#/media/File:Ch%C3%A2teau_Fi%C3%A9ac.jpg',
    producer: 'Château Figeac'
  },
  'vieux chateau certan': {
    winery: 'https://en.wikipedia.org/wiki/Vieux_Château_Certan#/media/File:VieuxChateau_Certan.jpg',
    producer: 'Vieux Château Certan'
  },
  'pichon lalande': {
    winery: 'https://en.wikipedia.org/wiki/Pauillac#/media/File:Ch%C3%A2teau_Pichon_Longueville_Comtesse_de_Lalande_001.jpg',
    producer: 'Château Pichon Longueville Comtesse de Lalande'
  },
  'margaux': {
    winery: 'https://en.wikipedia.org/wiki/Château_Margaux#/media/File:Ch%C3%A2teau_Margaux.jpg',
    producer: 'Château Margaux'
  },
  'pichon baron': {
    winery: 'https://en.wikipedia.org/wiki/Château_Pichon-Longueville_Comtesse_de_Lalande',
    producer: 'Château Pichon Longueville Baron'
  },
  'lynch bages': {
    winery: 'https://en.wikipedia.org/wiki/Château_Lynch_Bages#/media/File:Chateau_Lynch-Bages.JPG',
    producer: 'Château Lynch Bages'
  },
  'lafite rothschild': {
    winery: 'https://en.wikipedia.org/wiki/Château_Lafite_Rothschild#/media/File:Château_Lafite_1.jpg',
    producer: 'Château Lafite Rothschild'
  },
  'latour': {
    winery: 'https://en.wikipedia.org/wiki/Château_Latour#/media/File:Chateau_Latour.JPG',
    producer: 'Château Latour'
  },
  'mouton rothschild': {
    winery: 'https://en.wikipedia.org/wiki/Château_Mouton_Rothschild#/media/File:Chateau_Mouton_2.jpg',
    producer: 'Château Mouton Rothschild'
  },
  'palmer': {
    winery: 'https://en.wikipedia.org/wiki/Château_Palmer#/media/File:Ch%C3%A2teau_Palmer.jpg',
    producer: 'Château Palmer'
  },
  'd\'yquem': {
    winery: 'https://en.wikipedia.org/wiki/Château_d\'Yquem#/media/File:Ch%C3%A2teau_d%27Yquem.jpg',
    producer: 'Château d\'Yquem'
  }
};

function getWineryInfo(wineName) {
  const nameLower = wineName.toLowerCase();
  
  for (const [key, value] of Object.entries(wineImageMap)) {
    if (nameLower.includes(key)) {
      return value;
    }
  }
  
  return null;
}

function generateMarkdown() {
  let markdown = '# Wine Image Links Reference\n';
  markdown += `Generated: ${new Date().toISOString().split('T')[0]}\n\n`;
  markdown += 'Wine Inventory: Seven Pyramid - 七銘企業\n\n';
  
  // Group wines by category
  const winesByCategory = {};
  wines.forEach(wine => {
    const cat = wine.category || 'Other';
    if (!winesByCategory[cat]) {
      winesByCategory[cat] = [];
    }
    winesByCategory[cat].push(wine);
  });

  // Generate markdown for each category
  Object.keys(winesByCategory).sort().forEach(category => {
    markdown += `## ${category}\n\n`;
    
    const categoryWines = winesByCategory[category];
    
    // Track processed wineries to avoid duplicates
    const processedWineries = new Set();
    
    categoryWines.forEach(wine => {
      markdown += `### ${wine.product_name_en} (${wine.product_name_cn})\n`;
      markdown += `- **Wine Details**: Category: ${wine.category}\n`;
      markdown += `- **Product ID**: ${wine.product_id}\n`;
      
      const wineryInfo = getWineryInfo(wine.product_name_en);
      if (wineryInfo) {
        markdown += `- **Winery/Producer**: ${wineryInfo.producer}\n`;
        markdown += `- **Winery Image**: [${wineryInfo.producer}](${wineryInfo.winery})\n`;
        processedWineries.add(wineryInfo.producer);
      } else {
        markdown += `- **Winery/Producer**: [To be identified]\n`;
        markdown += `- **Winery Image**: [Image URL not found - manual search needed]\n`;
      }
      
      markdown += `- **Product Image**: [To be retrieved from wine retailer database]\n`;
      markdown += `- **Score**: ${wine.score ? wine.score.join(', ') : 'N/A'}\n`;
      markdown += `- **Notes**: Stock quantity: ${wine.stock_quantity} ${wine.unit}, Cost price: ${wine.cost_price}\n\n`;
    });
    
    markdown += '---\n\n';
  });

  markdown += '## Summary\n\n';
  markdown += `- **Total Wines**: ${wines.length}\n`;
  markdown += `- **Total Categories**: ${Object.keys(winesByCategory).length}\n`;
  markdown += `- **Generated Date**: ${new Date().toISOString().split('T')[0]}\n\n`;
  
  markdown += '## Notes on Image Sourcing\n\n';
  markdown += '- Product images should be sourced from wine retailer databases (Wine-Searcher, Vivino, etc.)\n';
  markdown += '- Winery images are linked from official sources and Wikipedia where available\n';
  markdown += '- Manual verification recommended for rare/older vintages\n';
  markdown += '- Some images may require licensing verification for commercial use\n\n';
  
  markdown += '## Recommended Sources for Image Retrieval\n\n';
  markdown += '- [Wine-Searcher](https://www.wine-searcher.com/)\n';
  markdown += '- [Vivino](https://www.vivino.com/)\n';
  markdown += '- [WineFolly](https://www.winebazaar.com/)\n';
  markdown += '- Official Winery Websites\n';
  markdown += '- Wine Auction Sites (Christie\'s, Sotheby\'s)\n';
  
  return markdown;
}

// Generate and save the markdown file
const markdown = generateMarkdown();
fs.writeFileSync('./wine_image_link.md', markdown, 'utf8');

console.log('Wine image reference file generated successfully!');
console.log('File saved to: ./wine_image_link.md');
console.log(`Total wines processed: ${wines.length}`);
