import {
  defineObject,
  FieldType,
  RelationType,
  OnDeleteAction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';
import {
  ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  ENQUIRY_CONTACT_EMAIL_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_CONTACT_PHONE_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_PRIORITY_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_RESOLVED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_CHANNEL_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_ASSIGNED_TO_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_ASSIGNED_TO_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_ENQUIRY_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_ENQUIRY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const WORKSPACE_MEMBER = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember;

export default defineObject({
  universalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
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
      universalIdentifier: ENQUIRY_CONTACT_EMAIL_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'contactEmail',
      type: FieldType.EMAILS,
      label: 'Contact Email',
    },
    {
      universalIdentifier: ENQUIRY_CONTACT_PHONE_FIELD_UNIVERSAL_IDENTIFIER,
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
      universalIdentifier: ENQUIRY_CHANNEL_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'channel',
      type: FieldType.TEXT,
      label: 'Channel Identifier',
      description: 'Internal channel routing key (e.g. website, email, whatsapp). Used for webhook integrations.',
    },
    {
      universalIdentifier: ENQUIRY_EXTERNAL_ID_FIELD_UNIVERSAL_IDENTIFIER,
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
      universalIdentifier: ENQUIRY_PRIORITY_FIELD_UNIVERSAL_IDENTIFIER,
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
      universalIdentifier: ENQUIRY_RESOLVED_AT_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'resolvedAt',
      type: FieldType.DATE_TIME,
      label: 'Resolved At',
    },

    // ── Reverse relation: conversation messages in this thread ──────────────
    {
      universalIdentifier: CONVERSATION_MESSAGE_ENQUIRY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'conversationMessages',
      type: FieldType.RELATION,
      label: 'Conversation Messages',
      relationTargetObjectMetadataUniversalIdentifier: CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
      relationTargetFieldMetadataUniversalIdentifier: CONVERSATION_MESSAGE_ENQUIRY_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.ONE_TO_MANY,
      },
    },

    // ── Assignment ──────────────────────────────────────────────────────────
    {
      universalIdentifier: ENQUIRY_ASSIGNED_TO_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'assignedTo',
      type: FieldType.RELATION,
      label: 'Assigned To',
      relationTargetObjectMetadataUniversalIdentifier: WORKSPACE_MEMBER.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: ENQUIRY_ASSIGNED_TO_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'assignedToId',
      },
    },
  ],
});
