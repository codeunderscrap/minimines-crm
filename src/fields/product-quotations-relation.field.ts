import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: '061767af-9d84-4c58-b3a9-b8b2765aaecb',
  objectUniversalIdentifier: '89f006c5-0854-488a-9a8c-750974c8a222',
  type: FieldType.RELATION,
  name: 'quotations',
  label: 'Quotations',
  relationTargetObjectMetadataUniversalIdentifier: '71ba2bb5-f601-40b0-ba63-3dab06028c57',
  relationTargetFieldMetadataUniversalIdentifier: 'c556d792-ff70-42d8-bb93-a85f797d8644',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
