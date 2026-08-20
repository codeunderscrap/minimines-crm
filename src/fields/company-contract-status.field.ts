import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export default defineField({
  universalIdentifier: 'be777436-c38a-4b47-bb29-dcdb7d7cea2d',
  objectUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'contractStatus',
  label: 'Contract Status',
  description: 'The status of the onboarding contract for this company.',
  options: [
    {
      universalIdentifier: '81f357ea-867c-4743-b049-eca57008bee8',
      value: 'NOT_SENT',
      label: 'Not Sent',
      color: 'gray',
    },
    {
      universalIdentifier: 'd656159c-40f0-4865-a75d-5dcc47694e96',
      value: 'SENT',
      label: 'Sent',
      color: 'yellow',
    },
    {
      universalIdentifier: 'a5173534-76c7-40a4-894e-a9f3e6a0a64f',
      value: 'SIGNED',
      label: 'Signed',
      color: 'green',
    },
  ],
});
