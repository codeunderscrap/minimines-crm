import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';
import { QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER, PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineField({
  universalIdentifier: '061767af-9d84-4c58-b3a9-b8b2765aaecb',
  objectUniversalIdentifier: PRODUCT_OBJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'quotations',
  label: 'Quotations',
  relationTargetObjectMetadataUniversalIdentifier: QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: 'c556d792-ff70-42d8-bb93-a85f797d8644',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
