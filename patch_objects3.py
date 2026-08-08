import os
import uuid
import re

directory = 'src/objects/'
files = ['contract.ts', 'sales-order.ts', 'export-shipment.ts']

def ensure_imports(content):
    imports_to_add = ['RelationType', 'OnDeleteAction', 'STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS']
    if 'twenty-sdk/define' in content:
        for imp in imports_to_add:
            if imp not in content:
                content = re.sub(r"(import\s*{[^\}]+)(}\s*from\s*'twenty-sdk/define';)", r"\1, " + imp + r" \2", content)
    return content

for file in files:
    path = os.path.join(directory, file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = ensure_imports(content)
    
    if 'company' not in content:
        reverse_uuid = str(uuid.uuid4())
        field_uuid = str(uuid.uuid4())
        
        field_code = (
            "    {\n"
            "      universalIdentifier: '" + field_uuid + "',\n"
            "      name: 'company',\n"
            "      type: FieldType.RELATION,\n"
            "      label: 'Company',\n"
            "      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,\n"
            "      relationTargetFieldMetadataUniversalIdentifier: '" + reverse_uuid + "',\n"
            "      universalSettings: {\n"
            "        relationType: RelationType.MANY_TO_ONE,\n"
            "        onDelete: OnDeleteAction.SET_NULL,\n"
            "        joinColumnName: 'companyId',\n"
            "      },\n"
            "    },\n"
        )
        
        # Insert before the last closing bracket of fields array
        content = content.replace('  ]\n});', field_code + '  ]\n});')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Added company relation to ' + file)
