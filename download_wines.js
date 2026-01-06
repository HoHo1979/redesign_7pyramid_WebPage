const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stockPath = 'sevenStock_final.json';
const mdPath = 'no_image_link.md';
const outputBase = 'generated/wines/images';

const countryFiles = {
    'France': 'french_wine_info.json',
    'USA': 'us_wine_info.json',
    'Chile': 'chile_wine_info.json'
};

const categoryToCountry = {
    'Saint-Emilion': 'France',
    'Pauillac': 'France',
    'Margaux': 'France',
    'Saint-Julien': 'France',
    'Pomerol': 'France',
    'Pessac-Léognan': 'France',
    'Saint-Estephe': 'France',
    'Sauternes': 'France',
    'Haut-Medoc': 'France',
    'Bordeaux': 'France',
    'Napa Valley': 'USA',
    'Chile': 'Chile',
    'Tuscany': 'Italy',
    'Italy': 'Italy',
    '一級酒莊': 'France',
    '二級酒莊': 'France',
    '三級酒莊': 'France',
    '四級酒莊': 'France',
    '五級酒莊': 'France',
    '波爾多': 'France',
    '勃根地': 'France',
    '香檳': 'France',
    '優級波爾多': 'France',
    '波爾多丘': 'France',
    '格拉夫': 'France',
    '中級酒莊': 'France',
};

// 1. Load Data
console.log("Loading data...");
let stockData = [];
try {
    const raw = fs.readFileSync(stockPath, 'utf8');
    const json = JSON.parse(raw);
    if (json.grade_wine_inventory) {
        stockData = json.grade_wine_inventory;
    } else if (Array.isArray(json)) {
        stockData = json;
    }
} catch (e) {
    console.error("Error reading stock data:", e.message);
    process.exit(1);
}

const countryMap = new Map(); 
for (const [country, file] of Object.entries(countryFiles)) {
    if (fs.existsSync(file)) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            for (const wine of data) {
                if (wine.original_name) {
                    countryMap.set(wine.original_name.trim(), country);
                }
            }
        } catch (e) {}
    }
}

// 2. Parse Markdown
console.log("Parsing markdown...");
let mdContent = "";
try {
    mdContent = fs.readFileSync(mdPath, 'utf8');
} catch (e) {
    console.error("Error reading markdown:", e.message);
    process.exit(1);
}

const lines = mdContent.split('\n');
const tasks = [];
let currentWine = null;

for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Handle bullet points
    if (line.startsWith('-')) {
        line = line.replace(/^-/, '').trim();
    }

    if (line.startsWith('http')) {
        if (currentWine) {
            tasks.push({ name: currentWine, url: line });
            currentWine = null;
        }
    } else {
        // Assume it's a wine name
        currentWine = line;
    }
}

// 3. Slugify Helper
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// 4. Process Tasks
async function run() {
    for (const task of tasks) {
        // Normalize task name: remove leading CH/Chateau
        let searchName = task.name.replace(/^(CH|Chateau|CHAT|CHATEAU)\s+/i, '').trim();
        
        // Find matching products
        const matches = stockData.filter(p => {
            if (!p.product_name_en) return false;
            let pName = p.product_name_en.replace(/^(CH|Chateau|CHAT|CHATEAU)\s+/i, '').trim();
            // Startswith check
            return pName.toLowerCase().startsWith(searchName.toLowerCase());
        });

        if (matches.length === 0) {
            console.log(`No products found for: ${task.name}`);
            continue;
        }

        console.log(`Processing ${task.name} (${matches.length} matches)`);

        for (const p of matches) {
            let country = countryMap.get(p.product_name_en) || categoryToCountry[p.category] || 'Other';
            if (['Masseto', 'Solaia', 'Bibi Graetz'].some(x => p.product_name_en.includes(x))) country = 'Italy';
            if (['Opus One', 'Overture'].some(x => p.product_name_en.includes(x))) country = 'USA';
            if (['Sena', 'Almaviva', 'Chadwick', 'Cheval des Andes', 'EPU'].some(x => p.product_name_en.includes(x))) country = 'Chile';

            const slug = slugify(p.product_name_en);
            
            // Force .jpg to match HTML expectation, even if source is png
            const ext = '.jpg'; 
            
            const dir = path.join(outputBase, slugify(country));
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const dest = path.join(dir, `${slug}${ext}`);
            
            if (fs.existsSync(dest)) {
                // console.log(`  Exists: ${dest}`);
                continue;
            }

            if (!task.url.startsWith('http')) {
                console.log(`  Invalid URL: ${task.url}`);
                continue;
            }
            
            if (!task.url.match(/\.(png|jpg|jpeg|gif)$/i) && !task.url.includes('images.vivino.com')) {
                 console.log(`  Skipping non-image page URL: ${task.url}`);
                 continue;
            }

            console.log(`  Downloading to ${dest}`);
            try {
                // Use curl. -L to follow redirects.
                execSync(`curl -s -L "${task.url}" -o "${dest}"`);
                // Sleep 3s
                await new Promise(r => setTimeout(r, 3000));
            } catch (e) {
                console.error(`  Error downloading: ${e.message}`);
            }
        }
    }
}

run();
