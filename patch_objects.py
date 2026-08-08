import os
import re
import uuid

directory = 'src/objects/'
files = ['lead.ts', 'opportunity.ts', 'quotation.ts', 'contract.ts', 'sales-order.ts', 'export-shipment.ts', 'enquiry.ts']

def ensure_imports(content):
    imports_to_add = ['RelationType', 'OnDeleteAction', 'STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS']
    if 'twenty-sdk/define' in content:
        for imp in imports_to_add:
            if imp not in content:
                content = re.sub(r\"(import\s*{[^\}]+)(}\s*from\s*'twenty-sdk/define';)\", r\"\1, \" + imp + r\" \2\", content)
    return content

for file in files:
    path = os.path.join(directory, file)
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = ensure_imports(content)
    
    # We want to replace the field definition for company, companyName, or buyerCompanyId
    # Example to match: name: 'company',\\s*type: FieldType.TEXT,
    
    field_names = ['company', 'companyName', 'buyerCompanyId', 'buyerName']
    
    for fname in field_names:
        pattern = r\"(name:\s*'\" + fname + r\"',\s*type:\s*FieldType\.TEXT,)\"
        
        reverse_uuid = str(uuid.uuid4())
        join_col = fname if fname.endswith('Id') else fname + 'Id'
        
        replacement = (
            r\"name: '\" + fname + r\"',\n\"
            r\"      type: FieldType.RELATION,\n\"
            r\"      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,\n\"
            r\"      relationTargetFieldMetadataUniversalIdentifier: '\" + reverse_uuid + r\"',\n\"
            r\"      universalSettings: {\n\"
            r\"        relationType: RelationType.MANY_TO_ONE,\n\"
            r\"        onDelete: OnDeleteAction.SET_NULL,\n\"
            r\"        joinColumnName: '\" + join_col + r\"',\n\"
            r\"      },\"
        )
        
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            break

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Patched ' + file)
