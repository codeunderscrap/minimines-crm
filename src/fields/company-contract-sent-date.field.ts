import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '6b697da6-6765-4505-bcd9-43cac6ccc9ef',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.DATE_TIME,
  name: 'contractSentDate',
  label: 'Contract Sent Date',
  description: 'The date and time when the onboarding contract was sent to the company.',
});
