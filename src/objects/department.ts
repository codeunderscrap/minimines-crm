import { defineObject, FieldType } from 'twenty-sdk/define';
import {
  DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  DEPARTMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineObject({
  nameSingular: 'department',
  namePlural: 'departments',
  labelSingular: 'Department',
  labelPlural: 'Departments',
  universalIdentifier: DEPARTMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  description: 'A department in the HOD -> Manager -> Associate hierarchy (Sales, BD, and any added later).',
  icon: 'IconBuildingSkyscraper',
  labelIdentifierFieldMetadataUniversalIdentifier: DEPARTMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: DEPARTMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'name',
      type: FieldType.TEXT,
      label: 'Department Name',
    },
  ],
});
