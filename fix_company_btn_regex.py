import os
import re

path = 'src/front-components/company-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Use regex to find and replace the Add New Company button href
content = re.sub(r'href=\{`/page/[^`]+companyId=\$\{selectedCompany\.id\}`\}\s+className="add-btn"\s+style=\{\{ marginTop: \'16px\', justifyContent: \'center\' \}\}\>\s+\+ Add New Company', r'href="/page/a1cd845e-046a-4147-a04f-895290bf6b73"\n            className="add-btn" style={{ marginTop: \'16px\', justifyContent: \'center\' }}>\n              + Add New Company', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
