import os

# Update company-dashboard.tsx to set sessionStorage
path = 'src/front-components/company-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<a href={`/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${c.id}&companyId=${selectedCompany.id}`} className="action-btn action-btn-outline">View</a>',
    '<a href={`/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${c.id}&companyId=${selectedCompany.id}`} onClick={() => sessionStorage.setItem("urlHighlightId", c.id)} className="action-btn action-btn-outline">View</a>'
)
content = content.replace(
    '<a href={`/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${o.id}&companyId=${selectedCompany.id}`} className="action-btn action-btn-outline">View</a>',
    '<a href={`/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${o.id}&companyId=${selectedCompany.id}`} onClick={() => sessionStorage.setItem("urlHighlightId", o.id)} className="action-btn action-btn-outline">View</a>'
)
content = content.replace(
    '<a href={`/page/32584c0d-ff5b-43c8-a672-802f0dcd44d4?id=${l.id}&companyId=${selectedCompany.id}`} className="action-btn action-btn-outline">View</a>',
    '<a href={`/page/32584c0d-ff5b-43c8-a672-802f0dcd44d4?id=${l.id}&companyId=${selectedCompany.id}`} onClick={() => sessionStorage.setItem("urlHighlightId", l.id)} className="action-btn action-btn-outline">View</a>'
)
content = content.replace(
    '<a href={`/page/1bfd5bef-628e-4e93-a506-480773026866?id=${s.id}&companyId=${selectedCompany.id}`} className="action-btn action-btn-outline">View</a>',
    '<a href={`/page/1bfd5bef-628e-4e93-a506-480773026866?id=${s.id}&companyId=${selectedCompany.id}`} onClick={() => sessionStorage.setItem("urlHighlightId", s.id)} className="action-btn action-btn-outline">View</a>'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update dashboards to read from sessionStorage
files = ['leads-dashboard.tsx', 'contract-dashboard.tsx', 'opportunity-dashboard.tsx', 'shipment-dashboard.tsx']
for filename in files:
    path = f'src/front-components/{filename}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace URLSearchParams extraction
    old_extract = "const urlHighlightId = urlParams.get('id');"
    new_extract = "const urlHighlightId = typeof window !== 'undefined' ? (sessionStorage.getItem('urlHighlightId') || urlParams.get('id')) : null;"
    content = content.replace(old_extract, new_extract)

    # Inject cleanup in useEffect
    if "setTimeout(() => sessionStorage.removeItem('urlHighlightId'), 2000);" not in content:
        content = content.replace('useEffect(() => { loadData(); }, []);', 'useEffect(() => { loadData(); setTimeout(() => sessionStorage.removeItem("urlHighlightId"), 2000); }, []);')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

