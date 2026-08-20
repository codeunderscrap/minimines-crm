import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: '4aa36d83-d78a-4098-adef-16f4ad4a9508',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.BOOLEAN,
  name: 'reminderSent',
  label: 'Reminder Sent',
  description: 'Tracks whether the automated 7-day contract reminder has already been sent to avoid spamming.',
  defaultValue: false,
});
