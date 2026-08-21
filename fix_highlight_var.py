import os

files = ['contract-dashboard.tsx', 'opportunity-dashboard.tsx', 'shipment-dashboard.tsx']
for filename in files:
    path = f'src/front-components/{filename}'
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'const urlHighlightId = ' not in content:
            content = content.replace('  const loadData = async () => {', 
                "  const urlParams = new URLSearchParams(window.location.search);\n  const urlHighlightId = urlParams.get('id');\n\n  const loadData = async () => {")
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
    except Exception as e:
        print(e)
