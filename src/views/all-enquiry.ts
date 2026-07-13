import { defineView, ViewType } from 'twenty-sdk/define';
import { ENQUIRY_ALL_VIEW_UNIVERSAL_IDENTIFIER, ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: ENQUIRY_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  name: 'all-enquiry',
  type: ViewType.TABLE,
  icon: 'IconList',
});
