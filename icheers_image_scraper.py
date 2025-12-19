#!/usr/bin/env python3
"""
iCheers Wine Image URL Scraper and Mapper
==========================================

This script searches the iCheers wine website (https://www.icheers.tw) for wine products
and extracts their product image URLs to build a comprehensive mapping file.

Usage:
    python3 icheers_image_scraper.py --wine-list wines.txt --output icheers_urls.json

Requirements:
    pip install requests beautifulsoup4 lxml

Current Status: TEMPLATE - Not yet implemented
Ready to implement once you provide:
    1. Wine list with names and vintages
    2. iCheers product IDs (if available)
    3. Python environment setup
"""

import requests
import json
import time
import csv
from pathlib import Path
from typing import Dict, List, Optional
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ICheersScraper:
    """Scrapes wine product information from iCheers.tw"""

    BASE_URL = "https://www.icheers.tw"
    SEARCH_URL = f"{BASE_URL}/iCheers/Wine/WineList/wine_list"
    PRODUCT_URL = f"{BASE_URL}/iCheers/Wine/WineDetail/wine_detail"

    # Known winery IDs from research
    WINERY_IDS = {
        "Chateau Ausone": "WR000432",
        "Chateau Cheval Blanc": "WR000433",
        "Chateau Angelus": "WR000047",
        "Chateau Pavie": "WR000076",
        "Chateau Figeac": "WR000058",
        "Chateau Lafite Rothschild": "WR000068",
        "Chateau Margaux": "WR000088",
        "Chateau Latour": "WR000151",
        "Chateau Haut Brion": "WR000060",
        "Chateau Mouton Rothschild": "WR000262",
        "Opus One": "WR000239",
        "Almaviva": "WR000259",
        "Sena": "WR001133",
    }

    def __init__(self, output_file: str = "icheers_wine_mapping.json"):
        self.output_file = output_file
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        })
        self.results = []
        self.not_found = []

    def search_wine(self, wine_name: str, vintage: int) -> Optional[Dict]:
        """
        Search for a wine on iCheers by name and vintage

        Args:
            wine_name: Name of the wine (e.g., "Chateau Ausone")
            vintage: Vintage year (e.g., 2020)

        Returns:
            Dictionary with product info or None if not found
        """
        try:
            search_query = f"{wine_name} {vintage}"
            params = {
                'search': search_query,
            }

            logger.info(f"Searching for: {search_query}")

            # This would require actual implementation of the search
            # Currently placeholder - would need to reverse-engineer iCheers search API

            # Return None for now as search API not documented
            return None

        except Exception as e:
            logger.error(f"Error searching for {wine_name}: {e}")
            return None

    def fetch_product_page(self, product_id: int) -> Optional[Dict]:
        """
        Fetch product details and image URL from iCheers product page

        Args:
            product_id: iCheers product ID

        Returns:
            Dictionary with product info and image URL
        """
        try:
            url = f"{self.PRODUCT_URL}/{product_id}"
            logger.info(f"Fetching product page: {url}")

            response = self.session.get(url, timeout=10)
            response.raise_for_status()

            # Parse HTML to extract image URL from structured data (JSON-LD)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Look for image URL in multiple places
            image_url = self._extract_image_url(soup)

            if image_url:
                return {
                    'product_id': product_id,
                    'url': url,
                    'image_url': image_url,
                    'status': 'success'
                }
            else:
                logger.warning(f"No image URL found for product {product_id}")
                return {
                    'product_id': product_id,
                    'url': url,
                    'image_url': None,
                    'status': 'no_image_found'
                }

        except Exception as e:
            logger.error(f"Error fetching product {product_id}: {e}")
            return {
                'product_id': product_id,
                'status': 'error',
                'error': str(e)
            }

    def _extract_image_url(self, soup: BeautifulSoup) -> Optional[str]:
        """
        Extract image URL from product page

        Looks for:
        1. Schema.org Product image URL
        2. og:image meta tag
        3. Direct img tags with bottle/product images
        """

        # Try Schema.org JSON-LD first
        json_ld = soup.find('script', {'type': 'application/ld+json'})
        if json_ld:
            try:
                data = json.loads(json_ld.string)
                if 'image' in data:
                    image = data['image']
                    if isinstance(image, list) and image:
                        return image[0]
                    elif isinstance(image, str):
                        return image
            except json.JSONDecodeError:
                pass

        # Try og:image meta tag
        og_image = soup.find('meta', {'property': 'og:image'})
        if og_image and og_image.get('content'):
            return og_image['content']

        # Try direct img tags with 'bottle' or 'product' in src/alt
        for img in soup.find_all('img'):
            src = img.get('src', '')
            alt = img.get('alt', '')
            if 'bottle' in src.lower() or 'bottle' in alt.lower():
                if src.startswith('http'):
                    return src
                else:
                    return urljoin(self.BASE_URL, src)

        return None

    def process_wine_list(self, wine_list: List[Dict]) -> None:
        """
        Process a list of wines and extract their image URLs

        Expected format:
        [
            {'name': 'Chateau Ausone', 'vintage': 2020, 'product_id': 12345},
            {'name': 'OPUS ONE', 'vintage': 2019, 'product_id': 54093},
        ]
        """
        total = len(wine_list)

        for index, wine in enumerate(wine_list, 1):
            logger.info(f"Processing wine {index}/{total}: {wine.get('name')} {wine.get('vintage')}")

            product_id = wine.get('product_id')
            if not product_id:
                logger.warning(f"No product_id for {wine.get('name')} {wine.get('vintage')}")
                self.not_found.append(wine)
                continue

            result = self.fetch_product_page(product_id)
            if result:
                result.update({
                    'wine_name': wine.get('name'),
                    'vintage': wine.get('vintage'),
                    'chinese_name': wine.get('chinese_name', ''),
                })
                self.results.append(result)

            # Be polite to the server - add delay between requests
            time.sleep(1)

    def save_results(self) -> None:
        """Save results to JSON file"""
        output_data = {
            'metadata': {
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'total_processed': len(self.results) + len(self.not_found),
                'successful': len(self.results),
                'not_found': len(self.not_found),
                'source': 'icheers.tw'
            },
            'wines': self.results,
            'not_found': self.not_found
        }

        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        logger.info(f"Results saved to {self.output_file}")
        logger.info(f"Successful: {len(self.results)}, Not found: {len(self.not_found)}")


def load_wine_list_from_csv(csv_file: str) -> List[Dict]:
    """
    Load wine list from CSV file

    Expected columns: wine_name, vintage, product_id, chinese_name
    """
    wines = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            wines.append({
                'name': row.get('wine_name', ''),
                'vintage': int(row.get('vintage', 0)),
                'product_id': row.get('product_id'),
                'chinese_name': row.get('chinese_name', ''),
            })
    return wines


def load_wine_list_from_json(json_file: str) -> List[Dict]:
    """Load wine list from JSON file"""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('wines', [])


def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Scrape wine image URLs from iCheers.tw'
    )
    parser.add_argument(
        '--wine-list',
        required=True,
        help='Path to wine list file (CSV or JSON)'
    )
    parser.add_argument(
        '--output',
        default='icheers_wine_mapping.json',
        help='Output file for results'
    )
    parser.add_argument(
        '--format',
        choices=['csv', 'json'],
        default='json',
        help='Format of wine list file'
    )

    args = parser.parse_args()

    # Load wine list
    wine_list_path = Path(args.wine_list)
    if not wine_list_path.exists():
        logger.error(f"Wine list file not found: {args.wine_list}")
        return

    logger.info(f"Loading wine list from {args.wine_list}")

    if args.format == 'csv':
        wine_list = load_wine_list_from_csv(args.wine_list)
    else:
        wine_list = load_wine_list_from_json(args.wine_list)

    logger.info(f"Loaded {len(wine_list)} wines")

    # Process wines
    scraper = ICheersScraper(output_file=args.output)
    scraper.process_wine_list(wine_list)
    scraper.save_results()


if __name__ == '__main__':
    # TEMPLATE USAGE EXAMPLE:
    #
    # To use this script, provide a wine list like:
    # wines = [
    #     {'name': 'Chateau Ausone', 'vintage': 2005, 'product_id': 2182, 'chinese_name': '歐頌城堡'},
    #     {'name': 'OPUS ONE', 'vintage': 2011, 'product_id': 4974, 'chinese_name': '第一樂章'},
    # ]
    #
    # scraper = ICheersScraper()
    # scraper.process_wine_list(wines)
    # scraper.save_results()

    main()
