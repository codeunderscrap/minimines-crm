import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: '1ebe0014-a739-4d65-9dfb-2d2ec166d1b7',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedAssociateLeads',
  label: 'Leads (as Associate)',
  relationTargetObjectMetadataUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
  relationTargetFieldMetadataUniversalIdentifier:
    '299a8c6a-4e53-44c0-87b0-e9115cce7ec2',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
