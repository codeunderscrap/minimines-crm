import {
  defineObject,
  FieldType,
  RelationType,
  OnDeleteAction,
} from 'twenty-sdk/define';


export default defineObject({
  universalIdentifier: 'e8f2d4a6-1b3c-4f7e-9d5a-2c6b8a4f1e3d',
  nameSingular: 'conversationMessage',
  namePlural: 'conversationMessages',
  labelSingular: 'Conversation Message',
  labelPlural: 'Conversation Messages',
  description: 'Individual messages within an enquiry conversation thread. Stores the full chat history between customers and the MiniMines team.',
  icon: 'IconMessage',
  labelIdentifierFieldMetadataUniversalIdentifier: 'b1e5a3c7-2f4d-4b9a-8ce6-4a3d7b1f5c2e',
  fields: [
    // ── Content ─────────────────────────────────────────────────────────────
    {
      universalIdentifier: 'b1e5a3c7-2f4d-4b9a-8ce6-4a3d7b1f5c2e',
      name: 'body',
      type: FieldType.TEXT,
      label: 'Message Body',
    },

    // ── Direction & sender ──────────────────────────────────────────────────
    {
      universalIdentifier: 'd6f2b4e8-7a9c-4d1f-b3e7-5c2a6d4b8f1e',
      name: 'direction',
      type: FieldType.SELECT,
      label: 'Direction',
      options: [
        { label: 'Inbound (from customer)', value: 'INBOUND', position: 0, color: 'blue' },
        { label: 'Outbound (from team)', value: 'OUTBOUND', position: 1, color: 'green' },
      ],
    },
    {
      universalIdentifier: 'c9a3f7e1-4b6d-4c2a-a5f9-6b4a8c3f1d7e',
      name: 'senderName',
      type: FieldType.TEXT,
      label: 'Sender Name',
    },
    {
      universalIdentifier: 'a5e9c1f3-8b2d-4f6a-9dc8-7e1b5f9a3c2d',
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
      universalIdentifier: 'e3b7d5a9-1c4f-4e8b-82d6-8f3c7a1e5b4d',
      name: 'channel',
      type: FieldType.SELECT,
      label: 'Channel',
      options: [
        { label: 'Website', value: 'WEBSITE', position: 0, color: 'blue' },
        { label: 'Email', value: 'EMAIL', position: 1, color: 'gray' },
        { label: 'LinkedIn', value: 'LINKEDIN', position: 2, color: 'sky' },
        { label: 'WhatsApp', value: 'WHATSAPP', position: 3, color: 'turquoise' },
        { label: 'Internal Note', value: 'INTERNAL', position: 4, color: 'yellow' },
      ],
    },

    // ── Timestamps & state ──────────────────────────────────────────────────
    {
      universalIdentifier: 'f7a1e3b5-9d2c-4a4f-b8e4-9c6d2f8a5b3e',
      name: 'sentAt',
      type: FieldType.DATE_TIME,
      label: 'Sent At',
    },
    {
      universalIdentifier: 'b5d9f3a7-6e4c-4b2d-a1f5-1e8b4d6a9c7f',
      name: 'isRead',
      type: FieldType.BOOLEAN,
      label: 'Is Read',
    },

    // ── Relation to parent enquiry ───────────────────────────────────────────
    {
      universalIdentifier: 'a3c7f1b9-5e2d-4a8c-b6f4-7d1e3c9f5a2b',
      name: 'enquiry',
      type: FieldType.RELATION,
      label: 'Enquiry',
      relationTargetObjectMetadataUniversalIdentifier: '60b1d481-b270-4fea-896e-df5d49279735',
      relationTargetFieldMetadataUniversalIdentifier: 'f4b8e2d6-9c1a-4f3b-a7e5-3d6c2b8f4a1e',
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.CASCADE,
        joinColumnName: 'enquiryId',
      },
    },
  ],
});
