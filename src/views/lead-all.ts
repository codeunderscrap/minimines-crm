import { defineView, ViewType } from 'twenty-sdk/define';
import {
  LEAD_ALL_VIEW_UNIVERSAL_IDENTIFIER,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineView({
  universalIdentifier: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  name: 'All Leads',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  position: 0,
  isCompact: false,
  fields: [],
  filters: [],
  sorts: [],
});
