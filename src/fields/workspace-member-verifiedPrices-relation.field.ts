import { defineField, FieldType, RelationType, STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'c8f7d983-a98d-4e94-b258-7c85db38d810',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  name: 'verifiedPrices',
  label: 'Verified Prices',
  type: FieldType.RELATION,
  relationTargetObjectMetadataUniversalIdentifier: '2c9e421a-e642-4f0e-b7e9-a5c9f55e0941',
  relationTargetFieldMetadataUniversalIdentifier: 'a4e98f41-3b7c-40f4-8d99-52e8250f555c',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
