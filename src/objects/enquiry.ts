import {
  defineObject,
  FieldType,
  RelationType,
  OnDeleteAction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';


const WORKSPACE_MEMBER = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember;

export default defineObject({
  universalIdentifier: '60b1d481-b270-4fea-896e-df5d49279735',
  nameSingular: 'enquiry',
  namePlural: 'enquiries',
  labelSingular: 'Enquiry',
  labelPlural: 'Enquiries',
  description: 'Unified communications inbox — all inbound enquiries from any channel.',
  icon: 'IconMessages',
  labelIdentifierFieldMetadataUniversalIdentifier: '3abe2719-b218-4f15-8484-4f1fdef483e6',
  fields: [
    // ── Core identity ────────────────────────────────────────────────────────
    {
      universalIdentifier: '3abe2719-b218-4f15-8484-4f1fdef483e6',
      name: 'customerName',
      type: FieldType.TEXT,
      label: 'Customer Name',
    },
    {
      universalIdentifier: 'c44febc8-c4be-4354-8e0a-d9ac83b01d36',
      name: 'company',
      type: FieldType.RELATION,
      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: '784d4df1-90e3-4d20-ae95-a9f911bee366',
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'companyId',
      },
      label: 'Company / Organization',
    },
    {
      universalIdentifier: 'e1d5b9c3-2a8f-4e7d-a3c9-4b7f1e3d5a8c',
      name: 'contactEmail',
      type: FieldType.EMAILS,
      label: 'Contact Email',
    },
    {
      universalIdentifier: 'c7f3a5e9-4d1b-4b8c-b2f6-5a4c7b1f3d9e',
      name: 'contactPhone',
      type: FieldType.PHONES,
      label: 'Contact Phone',
    },

    // ── Channel & source ────────────────────────────────────────────────────
    {
      universalIdentifier: '3118d664-51b5-4452-a69f-f16014cb2923',
      name: 'source',
      type: FieldType.SELECT,
      label: 'Source',
      options: [
        { label: 'Website', value: 'WEBSITE', position: 0, color: 'blue' },
        { label: 'Email', value: 'EMAIL', position: 1, color: 'gray' },
        { label: 'LinkedIn', value: 'LINKEDIN', position: 2, color: 'sky' },
        { label: 'WhatsApp', value: 'WHATSAPP', position: 3, color: 'turquoise' },
        { label: 'Other', value: 'OTHER', position: 4, color: 'orange' },
      ],
    },
    {
      universalIdentifier: 'd3a9c5f1-4e7b-4d6a-a8c2-9c6b3d1a5f7e',
      name: 'channel',
      type: FieldType.TEXT,
      label: 'Channel Identifier',
      description: 'Internal channel routing key (e.g. website, email, whatsapp). Used for webhook integrations.',
    },
    {
      universalIdentifier: 'e7b1f9d3-5c8a-4b2e-84f6-1d9c5b3f7a2e',
      name: 'externalId',
      type: FieldType.TEXT,
      label: 'External Thread ID',
      description: 'External reference ID for threaded replies (WhatsApp thread ID, email Message-ID, etc.)',
    },

    // ── Message content ─────────────────────────────────────────────────────
    {
      universalIdentifier: 'ee1da41f-ada1-47f9-a1d2-80bb1a2e71f2',
      name: 'message',
      type: FieldType.TEXT,
      label: 'Initial Message',
    },
    // Legacy reply field kept for backward-compatibility
    {
      universalIdentifier: '97527103-743e-42f8-932b-b016a7910518',
      name: 'reply',
      type: FieldType.TEXT,
      label: 'Quick Reply (legacy)',
    },

    // ── Status & workflow ───────────────────────────────────────────────────
    {
      universalIdentifier: '68bd420f-a1a7-43e2-81b1-b3de1e5c5870',
      name: 'status',
      type: FieldType.SELECT,
      label: 'Status',
      options: [
        { label: 'New', value: 'NEW', position: 0, color: 'blue' },
        { label: 'In Progress', value: 'IN_PROGRESS', position: 1, color: 'yellow' },
        { label: 'Waiting Reply', value: 'WAITING_REPLY', position: 2, color: 'orange' },
        { label: 'Resolved', value: 'RESOLVED', position: 3, color: 'green' },
        { label: 'Spam', value: 'SPAM', position: 4, color: 'red' },
        // Legacy value kept so existing records remain valid
        { label: 'Replied (legacy)', value: 'REPLIED', position: 5, color: 'gray' },
        { label: 'Unanswered (legacy)', value: 'UNANSWERED', position: 6, color: 'pink' },
      ],
    },
    {
      universalIdentifier: 'f5c3b7e1-2d9a-4f4c-b6e2-7a8e5f1c9b3d',
      name: 'priority',
      type: FieldType.SELECT,
      label: 'Priority',
      options: [
        { label: 'Low', value: 'LOW', position: 0, color: 'gray' },
        { label: 'Normal', value: 'NORMAL', position: 1, color: 'blue' },
        { label: 'High', value: 'HIGH', position: 2, color: 'orange' },
        { label: 'Urgent', value: 'URGENT', position: 3, color: 'red' },
      ],
    },
    {
      universalIdentifier: 'a1f5e3b7-6c2d-4a9f-91c4-8b3a7f5e1c9d',
      name: 'resolvedAt',
      type: FieldType.DATE_TIME,
      label: 'Resolved At',
    },

    // ── Reverse relation: conversation messages in this thread ──────────────
    {
      universalIdentifier: 'f4b8e2d6-9c1a-4f3b-a7e5-3d6c2b8f4a1e',
      name: 'conversationMessages',
      type: FieldType.RELATION,
      label: 'Conversation Messages',
      relationTargetObjectMetadataUniversalIdentifier: 'e8f2d4a6-1b3c-4f7e-9d5a-2c6b8a4f1e3d',
      relationTargetFieldMetadataUniversalIdentifier: 'a3c7f1b9-5e2d-4a8c-b6f4-7d1e3c9f5a2b',
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },

    // ── Assignment ──────────────────────────────────────────────────────────
    {
      universalIdentifier: 'c4d8a2f6-1b5e-4c7d-b9f3-2e7a4c8d2f1b',
      name: 'assignedTo',
      type: FieldType.RELATION,
      label: 'Assigned To',
      relationTargetObjectMetadataUniversalIdentifier: WORKSPACE_MEMBER.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: 'f9e3d7b1-8c4a-4e5f-a2d8-3a1f9e3b7c4d',
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'assignedToId',
      },
    },
  ],
});
