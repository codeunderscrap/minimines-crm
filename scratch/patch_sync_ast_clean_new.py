import re

path = r'D:\MINIMINES\MINIMINESBDCRM\minimines-crm\node_modules\twenty-sdk\dist\login-BzHQgxeV.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

patch_js = """
const fixPaths = (obj) => {
    if (typeof obj === 'string') return obj.replace(/\\\\/g, '/');
    if (Array.isArray(obj)) return obj.map(fixPaths);
    if (obj !== null && typeof obj === 'object') {
        let res = {};
        for (let k in obj) res[k] = fixPaths(obj[k]);
        return res;
    }
    return obj;
};
e = fixPaths(e);
const sys = ['id', 'createdAt', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy', 'position', 'searchVector'];
const deletedUuids = new Set();
if (e.objects) {
    e.objects.forEach(obj => {
        if (obj.fields) {
            obj.fields = obj.fields.filter(f => {
                if (sys.includes(f.name)) {
                    deletedUuids.add(f.universalIdentifier);
                    return false;
                }
                return true;
            });
        }
    });
}
if (e.fields) {
    e.fields = e.fields.filter(f => {
        if (sys.includes(f.name)) {
            deletedUuids.add(f.universalIdentifier);
            return false;
        }
        return true;
    });
}
const filterIdx = (idxArr) => {
    return idxArr.filter(idx => {
        if (!idx.indexFields) return true;
        const hasDeleted = idx.indexFields.some(f => deletedUuids.has(f.fieldUniversalIdentifier));
        return !hasDeleted;
    });
};
if (e.objects) {
    e.objects.forEach(obj => {
        if (obj.indexes) obj.indexes = filterIdx(obj.indexes);
    });
}
if (e.indexes) {
    e.indexes = filterIdx(e.indexes);
}
if (e.permissionFlags) {
    e.permissionFlags = e.permissionFlags.filter(p => !deletedUuids.has(p.fieldMetadataUniversalIdentifier) && !deletedUuids.has(p.objectMetadataUniversalIdentifier));
}
"""

patch_code = patch_js.replace('\n', '')

content = content.replace('async syncApplication(e,t){try{', 'async syncApplication(e,t){try{' + patch_code)
content = content.replace('applicationUniversalIdentifier:i,filePath:t,fileFolder:l', "applicationUniversalIdentifier:i,filePath:t.replace(/\\\\\\\\/g, '/'),fileFolder:l")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Applied clean JSON AST patch')
