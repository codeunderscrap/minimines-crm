import {
  defineObject,
  FieldType,
  RelationType,
  OnDeleteAction,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export default defineObject({
  nameSingular: 'verifiedPrice',
  namePlural: 'verifiedPrices',
  labelSingular: 'Verified Price',
  labelPlural: 'Verified Prices',
  universalIdentifier: '2c9e421a-e642-4f0e-b7e9-a5c9f55e0941',
  description: 'A master ledger of prices for materials/trades. Created by Admins, verified by HOD, and used by Associates for quoting.',
  icon: 'IconCheckCircle',
  labelIdentifierFieldMetadataUniversalIdentifier: '8d2a6a8c-9c94-4d89-bb0d-c049b4f91191',
  fields: [
    {
      universalIdentifier: '8d2a6a8c-9c94-4d89-bb0d-c049b4f91191',
      name: 'material',
      type: FieldType.TEXT,
      label: 'Material / Item Name',
      description: 'The product or material being priced',
    },
    {
      universalIdentifier: 'ebc9f69b-8ed2-4f33-b45b-7b0bcf9a4a79',
      name: 'price',
      type: FieldType.NUMBER,
      label: 'Price',
    },
    {
      universalIdentifier: '3a4792d7-b8f6-4fba-a9e9-1f4864fc1cf8',
      name: 'currency',
      type: FieldType.SELECT,
      label: 'Currency',
      options: [
        { label: 'INR', value: 'INR', position: 0, color: 'green' },
        { label: 'USD', value: 'USD', position: 1, color: 'blue' },
      ],
      defaultValue: "'INR'",
    },
    {
      universalIdentifier: '7b70c3c5-9b25-4202-bdfc-85a97576a445',
      name: 'status',
      type: FieldType.SELECT,
      label: 'Verification Status',
      options: [
        { label: 'Draft', value: 'DRAFT', position: 0, color: 'gray' },
        { label: 'Verified', value: 'VERIFIED', position: 1, color: 'green' },
        { label: 'Rejected', value: 'REJECTED', position: 2, color: 'red' },
      ],
      defaultValue: "'DRAFT'",
    },
    {
      universalIdentifier: 'a4e98f41-3b7c-40f4-8d99-52e8250f555c',
      name: 'verifiedBy',
      type: FieldType.RELATION,
      label: 'Verified By (HOD)',
      relationTargetObjectMetadataUniversalIdentifier: STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
      relationTargetFieldMetadataUniversalIdentifier: 'c8f7d983-a98d-4e94-b258-7c85db38d810',
      universalSettings: {
        relationType: RelationType.MANY_TO_ONE,
        onDelete: OnDeleteAction.SET_NULL,
        joinColumnName: 'verifiedById',
      },
    },
    {
      universalIdentifier: '5f91c95b-7c3a-48a5-b1e8-78c95a28f78d',
      name: 'notes',
      type: FieldType.TEXT,
      label: 'Ledger Notes',
    },
  ],
});
