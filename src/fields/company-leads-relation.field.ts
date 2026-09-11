import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: '1996379b-049c-48e6-a52c-d499e2340381',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'leads',
  label: 'Leads',
  relationTargetObjectMetadataUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
  relationTargetFieldMetadataUniversalIdentifier: 'ee73f5f3-3aa8-4a21-a8c6-1796e7eb1d43',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
