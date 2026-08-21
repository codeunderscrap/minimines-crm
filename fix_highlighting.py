import os
import re

def fix_highlighting(filename, item_var):
    path = f'src/front-components/{filename}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add highlightId at the top of the component
    if 'const urlHighlightId = ' not in content:
        # Find the start of the component, usually after `const ... = () => {`
        # Let's just put it right before `useEffect(() => { loadData(); }, []);`
        content = content.replace('useEffect(() => { loadData(); }, []);', 
            "const urlParams = new URLSearchParams(window.location.search);\n  const urlHighlightId = urlParams.get('id');\n\n  useEffect(() => { loadData(); }, []);")

    # 2. Modify the row styling
    if filename == 'leads-dashboard.tsx':
        content = content.replace(
            "backgroundColor: isSelected ? 'rgba(59, 110, 147, 0.05)' : 'transparent',",
            f"backgroundColor: (isSelected || {item_var}.id === urlHighlightId) ? '#F0F8FF' : 'transparent',\n                  borderLeft: (isSelected || {item_var}.id === urlHighlightId) ? '4px solid #1E507B' : '4px solid transparent',"
        )
    elif filename == 'contract-dashboard.tsx' or filename == 'shipment-dashboard.tsx':
        content = content.replace(
            "backgroundColor: isSelected ? '#EBF5FF' : 'transparent',",
            f"backgroundColor: (isSelected || {item_var}.id === urlHighlightId) ? '#F0F8FF' : 'transparent',"
        )
        content = content.replace(
            "borderLeft: isSelected ? `3px solid ${BRAND.accent}` : '3px solid transparent',",
            f"borderLeft: (isSelected || {item_var}.id === urlHighlightId) ? '4px solid #1E507B' : '4px solid transparent',"
        )
    elif filename == 'opportunity-dashboard.tsx':
        # Need to find the backgroundColor line in opportunity-dashboard.tsx
        # Let's replace 'display: 'grid', gridTemplateColumns: gridCols,' with the added styles
        content = content.replace(
            "display: 'grid',\n                      gridTemplateColumns: gridCols,",
            f"display: 'grid',\n                      gridTemplateColumns: gridCols,\n                      backgroundColor: {item_var}.id === urlHighlightId ? '#F0F8FF' : 'transparent',\n                      borderLeft: {item_var}.id === urlHighlightId ? '4px solid #1E507B' : '4px solid transparent',"
        )
        content = content.replace(
            "display: 'grid', gridTemplateColumns: gridCols,",
            f"display: 'grid', gridTemplateColumns: gridCols,\n                      backgroundColor: {item_var}.id === urlHighlightId ? '#F0F8FF' : 'transparent',\n                      borderLeft: {item_var}.id === urlHighlightId ? '4px solid #1E507B' : '4px solid transparent',"
        )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_highlighting('leads-dashboard.tsx', 'lead')
fix_highlighting('contract-dashboard.tsx', 'c')
fix_highlighting('shipment-dashboard.tsx', 's')
fix_highlighting('opportunity-dashboard.tsx', 'opp')
