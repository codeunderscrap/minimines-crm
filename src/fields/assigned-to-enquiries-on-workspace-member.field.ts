import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


// Reverse ONE_TO_MANY side of Enquiry.assignedTo → WorkspaceMember
export default defineField({
  universalIdentifier: 'f9e3d7b1-8c4a-4e5f-a2d8-3a1f9e3b7c4d',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedEnquiries',
  label: 'Assigned Enquiries',
  relationTargetObjectMetadataUniversalIdentifier: '60b1d481-b270-4fea-896e-df5d49279735',
  relationTargetFieldMetadataUniversalIdentifier:
    'c4d8a2f6-1b5e-4c7d-b9f3-2e7a4c8d2f1b',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
