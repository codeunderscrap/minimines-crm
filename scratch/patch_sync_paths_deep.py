import sys

path = 'D:/MINIMINES/MINIMINESBDCRM/minimines-crm/node_modules/twenty-sdk/dist/login-BzHQgxeV.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = "async syncApplication(e,t){try{"
patch = """
    let deepReplace = (obj) => {
        if (typeof obj === 'string') return obj.replace(/\\\\/g, '/');
        if (Array.isArray(obj)) return obj.map(deepReplace);
        if (typeof obj === 'object' && obj !== null) {
            for (let k in obj) obj[k] = deepReplace(obj[k]);
        }
        return obj;
    };
    e = deepReplace(JSON.parse(JSON.stringify(e)));
"""
patch = patch.replace('\n', '')

if "deepReplace(JSON.parse" not in content:
    content = content.replace(target, target + patch)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Applied DEEP Windows path patch")
else:
    print("DEEP Patch already applied")
