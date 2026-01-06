import json

def clean_data(input_file, output_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        cleaned_data = {}
        
        for category, items in data.items():
            cleaned_items = []
            for item in items:
                # Check stock_quantity
                stock = item.get('stock_quantity', 0)
                try:
                    stock_val = float(stock)
                except (ValueError, TypeError):
                    stock_val = 0
                
                # Check cost_price (assuming we want to keep items if cost_price is present, based on user request "or cost_price is empty")
                # Re-reading user request: "if the stock_quantity is empty or stock_quantity is 0 or cost_price is empty, remove from the lis"
                # So if ANY of these are true, remove it.
                
                cost = item.get('cost_price', '')
                
                if stock_val > 0 and cost != "":
                    cleaned_items.append(item)
            
            cleaned_data[category] = cleaned_items
            print(f"Category '{category}': {len(items)} -> {len(cleaned_items)} items")

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cleaned_data, f, ensure_ascii=False, indent=4)
        print(f"Successfully cleaned data. Saved to {output_file}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    clean_data('sevenStock_final.json', 'sevenStock_final.json')
