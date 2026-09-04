import {
  defineObject,
  FieldType,
  RelationType,
  OnDeleteAction,
} from 'twenty-sdk/define';
import { LEAD_OBJECT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

export default defineObject({
  nameSingular: 'interactionLog',
  namePlural: 'interactionLogs',
  labelSingular: 'Interaction Log',
  labelPlural: 'Interaction Logs',
  universalIdentifier: '685d5f57-e14b-4494-b258-005db38d8108',
  description: 'Tracks detailed conversation history (what I said, what they said) with specific contacts on a Lead.',
  icon: 'IconMessageCircle',
  labelIdentifierFieldMetadataUniversalIdentifier: 'a4b2a8c1-1234-4567-89ab-cdef01234567',
  fields: [
    {
      universalIdentifier: 'a4b2a8c1-1234-4567-89ab-cdef01234567',
      name: 'personName',
      type: FieldType.TEXT,
      label: 'Contact Person Name',
      description: 'The specific person you spoke with',
    },
    {
      universalIdentifier: 'b5c3b9d2-2345-5678-90bc-def012345678',
      name: 'lead',
      type: FieldType.RELATION,
      label: 'Related Lead',
      relationTargetObjectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      relationTargetFieldMetadataUniversalIdentifier: 'c6d4cae3-3456-6789-01cd-ef0123456789', // We'll let Twenty auto-generate the reverse field on Lead
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.CASCADE,
        joinColumnName: 'leadId',
      },
    },
    {
      universalIdentifier: 'd7e5dbf4-4567-7890-12de-f0123456789a',
      name: 'interactionDate',
      type: FieldType.DATE_TIME,
      label: 'Date & Time',
    },
    {
      universalIdentifier: 'e8f6ecd5-5678-8901-23ef-0123456789ab',
      name: 'whatISaid',
      type: FieldType.RICH_TEXT,
      label: 'What I Said',
    },
    {
      universalIdentifier: 'f907fde6-6789-9012-34f0-123456789abc',
      name: 'whatTheySaid',
      type: FieldType.RICH_TEXT,
      label: 'What They Said',
    },
  ],
});
