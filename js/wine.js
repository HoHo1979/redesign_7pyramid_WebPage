// Wine page functionality with SEO optimization
(function() {
  'use strict';

  // Configuration
  const FIRESTORE_CONFIG = {
    // Add your Firebase config here
    // This is where you'll initialize Firebase/Firestore
  };

  // URL parsing and routing
  function parseWineUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const wine = urlParams.get('wine');
    const year = urlParams.get('year');

    // Alternative: parse from hash or pathname
    // Example: wine.html#chateau-lafite-2015
    // or: /wine/chateau-lafite-2015

    if (wine && year) {
      return { wine, year };
    }

    // Try parsing from hash
    const hash = window.location.hash.substring(1);
    if (hash) {
      const parts = hash.split('-');
      if (parts.length >= 3) {
        const year = parts.pop();
        const wine = parts.join('-');
        return { wine, year };
      }
    }

    return null;
  }

  // Update meta tags for SEO
  function updateMetaTags(wineData) {
    const { nameChinese, nameEnglish, year, description, price, region, image } = wineData;

    // Update title
    const title = `${nameChinese} ${nameEnglish} ${year}年 - 台灣酒商`;
    document.getElementById('page-title').textContent = title;
    document.title = title;

    // Update description
    const metaDescription = `${nameChinese} (${nameEnglish}) ${year}年份，來自${region}的頂級紅酒。${description ? description.substring(0, 120) + '...' : ''}`;
    document.getElementById('page-description').setAttribute('content', metaDescription);

    // Update keywords
    const keywords = `${nameChinese}, ${nameEnglish}, ${year}年, ${region}, 紅酒, 法國酒, 台灣酒商`;
    document.getElementById('page-keywords').setAttribute('content', keywords);

    // Update Open Graph tags
    document.getElementById('og-title').setAttribute('content', title);
    document.getElementById('og-description').setAttribute('content', metaDescription);
    document.getElementById('og-image').setAttribute('content', image || '/images/default-wine.jpg');
    document.getElementById('og-url').setAttribute('content', window.location.href);

    // Update canonical URL if needed
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }

  // Generate structured data for SEO
  function generateStructuredData(wineData) {
    const { nameChinese, nameEnglish, year, description, price, region, alcohol, grapes, image } = wineData;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${nameChinese} ${nameEnglish} ${year}`,
      "alternateName": [nameChinese, nameEnglish],
      "description": description || `${nameChinese} (${nameEnglish}) ${year}年份來自${region}的優質紅酒`,
      "image": image || "/images/default-wine.jpg",
      "brand": {
        "@type": "Brand",
        "name": nameEnglish.split(' ')[0] // e.g., "Chateau" from "Chateau Lafite"
      },
      "category": "Wine",
      "alcoholContent": alcohol,
      "productionDate": year,
      "offers": {
        "@type": "Offer",
        "price": price ? price.toString().replace(/[^\d]/g, '') : "0",
        "priceCurrency": "TWD",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "@id": "https://example.com/#organization"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "ratingCount": "10"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Region",
          "value": region
        },
        {
          "@type": "PropertyValue",
          "name": "Grape Variety",
          "value": grapes
        },
        {
          "@type": "PropertyValue",
          "name": "Vintage Year",
          "value": year
        }
      ]
    };

    document.getElementById('wine-structured-data').textContent = JSON.stringify(structuredData);
  }

  // Populate wine content
  function populateWineContent(wineData) {
    const {
      nameChinese,
      nameEnglish,
      year,
      description,
      tastingNotes,
      price,
      region,
      alcohol,
      grapes,
      image,
      stock
    } = wineData;

    // Update content elements
    document.getElementById('wine-name').textContent = nameChinese;
    document.getElementById('wine-name-en').textContent = nameEnglish;
    document.getElementById('wine-year').textContent = `${year} 年份`;
    document.getElementById('wine-region').textContent = region;
    document.getElementById('wine-alcohol').textContent = alcohol;
    document.getElementById('wine-grapes').textContent = grapes;
    document.getElementById('wine-price').textContent = price;
    document.getElementById('wine-stock').textContent = stock === 'available' ? '有庫存' : '缺貨中';
    document.getElementById('wine-description').innerHTML = description;
    document.getElementById('wine-tasting-notes').innerHTML = tastingNotes;

    // Update image
    const wineImage = document.getElementById('wine-image');
    wineImage.src = image || '/images/default-wine.jpg';
    wineImage.alt = `${nameChinese} ${nameEnglish} ${year}年`;

    // Show content, hide loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('wine-content').style.display = 'block';

    // Update contact button
    document.getElementById('contact-btn').onclick = function() {
      // Add contact functionality here
      const message = `我想了解 ${nameChinese} (${nameEnglish}) ${year}年 的詳細資訊和價格`;
      const whatsappUrl = `https://wa.me/886123456789?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };
  }

  // Mock Firestore data fetch (replace with actual Firebase integration)
  async function fetchWineData(wineName, year) {
    // This would be replaced with actual Firestore query
    // Example: const doc = await db.collection('wines').where('slug', '==', wineName).where('year', '==', year).get();

    // Mock data for demonstration
    const mockData = {
      'chateau-lafite': {
        nameChinese: '拉菲酒莊',
        nameEnglish: 'Chateau Lafite Rothschild',
        year: year,
        description: '拉菲酒莊 (Château Lafite Rothschild) 是法國波爾多地區最著名的酒莊之一，被譽為世界頂級紅酒的代表。這款' + year + '年份的拉菲展現了極致的優雅與複雜度，擁有深邃的紅寶石色澤和層次豐富的香氣。',
        tastingNotes: '香氣：黑醋栗、雪松、香草和淡淡的煙燻味<br>口感：單寧絲滑，酸度平衡，餘韻悠長<br>適飲溫度：16-18°C<br>建議醒酒：2-3小時',
        price: 'NT$ 25,000',
        region: '法國波爾多左岸',
        alcohol: '13.5%',
        grapes: 'Cabernet Sauvignon 70%, Merlot 25%, Cabernet Franc 3%, Petit Verdot 2%',
        image: '/images/chateau-lafite-' + year + '.jpg',
        stock: 'available'
      },
      'chateau-margaux': {
        nameChinese: '瑪歌酒莊',
        nameEnglish: 'Chateau Margaux',
        year: year,
        description: '瑪歌酒莊 (Château Margaux) 是波爾多五大一級酒莊之一，以其優雅細膩的風格聞名於世。' + year + '年份展現了瑪歌村特有的芬芳與柔順，是收藏家爭相收藏的珍品。',
        tastingNotes: '香氣：紫羅蘭花香、黑莓、甘草和礦物質<br>口感：優雅絲滑，單寧細緻，餘韻綿長<br>適飲溫度：16-18°C<br>建議醒酒：1-2小時',
        price: 'NT$ 22,000',
        region: '法國波爾多瑪歌村',
        alcohol: '13%',
        grapes: 'Cabernet Sauvignon 85%, Merlot 10%, Petit Verdot 3%, Cabernet Franc 2%',
        image: '/images/chateau-margaux-' + year + '.jpg',
        stock: 'available'
      }
    };

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockData[wineName] || null;
  }

  // Show error state
  function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('error-message').textContent = message;

    // Update meta tags for error page
    document.title = '酒款未找到 - 台灣酒商';
    document.getElementById('page-title').textContent = '酒款未找到 - 台灣酒商';
  }

  // Initialize page
  async function initWinePage() {
    try {
      const urlData = parseWineUrl();

      if (!urlData) {
        showError('無效的酒款連結');
        return;
      }

      const { wine, year } = urlData;

      // Fetch wine data from Firestore
      const wineData = await fetchWineData(wine, year);

      if (!wineData) {
        showError(`找不到 ${wine} ${year}年 的酒款資訊`);
        return;
      }

      // Update SEO elements
      updateMetaTags(wineData);
      generateStructuredData(wineData);

      // Populate content
      populateWineContent(wineData);

    } catch (error) {
      console.error('Error loading wine data:', error);
      showError('載入酒款資訊時發生錯誤');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWinePage);
  } else {
    initWinePage();
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', initWinePage);

})();