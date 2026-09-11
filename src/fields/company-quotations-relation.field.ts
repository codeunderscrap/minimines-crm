import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: '598c1d70-24e2-494b-8db7-5aa206168270',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'quotations',
  label: 'Quotations',
  relationTargetObjectMetadataUniversalIdentifier: '71ba2bb5-f601-40b0-ba63-3dab06028c57',
  relationTargetFieldMetadataUniversalIdentifier: '4399ed12-2c2e-4f33-8ff6-d7bc99bc704b',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
