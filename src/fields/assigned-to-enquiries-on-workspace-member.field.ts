import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  ENQUIRY_ASSIGNED_TO_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_ASSIGNED_TO_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

// Reverse ONE_TO_MANY side of Enquiry.assignedTo → WorkspaceMember
export default defineField({
  universalIdentifier: ENQUIRY_ASSIGNED_TO_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedEnquiries',
  label: 'Assigned Enquiries',
  relationTargetObjectMetadataUniversalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    ENQUIRY_ASSIGNED_TO_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
