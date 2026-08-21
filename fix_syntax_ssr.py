import os

files_to_patch = [
    'src/front-components/contract-dashboard.tsx',
    'src/front-components/opportunity-dashboard.tsx',
    'src/front-components/shipment-dashboard.tsx',
    'src/front-components/leads-dashboard.tsx'
]

# Fix dashboard files
for filename in files_to_patch:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(
        "const urlHighlightId = (typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem('urlHighlightId') : null) || urlParams.get('id')) : urlParams.get('id');",
        "const urlHighlightId = (typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem('urlHighlightId') : null) || urlParams.get('id');"
    )
    content = content.replace(
        "setTimeout(() => (typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.removeItem(\"urlHighlightId\"), 2000);",
        "setTimeout(() => { if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.removeItem('urlHighlightId'); }, 2000);"
    )
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix company-dashboard.tsx
with open('src/front-components/company-dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
    content = content.replace(
        "onClick={() => (typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.setItem(\"urlHighlightId\", c.id)}",
        "onClick={() => { if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.setItem('urlHighlightId', c.id); }}"
    )
    content = content.replace(
        "onClick={() => (typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.setItem(\"urlHighlightId\", o.id)}",
        "onClick={() => { if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.setItem('urlHighlightId', o.id); }}"
    )
    content = content.replace(
        "onClick={() => (typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.setItem(\"urlHighlightId\", l.id)}",
        "onClick={() => { if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.setItem('urlHighlightId', l.id); }}"
    )
    content = content.replace(
        "onClick={() => (typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.setItem(\"urlHighlightId\", s.id)}",
        "onClick={() => { if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.setItem('urlHighlightId', s.id); }}"
    )
    with open('src/front-components/company-dashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

print("Syntax errors fixed.")
