import os

path = 'src/front-components/company-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('href={`/page/a1cd845e-046a-4147-a04f-895290bf6b73?companyId=${selectedCompany.id}`}\n            className="add-btn" style={{ marginTop: \'16px\', justifyContent: \'center\' }}>\n              + Add New Company', 'href="/page/a1cd845e-046a-4147-a04f-895290bf6b73"\n            className="add-btn" style={{ marginTop: \'16px\', justifyContent: \'center\' }}>\n              + Add New Company')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
