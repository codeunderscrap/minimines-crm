import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: 'c22b7361-17b5-4bce-a4dd-b1461f803e53',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedManagerSecondaryLeads',
  label: 'Leads (as Secondary Manager)',
  relationTargetObjectMetadataUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
  relationTargetFieldMetadataUniversalIdentifier:
    '297abbb4-fbea-4725-a31c-56d353f2ad06',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
