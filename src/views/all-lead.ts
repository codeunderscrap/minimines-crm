import { defineView, ViewType } from 'twenty-sdk/define';
import { LEAD_ALL_VIEW_UNIVERSAL_IDENTIFIER, LEAD_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineView({
  universalIdentifier: LEAD_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'all-lead',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconList',
});
