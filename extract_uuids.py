import os
import re

files = ['contract.ts', 'sales-order.ts', 'export-shipment.ts', 'lead.ts', 'opportunity.ts', 'quotation.ts', 'enquiry.ts']
for file in files:
    path = os.path.join('src/objects', file)
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We look for name: 'company' (or companyName, buyerCompanyId) and its universalIdentifier and reverse
    pattern = r"universalIdentifier:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"](?:company|companyName|buyerCompanyId)['\"],\s*type:\s*FieldType\.RELATION,[\s\S]*?relationTargetFieldMetadataUniversalIdentifier:\s*['\"]([^'\"]+)['\"]"
    match = re.search(pattern, content)
    if match:
        field_uuid = match.group(1)
        reverse_uuid = match.group(2)
        print(f'{file}: field={field_uuid}, reverse={reverse_uuid}')
    else:
        # Check if it uses a constant
        pattern2 = r"universalIdentifier:\s*([A-Z_]+),\s*name:\s*['\"](?:company|companyName|buyerCompanyId)['\"],\s*type:\s*FieldType\.RELATION,[\s\S]*?relationTargetFieldMetadataUniversalIdentifier:\s*['\"]([^'\"]+)['\"]"
        match2 = re.search(pattern2, content)
        if match2:
            print(f'{file}: field_constant={match2.group(1)}, reverse={match2.group(2)}')
