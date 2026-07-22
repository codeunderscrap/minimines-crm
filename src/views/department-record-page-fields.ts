import { defineView } from 'twenty-sdk/define';
import {
  DEPARTMENT_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: DEPARTMENT_FIELDS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'department-record-page-fields',
  objectUniversalIdentifier: DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  icon: 'IconList',
  position: 0,
  fields: [],
});
