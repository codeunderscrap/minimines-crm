import os
import re
import uuid

# Configuration extracted from current code
objects_config = {
    'contract.ts': {
        'old_field_uuid': '0ed7032b-f909-4247-9cd2-9da64e368c16',
        'reverse_uuid': '90744c6d-676e-4830-b6be-4790c0616b70',
        'obj_constant': '651890c3-6208-429c-8e72-3e99adeb480e',
        'obj_name': 'contract'
    },
    'sales-order.ts': {
        'old_field_uuid': '14209faf-2ee2-4830-8713-c562769ed597',
        'reverse_uuid': 'fc53ec71-6649-498e-a9a9-5884cf567a89',
        'obj_constant': '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0',
        'obj_name': 'salesOrder'
    },
    'export-shipment.ts': {
        'old_field_uuid': 'a55042df-d847-4f1d-bdbe-40353cf36d94',
        'reverse_uuid': 'd9d4368b-a272-42b5-9a71-2bb159535454',
        'obj_constant': '04acd819-f079-4dde-b36d-1eb14b47167d',
        'obj_name': 'exportShipment'
    },
    'lead.ts': {
        'old_field_uuid': '3c5dbbb2-5915-4e16-bb7c-61cdab1a628d',
        'reverse_uuid': '1996379b-049c-48e6-a52c-d499e2340381',
        'obj_constant': 'LEAD_OBJECT_UNIVERSAL_IDENTIFIER',
        'obj_name': 'lead'
    },
    'opportunity.ts': {
        'old_field_uuid': 'b2a164c9-b75d-4680-8525-0a19f04ec0e4',
        'reverse_uuid': 'd5c5cf87-47d8-4499-8014-58e4786c2be2',
        'obj_constant': 'OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER',
        'obj_name': 'opportunity'
    },
    'quotation.ts': {
        'old_field_uuid': '79b1cf3d-60df-4cd9-9fa7-9d96922569cb',
        'reverse_uuid': '598c1d70-24e2-494b-8db7-5aa206168270',
        'obj_constant': 'QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER',
        'obj_name': 'quotation'
    },
    'enquiry.ts': {
        'old_field_uuid': 'ENQUIRY_COMPANY_FIELD_UNIVERSAL_IDENTIFIER',
        'reverse_uuid': '784d4df1-90e3-4d20-ae95-a9f911bee366',
        'obj_constant': 'ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER',
        'obj_name': 'enquiry'
    }
}

# 1. Update objects with NEW field UUIDs for company (so they drop the old text fields cleanly)
new_field_uuids = {}
for obj_file, config in objects_config.items():
    new_uuid = str(uuid.uuid4())
    new_field_uuids[obj_file] = new_uuid
    
    path = os.path.join('src/objects', obj_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_id = config['old_field_uuid']
    content = content.replace(f"universalIdentifier: '{old_id}'", f"universalIdentifier: '{new_uuid}'")
    content = content.replace(f"universalIdentifier: {old_id}", f"universalIdentifier: '{new_uuid}'")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {obj_file} with new relation field UUID: {new_uuid}")

# 2. Update views to replace old field UUIDs with new relation field UUIDs
for root, dirs, files in os.walk('src/views'):
    for file in files:
        path = os.path.join(root, file)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        for obj_file, config in objects_config.items():
            old_id = config['old_field_uuid']
            new_id = new_field_uuids[obj_file]
            
            # The old ID might be a variable name (like ENQUIRY_COMPANY_FIELD_UNIVERSAL_IDENTIFIER)
            # which we should replace with the actual string format in views.
            # Usually views just use strings, but let's just replace both.
            content = content.replace(f"'{old_id}'", f"'{new_id}'")
            if old_id.isupper():
                content = content.replace(old_id, f"'{new_id}'")
                
        if content != original_content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated view: {path}")

# 3. Create reverse field definition files in src/fields/
for obj_file, config in objects_config.items():
    reverse_uuid = config['reverse_uuid']
    obj_constant = config['obj_constant']
    obj_name = config['obj_name']
    
    import_obj = ""
    if obj_constant.isupper() and not obj_constant.startswith('0') and not obj_constant.startswith('6'):
        import_obj = f"import {{ {obj_constant} }} from '../constants/universal-identifiers';\n"
    else:
        import_obj = f"const {obj_constant}_CONST = '{obj_constant}';\n"
        obj_constant = f"{obj_constant}_CONST"
    
    field_code = f"""import {{
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
}} from 'twenty-sdk/define';
{import_obj}
export default defineField({{
  universalIdentifier: '{reverse_uuid}',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: '{obj_name}s',
  label: '{obj_name.capitalize()}s',
  relationTargetObjectMetadataUniversalIdentifier: {obj_constant},
  relationTargetFieldMetadataUniversalIdentifier: '{new_field_uuids[obj_file]}',
  universalSettings: {{
    relationType: RelationType.ONE_TO_MANY,
  }},
}});
"""
    field_file = f"src/fields/company-{obj_name}s-relation.field.ts"
    with open(field_file, 'w', encoding='utf-8') as f:
        f.write(field_code)
    print(f"Created reverse field definition: {field_file}")
