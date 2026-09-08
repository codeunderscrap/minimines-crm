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
  labelIdentifierFieldMetadataUniversalIdentifier: 'fa449233-be57-4588-8e0e-d28b690dcde7',
  fields: [
    {
      universalIdentifier: 'fa449233-be57-4588-8e0e-d28b690dcde7',
      name: 'logName',
      type: FieldType.TEXT,
      label: 'Log Name',
      description: 'Title or person associated with this log',
    },
    {
      universalIdentifier: '9509ce7e-f644-4f2c-b013-6b99ce51ebbe',
      name: 'lead',
      type: FieldType.RELATION,
      label: 'Related Lead',
      relationTargetObjectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      relationTargetFieldMetadataUniversalIdentifier: '30fd6c9d-55df-441d-b8b5-1a338baa2ba2', // We'll let Twenty auto-generate the reverse field on Lead
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.CASCADE,
        joinColumnName: 'leadId',
      },
    },
    {
      universalIdentifier: '2dd098a5-cb3d-4453-a300-44294ac5f77d',
      name: 'interactionDate',
      type: FieldType.DATE_TIME,
      label: 'Date & Time',
    },
    {
      universalIdentifier: 'adf38c0b-10cc-4f0f-9c4a-4318c112f6a8',
      name: 'notes',
      type: FieldType.RICH_TEXT,
      label: 'Notes',
    },
  ],
});
