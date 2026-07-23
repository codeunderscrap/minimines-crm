import {
  defineObject,
  FieldType,
  RelationType,
  OnDeleteAction,
} from 'twenty-sdk/define';
import {
  CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_BODY_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_ENQUIRY_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_ENQUIRY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_DIRECTION_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_SENDER_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_SENDER_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_CHANNEL_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
  CONVERSATION_MESSAGE_IS_READ_FIELD_UNIVERSAL_IDENTIFIER,
  ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineObject({
  universalIdentifier: CONVERSATION_MESSAGE_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'conversationMessage',
  namePlural: 'conversationMessages',
  labelSingular: 'Conversation Message',
  labelPlural: 'Conversation Messages',
  description: 'Individual messages within an enquiry conversation thread. Stores the full chat history between customers and the MiniMines team.',
  icon: 'IconMessage',
  labelIdentifierFieldMetadataUniversalIdentifier: CONVERSATION_MESSAGE_BODY_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    // ── Content ─────────────────────────────────────────────────────────────
    {
      universalIdentifier: CONVERSATION_MESSAGE_BODY_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'body',
      type: FieldType.TEXT,
      label: 'Message Body',
    },

    // ── Direction & sender ──────────────────────────────────────────────────
    {
      universalIdentifier: CONVERSATION_MESSAGE_DIRECTION_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'direction',
      type: FieldType.SELECT,
      label: 'Direction',
      options: [
        { label: 'Inbound (from customer)', value: 'INBOUND', position: 0, color: 'blue' },
        { label: 'Outbound (from team)', value: 'OUTBOUND', position: 1, color: 'green' },
      ],
    },
    {
      universalIdentifier: CONVERSATION_MESSAGE_SENDER_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'senderName',
      type: FieldType.TEXT,
      label: 'Sender Name',
    },
    {
      universalIdentifier: CONVERSATION_MESSAGE_SENDER_TYPE_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'senderType',
      type: FieldType.SELECT,
      label: 'Sender Type',
      options: [
        { label: 'Customer', value: 'CUSTOMER', position: 0, color: 'blue' },
        { label: 'Team Member', value: 'TEAM_MEMBER', position: 1, color: 'green' },
        { label: 'Bot / Auto-reply', value: 'BOT', position: 2, color: 'gray' },
      ],
    },

    // ── Channel ─────────────────────────────────────────────────────────────
    {
      universalIdentifier: CONVERSATION_MESSAGE_CHANNEL_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'channel',
      type: FieldType.SELECT,
      label: 'Channel',
      options: [
        { label: 'Website', value: 'WEBSITE', position: 0, color: 'blue' },
        { label: 'Email', value: 'EMAIL', position: 1, color: 'gray' },
        { label: 'LinkedIn', value: 'LINKEDIN', position: 2, color: 'sky' },
        { label: 'Phone', value: 'PHONE', position: 3, color: 'green' },
        { label: 'WhatsApp', value: 'WHATSAPP', position: 4, color: 'turquoise' },
        { label: 'Internal Note', value: 'INTERNAL', position: 5, color: 'yellow' },
      ],
    },

    // ── Timestamps & state ──────────────────────────────────────────────────
    {
      universalIdentifier: CONVERSATION_MESSAGE_SENT_AT_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'sentAt',
      type: FieldType.DATE_TIME,
      label: 'Sent At',
    },
    {
      universalIdentifier: CONVERSATION_MESSAGE_IS_READ_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'isRead',
      type: FieldType.BOOLEAN,
      label: 'Is Read',
    },

    // ── Relation to parent enquiry ───────────────────────────────────────────
    {
      universalIdentifier: CONVERSATION_MESSAGE_ENQUIRY_FIELD_UNIVERSAL_IDENTIFIER,
      name: 'enquiry',
      type: FieldType.RELATION,
      label: 'Enquiry',
      relationTargetObjectMetadataUniversalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
      relationTargetFieldMetadataUniversalIdentifier: CONVERSATION_MESSAGE_ENQUIRY_REVERSE_FIELD_UNIVERSAL_IDENTIFIER,
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.CASCADE,
        joinColumnName: 'enquiryId',
      },
    },
  ],
});
