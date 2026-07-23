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
  labelIdentifierFieldMetadataUniversalIdentifier: 'ac5f1b0e-f24c-4854-a252-e0500b0055ed',
  fields: [
    // ── Core identity ────────────────────────────────────────────────────────
    {
      universalIdentifier: 'ac5f1b0e-f24c-4854-a252-e0500b0055ed',
      name: 'customerName',
      type: FieldType.TEXT,
      label: 'Customer Name',
    },
    {
      universalIdentifier: ENQUIRY_COMPANY_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'company',
      type: FieldType.TEXT,
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
      universalIdentifier: 'adfc8bf4-f23a-4b50-9fcc-ed7a9ecd2f30',
      name: 'source',
      type: FieldType.SELECT,
      label: 'Source',
      options: [
        { label: 'Website', value: 'WEBSITE', position: 0, color: 'blue' },
        { label: 'Email', value: 'EMAIL', position: 1, color: 'gray' },
        { label: 'LinkedIn', value: 'LINKEDIN', position: 2, color: 'sky' },
        { label: 'Phone', value: 'PHONE', position: 3, color: 'green' },
        { label: 'WhatsApp', value: 'WHATSAPP', position: 4, color: 'turquoise' },
        { label: 'Other', value: 'OTHER', position: 5, color: 'orange' },
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
      universalIdentifier: '0f3efbf2-5b84-4792-adfa-835f7c4dcbeb',
      name: 'message',
      type: FieldType.TEXT,
      label: 'Initial Message',
    },
    // Legacy reply field kept for backward-compatibility
    {
      universalIdentifier: 'cd6bbdbc-34cd-4e9c-bd3a-c98c367cf802',
      name: 'reply',
      type: FieldType.TEXT,
      label: 'Quick Reply (legacy)',
    },

    // ── Status & workflow ───────────────────────────────────────────────────
    {
      universalIdentifier: 'a0bcd20d-7208-4084-8da1-9dc47a1b95f5',
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
