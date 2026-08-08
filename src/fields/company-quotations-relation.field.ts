import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineField({
  universalIdentifier: '598c1d70-24e2-494b-8db7-5aa206168270',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'quotations',
  label: 'Quotations',
  relationTargetObjectMetadataUniversalIdentifier: QUOTATION_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: '4399ed12-2c2e-4f33-8ff6-d7bc99bc704b',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
