import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: '784d4df1-90e3-4d20-ae95-a9f911bee366',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'enquirys',
  label: 'Enquirys',
  relationTargetObjectMetadataUniversalIdentifier: '60b1d481-b270-4fea-896e-df5d49279735',
  relationTargetFieldMetadataUniversalIdentifier: 'c44febc8-c4be-4354-8e0a-d9ac83b01d36',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
