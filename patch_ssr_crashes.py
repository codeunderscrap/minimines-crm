import os

files_to_patch = [
    'src/front-components/contract-dashboard.tsx',
    'src/front-components/opportunity-dashboard.tsx',
    'src/front-components/shipment-dashboard.tsx',
    'src/front-components/leads-dashboard.tsx'
]

old_str = "const urlParams = new URLSearchParams(window.location.search);\n  const urlHighlightId = typeof window !== 'undefined' ? (sessionStorage.getItem('urlHighlightId') || urlParams.get('id')) : null;"
new_str = "const searchStr = typeof window !== 'undefined' && window.location ? window.location.search : '';\n  const urlParams = new URLSearchParams(searchStr);\n  const urlHighlightId = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('urlHighlightId') || urlParams.get('id')) : urlParams.get('id');"

for filename in files_to_patch:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # It might have varying spacing, let's do more robust replacement
    if old_str in content:
        content = content.replace(old_str, new_str)
    else:
        # manual replace
        content = content.replace("const urlParams = new URLSearchParams(window.location.search);", "const searchStr = typeof window !== 'undefined' && window.location ? window.location.search : '';\n  const urlParams = new URLSearchParams(searchStr);")
        content = content.replace("const urlHighlightId = typeof window !== 'undefined' ? (sessionStorage.getItem('urlHighlightId') || urlParams.get('id')) : null;", "const urlHighlightId = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('urlHighlightId') || urlParams.get('id')) : urlParams.get('id');")
        # specific to leads-dashboard which has URLSearchParams inside visibleLeads
        content = content.replace("const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');", "const params = new URLSearchParams(typeof window !== 'undefined' && window.location ? window.location.search : '');")

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
