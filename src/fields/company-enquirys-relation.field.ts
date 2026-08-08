import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import { ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineField({
  universalIdentifier: '784d4df1-90e3-4d20-ae95-a9f911bee366',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'enquirys',
  label: 'Enquirys',
  relationTargetObjectMetadataUniversalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: 'c44febc8-c4be-4354-8e0a-d9ac83b01d36',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
