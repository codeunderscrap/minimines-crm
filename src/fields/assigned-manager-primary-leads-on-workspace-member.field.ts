import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


export default defineField({
  universalIdentifier: '76717513-7efa-4f96-bf5d-c532cb0397e8',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedManagerPrimaryLeads',
  label: 'Leads (as Primary Manager)',
  relationTargetObjectMetadataUniversalIdentifier: '0e354212-7b75-46d7-ba6e-cdb07c970645',
  relationTargetFieldMetadataUniversalIdentifier:
    'f64b6578-3781-48af-a80a-2109d738f07a',
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
