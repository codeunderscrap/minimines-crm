import { defineView } from 'twenty-sdk/define';
import { ENQUIRY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER, ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ENQUIRY_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  name: 'enquiry-record-page-fields',
  // Use any to bypass TS error temporarily
  type: 'FIELDS_WIDGET' as any,
  icon: 'IconList',
});
