import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { LEAD_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineField({
  universalIdentifier: '1996379b-049c-48e6-a52c-d499e2340381',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'leads',
  label: 'Leads',
  relationTargetObjectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: 'ee73f5f3-3aa8-4a21-a8c6-1796e7eb1d43',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
