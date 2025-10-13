#!/usr/bin/env node

/**
 * Seven Pyramid Wine Statistics Generator
 * Generates detailed analytics and insights from wine data
 * Usage: node wine-stats.js [--json]
 */

const { WineStatsGenerator } = require('./validate-wine-data');

class WineAnalytics {
  constructor() {
    this.statsGenerator = new WineStatsGenerator();
  }

  /**
   * Generate comprehensive analytics
   */
  generateAnalytics() {
    const stats = this.statsGenerator.generateDetailedStats();

    const analytics = {
      ...stats,
      insights: this.generateInsights(stats),
      recommendations: this.generateRecommendations(stats),
      marketAnalysis: this.generateMarketAnalysis(stats)
    };

    return analytics;
  }

  /**
   * Generate business insights
   */
  generateInsights(stats) {
    const insights = [];

    // Stock insights
    const stockPercentage = (stats.inStock / stats.totalWines) * 100;
    insights.push({
      type: 'inventory',
      title: '庫存狀況',
      value: `${stockPercentage.toFixed(1)}%`,
      description: `${stats.inStock}/${stats.totalWines} 款酒有現貨`,
      status: stockPercentage > 80 ? 'good' : stockPercentage > 60 ? 'warning' : 'critical'
    });

    // Price analysis
    const avgPrice = Object.values(stats.countries).reduce((sum, country) =>
      sum + country.averagePrice, 0) / stats.countries;

    insights.push({
      type: 'pricing',
      title: '平均價格',
      value: `NT$ ${Math.round(avgPrice).toLocaleString()}`,
      description: '所有酒款平均價格',
      status: 'info'
    });

    // Most popular vintage
    const vintages = Object.entries(stats.vintages);
    if (vintages.length > 0) {
      const topVintage = vintages.reduce((max, current) =>
        current[1] > max[1] ? current : max
      );

      insights.push({
        type: 'vintage',
        title: '最熱門年份',
        value: topVintage[0],
        description: `${topVintage[1]} 款酒`,
        status: 'info'
      });
    }

    // Category distribution
    const topCategory = Object.entries(stats.categories).reduce((max, current) =>
      current[1] > max[1] ? current : max
    );

    insights.push({
      type: 'category',
      title: '主要類別',
      value: topCategory[0],
      description: `${topCategory[1]} 款酒 (${((topCategory[1] / stats.totalWines) * 100).toFixed(1)}%)`,
      status: 'info'
    });

    // Missing images
    if (stats.missingImages > 0) {
      insights.push({
        type: 'content',
        title: '缺少圖片',
        value: `${stats.missingImages} 款`,
        description: `${((stats.missingImages / stats.totalWines) * 100).toFixed(1)}% 的酒款沒有專屬圖片`,
        status: 'warning'
      });
    }

    return insights;
  }

  /**
   * Generate business recommendations
   */
  generateRecommendations(stats) {
    const recommendations = [];

    // Inventory recommendations
    if (stats.outOfStock > stats.inStock * 0.3) {
      recommendations.push({
        priority: 'high',
        category: 'inventory',
        title: '補充庫存',
        description: `${stats.outOfStock} 款酒缺貨，建議優先補充熱門酒款`,
        action: '檢查銷售數據，優先進貨暢銷品項'
      });
    }

    // Price optimization
    const budgetRatio = stats.priceRanges.budget / stats.totalWines;
    if (budgetRatio < 0.2) {
      recommendations.push({
        priority: 'medium',
        category: 'pricing',
        title: '增加入門款',
        description: `入門價位酒款僅占 ${(budgetRatio * 100).toFixed(1)}%`,
        action: '考慮增加 NT$3,000 以下的親民酒款'
      });
    }

    // Content recommendations
    if (stats.missingImages > stats.totalWines * 0.1) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        title: '完善酒款圖片',
        description: `${stats.missingImages} 款酒沒有專屬圖片`,
        action: '安排專業攝影，提升視覺吸引力'
      });
    }

    // SEO recommendations
    recommendations.push({
      priority: 'low',
      category: 'seo',
      title: 'SEO 優化',
      description: '定期更新酒款描述和關鍵字',
      action: '每月檢查並優化酒款 SEO 內容'
    });

    return recommendations;
  }

  /**
   * Generate market analysis
   */
  generateMarketAnalysis(stats) {
    const analysis = {
      priceDistribution: {
        budget: {
          count: stats.priceRanges.budget,
          percentage: (stats.priceRanges.budget / stats.totalWines * 100).toFixed(1),
          range: '< NT$3,000'
        },
        mid: {
          count: stats.priceRanges.mid,
          percentage: (stats.priceRanges.mid / stats.totalWines * 100).toFixed(1),
          range: 'NT$3,000-10,000'
        },
        premium: {
          count: stats.priceRanges.premium,
          percentage: (stats.priceRanges.premium / stats.totalWines * 100).toFixed(1),
          range: 'NT$10,000-30,000'
        },
        luxury: {
          count: stats.priceRanges.luxury,
          percentage: (stats.priceRanges.luxury / stats.totalWines * 100).toFixed(1),
          range: '> NT$30,000'
        }
      },
      countryAnalysis: {},
      regionAnalysis: {},
      trendAnalysis: this.analyzeTrends(stats)
    };

    // Country performance
    Object.entries(stats.countries).forEach(([code, country]) => {
      analysis.countryAnalysis[code] = {
        name: country.name,
        marketShare: (country.totalWines / stats.totalWines * 100).toFixed(1),
        avgPrice: Math.round(country.averagePrice),
        stockRate: (country.inStock / country.totalWines * 100).toFixed(1),
        performance: this.calculateCountryPerformance(country)
      };
    });

    // Top regions
    const regionEntries = Object.entries(stats.regions)
      .sort(([,a], [,b]) => b.totalWines - a.totalWines)
      .slice(0, 10);

    regionEntries.forEach(([code, region]) => {
      analysis.regionAnalysis[code] = {
        name: region.name,
        country: region.country,
        wineCount: region.totalWines,
        avgPrice: Math.round(region.averagePrice),
        marketShare: (region.totalWines / stats.totalWines * 100).toFixed(1)
      };
    });

    return analysis;
  }

  /**
   * Calculate country performance score
   */
  calculateCountryPerformance(country) {
    const stockScore = (country.inStock / country.totalWines) * 40; // 40% weight
    const volumeScore = Math.min(country.totalWines / 10, 1) * 30; // 30% weight
    const priceScore = Math.min(country.averagePrice / 15000, 1) * 30; // 30% weight

    const totalScore = stockScore + volumeScore + priceScore;

    if (totalScore >= 80) return 'excellent';
    if (totalScore >= 60) return 'good';
    if (totalScore >= 40) return 'fair';
    return 'needs-improvement';
  }

  /**
   * Analyze trends
   */
  analyzeTrends(stats) {
    const currentYear = new Date().getFullYear();
    const recentVintages = Object.entries(stats.vintages)
      .filter(([vintage]) => {
        const year = parseInt(vintage);
        return year >= currentYear - 5 && year <= currentYear;
      })
      .reduce((sum, [, count]) => sum + count, 0);

    return {
      recentVintages: {
        count: recentVintages,
        percentage: (recentVintages / stats.totalWines * 100).toFixed(1)
      },
      vintageRange: {
        oldest: Math.min(...Object.keys(stats.vintages)
          .filter(v => v !== 'NV')
          .map(v => parseInt(v))),
        newest: Math.max(...Object.keys(stats.vintages)
          .filter(v => v !== 'NV')
          .map(v => parseInt(v)))
      },
      categoryTrends: this.analyzeCategoryTrends(stats.categories)
    };
  }

  /**
   * Analyze category trends
   */
  analyzeCategoryTrends(categories) {
    const total = Object.values(categories).reduce((sum, count) => sum + count, 0);
    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      share: (count / total * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Display analytics in console
   */
  displayAnalytics(analytics) {
    console.log('🍷 SEVEN PYRAMID WINE ANALYTICS DASHBOARD');
    console.log('=' .repeat(60));

    // Key insights
    console.log('\n📊 KEY INSIGHTS');
    analytics.insights.forEach(insight => {
      const statusIcon = {
        good: '✅',
        warning: '⚠️',
        critical: '❌',
        info: 'ℹ️'
      }[insight.status];

      console.log(`${statusIcon} ${insight.title}: ${insight.value}`);
      console.log(`   ${insight.description}`);
    });

    // Price distribution
    console.log('\n💰 PRICE ANALYSIS');
    Object.entries(analytics.marketAnalysis.priceDistribution).forEach(([tier, data]) => {
      const barLength = Math.round(parseFloat(data.percentage) / 5);
      const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
      console.log(`${data.range.padEnd(20)} │${bar}│ ${data.percentage}% (${data.count} wines)`);
    });

    // Country performance
    console.log('\n🌍 COUNTRY PERFORMANCE');
    Object.entries(analytics.marketAnalysis.countryAnalysis)
      .sort(([,a], [,b]) => parseFloat(b.marketShare) - parseFloat(a.marketShare))
      .forEach(([code, country]) => {
        const performanceIcon = {
          'excellent': '🏆',
          'good': '👍',
          'fair': '⚖️',
          'needs-improvement': '📈'
        }[country.performance];

        console.log(`${performanceIcon} ${country.name}: ${country.marketShare}% market share, avg NT$${country.avgPrice.toLocaleString()}, ${country.stockRate}% in stock`);
      });

    // Top regions
    console.log('\n📍 TOP WINE REGIONS');
    Object.entries(analytics.marketAnalysis.regionAnalysis)
      .slice(0, 5)
      .forEach(([code, region]) => {
        console.log(`🍇 ${region.name} (${region.country}): ${region.wineCount} wines, avg NT$${region.avgPrice.toLocaleString()}`);
      });

    // Recommendations
    if (analytics.recommendations.length > 0) {
      console.log('\n💡 BUSINESS RECOMMENDATIONS');
      analytics.recommendations.forEach(rec => {
        const priorityIcon = {
          high: '🔥',
          medium: '⚡',
          low: '💡'
        }[rec.priority];

        console.log(`${priorityIcon} ${rec.title}`);
        console.log(`   ${rec.description}`);
        console.log(`   Action: ${rec.action}`);
        console.log('');
      });
    }

    console.log(`\n⏰ Analytics generated at: ${new Date().toLocaleString('zh-TW')}`);
  }

  /**
   * Export analytics to JSON
   */
  exportToJSON(filename = 'wine-analytics.json') {
    const analytics = this.generateAnalytics();
    const fs = require('fs');

    fs.writeFileSync(filename, JSON.stringify(analytics, null, 2));
    console.log(`📄 Analytics exported to ${filename}`);

    return analytics;
  }

  /**
   * Run analytics
   */
  run(exportJSON = false) {
    console.log('🍷 Generating Seven Pyramid Wine Analytics...\n');

    try {
      const analytics = this.generateAnalytics();

      if (exportJSON) {
        this.exportToJSON();
      } else {
        this.displayAnalytics(analytics);
      }

      return analytics;
    } catch (error) {
      console.error('❌ Analytics generation failed:', error.message);
      return null;
    }
  }
}

// Command line interface
if (require.main === module) {
  const analytics = new WineAnalytics();
  const exportJSON = process.argv.includes('--json');
  analytics.run(exportJSON);
}

module.exports = WineAnalytics;