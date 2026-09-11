import { defineObject, FieldType } from 'twenty-sdk/define';


export default defineObject({
  nameSingular: 'department',
  namePlural: 'departments',
  labelSingular: 'Department',
  labelPlural: 'Departments',
  universalIdentifier: '2d76ead8-21ea-4c17-bbbb-6f511175ebeb',
  description: 'A department in the HOD -> Manager -> Associate hierarchy (Sales, BD, and any added later).',
  icon: 'IconBuildingSkyscraper',
  labelIdentifierFieldMetadataUniversalIdentifier: '71368bf5-acae-41dc-a367-2d28836a4988',
  fields: [
    {
      universalIdentifier: '71368bf5-acae-41dc-a367-2d28836a4988',
      name: 'name',
      type: FieldType.TEXT,
      label: 'Department Name',
    },
  ],
});
