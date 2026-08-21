import os
import re

files_to_patch = [
    'src/front-components/contract-dashboard.tsx',
    'src/front-components/opportunity-dashboard.tsx',
    'src/front-components/shipment-dashboard.tsx',
    'src/front-components/leads-dashboard.tsx',
    'src/front-components/company-dashboard.tsx'
]

def safe_replace(content):
    # 1. Replace sessionStorage access
    content = content.replace("typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('urlHighlightId')", "(typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem('urlHighlightId') : null)")
    content = content.replace("typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('urlHighlightId')", "(typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem('urlHighlightId') : null)")
    content = content.replace("sessionStorage.removeItem(", "(typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.removeItem(")
    content = content.replace("sessionStorage.setItem(", "(typeof window !== 'undefined' && window.sessionStorage && window.sessionStorage.setItem(")
    
    # 2. Fix remaining window.location.search
    content = content.replace("new URLSearchParams(window.location.search)", "new URLSearchParams(typeof window !== 'undefined' && window.location ? window.location.search : '')")
    
    return content

for filename in files_to_patch:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = safe_replace(content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Patched SSR bugs.")
