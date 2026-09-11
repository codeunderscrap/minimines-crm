import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: 'd5c5cf87-47d8-4499-8014-58e4786c2be2',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'opportunitys',
  label: 'Opportunitys',
  relationTargetObjectMetadataUniversalIdentifier: 'eb3a7200-27aa-42d9-9271-24b70ff8a255',
  relationTargetFieldMetadataUniversalIdentifier: '5f504f3e-8e13-4009-a753-52a9028158bd',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
