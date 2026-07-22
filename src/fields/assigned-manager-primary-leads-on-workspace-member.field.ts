import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_PRIMARY_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_ASSIGNED_MANAGER_PRIMARY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineField({
  universalIdentifier: LEAD_ASSIGNED_MANAGER_PRIMARY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedManagerPrimaryLeads',
  label: 'Leads (as Primary Manager)',
  relationTargetObjectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    LEAD_ASSIGNED_MANAGER_PRIMARY_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
