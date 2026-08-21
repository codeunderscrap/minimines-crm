import os

path = 'src/front-components/company-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${c.id}', '/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${c.id}&companyId=${selectedCompany.id}')
content = content.replace('/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${o.id}', '/page/a1cd845e-046a-4147-a04f-895290bf6b73?id=${o.id}&companyId=${selectedCompany.id}')
content = content.replace('/page/32584c0d-ff5b-43c8-a672-802f0dcd44d4?id=${l.id}', '/page/32584c0d-ff5b-43c8-a672-802f0dcd44d4?id=${l.id}&companyId=${selectedCompany.id}')
content = content.replace('/page/1bfd5bef-628e-4e93-a506-480773026866?id=${s.id}', '/page/1bfd5bef-628e-4e93-a506-480773026866?id=${s.id}&companyId=${selectedCompany.id}')

content = content.replace('href="/page/a1cd845e-046a-4147-a04f-895290bf6b73"', 'href={`/page/a1cd845e-046a-4147-a04f-895290bf6b73?companyId=${selectedCompany.id}`}')
content = content.replace('href="/page/32584c0d-ff5b-43c8-a672-802f0dcd44d4"', 'href={`/page/32584c0d-ff5b-43c8-a672-802f0dcd44d4?companyId=${selectedCompany.id}`}')
content = content.replace('href="/page/1bfd5bef-628e-4e93-a506-480773026866"', 'href={`/page/1bfd5bef-628e-4e93-a506-480773026866?companyId=${selectedCompany.id}`}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
