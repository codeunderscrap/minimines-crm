import re
with open('src/constants/universal-identifiers.ts', 'r') as f:
    text = f.read()
for m in re.finditer(r'export const ([A-Z_]+_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER)\s*=\s*[\'\"]([^\'\"]+)[\'\"]', text):
    print(m.group(1), m.group(2))
