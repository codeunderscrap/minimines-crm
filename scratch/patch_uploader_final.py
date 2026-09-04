import re

path = r'D:\MINIMINES\MINIMINESBDCRM\minimines-crm\node_modules\twenty-sdk\dist\login-BzHQgxeV.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The file uploader snippet in the new sdk is:
# applicationUniversalIdentifier:i,filePath:n,fileFolder:l
old_str = "applicationUniversalIdentifier:i,filePath:n,fileFolder:l"
new_str = "applicationUniversalIdentifier:i,filePath:n.split('\\\\').join('/'),fileFolder:l"

if old_str in content:
    content = content.replace(old_str, new_str)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched filePath in uploader successfully!")
else:
    print("Could not find the target string!")
