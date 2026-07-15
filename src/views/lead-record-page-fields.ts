import { defineView } from 'twenty-sdk/define';
import { LEAD_FIELDS_VIEW_UNIVERSAL_IDENTIFIER, LEAD_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineView({
  universalIdentifier: LEAD_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'lead-record-page-fields',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: 'FIELDS_WIDGET' as any,
  icon: 'IconList',
});
