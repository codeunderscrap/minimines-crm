import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
const 04acd819-f079-4dde-b36d-1eb14b47167d_CONST = '04acd819-f079-4dde-b36d-1eb14b47167d';

export default defineField({
  universalIdentifier: 'd9d4368b-a272-42b5-9a71-2bb159535454',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'exportShipments',
  label: 'Exportshipments',
  relationTargetObjectMetadataUniversalIdentifier: 04acd819-f079-4dde-b36d-1eb14b47167d_CONST,
  relationTargetFieldMetadataUniversalIdentifier: '4eff267f-3024-4e77-bd31-72739bad2fa6',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
