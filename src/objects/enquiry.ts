import { defineObject, FieldType } from 'twenty-sdk/define';
import { ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

export default defineObject({
  universalIdentifier: ENQUIRY_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'enquiry',
  namePlural: 'enquiries',
  labelSingular: 'Enquiry',
  labelPlural: 'Enquiries',
  description: 'Manage incoming questions and leads.',
  icon: 'IconMessageCircle',
  labelIdentifierFieldMetadataUniversalIdentifier: 'ac5f1b0e-f24c-4854-a252-e0500b0055ed',
  fields: [
    {
      universalIdentifier: 'ac5f1b0e-f24c-4854-a252-e0500b0055ed',
      name: 'customerName',
      type: FieldType.TEXT,
      label: 'Customer Name',
    },
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
      ],
    },
    {
      universalIdentifier: '0f3efbf2-5b84-4792-adfa-835f7c4dcbeb',
      name: 'message',
      type: FieldType.TEXT,
      label: 'Message',
    },
    {
      universalIdentifier: 'cd6bbdbc-34cd-4e9c-bd3a-c98c367cf802',
      name: 'reply',
      type: FieldType.TEXT,
      label: 'Reply',
    },
    {
      universalIdentifier: 'a0bcd20d-7208-4084-8da1-9dc47a1b95f5',
      name: 'status',
      type: FieldType.SELECT,
      label: 'Status',
      defaultValue: "'UNANSWERED'",
      options: [
        { label: 'Unanswered', value: 'UNANSWERED', position: 0, color: 'red' },
        { label: 'Replied', value: 'REPLIED', position: 1, color: 'green' },
      ],
    },
  ],
});
