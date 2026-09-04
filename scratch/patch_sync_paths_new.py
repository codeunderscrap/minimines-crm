import sys

path = 'D:/MINIMINES/MINIMINESBDCRM/minimines-crm/node_modules/twenty-sdk/dist/login-BzHQgxeV.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = "async syncApplication(e,t){try{"
patch = "let m = JSON.parse(JSON.stringify(e));if (m.frontComponents) {    m.frontComponents.forEach(fc => {        if (fc.path) fc.path = fc.path.replace(/\\\\\\\\/g, '/');    });}e = m;"

if patch not in content:
    content = content.replace(target, target + patch)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Applied Windows path patch")
else:
    print("Patch already applied")
