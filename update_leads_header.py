import os
import re

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I need to add `{getMemberName(currentUserId)} - ` to the start of the title, or change the header section.
old_header = """            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
                    {title}
                  </h1>"""

new_header = """            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', color: BRAND.textMid, marginBottom: '4px', fontWeight: 600 }}>
                  Welcome, {getMemberName(currentUserId) || 'Team Member'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
                    {title}
                  </h1>"""

if old_header in content:
    content = content.replace(old_header, new_header)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated Leads Dashboard UI with user name")
else:
    print("Failed to find header block")
