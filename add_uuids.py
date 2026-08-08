import uuid

path = 'src/constants/universal-identifiers.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

uuids = {
  'COMPANY_DASHBOARD_FRONT_COMPONENT': str(uuid.uuid4()),
  'COMPANY_DASHBOARD_PAGE_LAYOUT': str(uuid.uuid4()),
  'COMPANY_DASHBOARD_PAGE_LAYOUT_TAB': str(uuid.uuid4()),
  'COMPANY_DASHBOARD_PAGE_WIDGET': str(uuid.uuid4()),
  'COMPANY_DASHBOARD_NAVIGATION_MENU_ITEM': str(uuid.uuid4()),
}

append_text = '\n// Company Master Dashboard UUIDs\n'
for key, value in uuids.items():
    append_text += 'export const ' + key + '_UNIVERSAL_IDENTIFIER = \'' + value + '\';\n'

content += append_text
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Appended Company Dashboard UUIDs.')
