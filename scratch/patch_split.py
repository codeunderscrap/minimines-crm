import sys
path = r'D:\MINIMINES\MINIMINESBDCRM\minimines-crm\node_modules\twenty-sdk\dist\login-BzHQgxeV.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix any messed up regexes first
content = content.replace("filePath:t.replace(/\\\\\\\\/g, '/')", "filePath:t.split('\\\\').join('/')")
content = content.replace("filePath:t.replace(/\\\\/g, '/')", "filePath:t.split('\\\\').join('/')")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied split-join patch")
