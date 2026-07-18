import { defineObject, FieldType } from 'twenty-sdk/define';

export default defineObject({
  universalIdentifier: '651890c3-6208-429c-8e72-3e99adeb480e',
  nameSingular: 'contract',
  namePlural: 'contracts',
  labelSingular: 'Contract',
  labelPlural: 'Contracts',
  description: 'Umbrella agreement for sales',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f11181aa',
  fields: [
    { universalIdentifier: 'c83b1a20-3b99-4c22-b7e2-45e0f11181aa', name: 'name', type: FieldType.TEXT, label: 'Contract Name' },
    { universalIdentifier: 'd45b1a20-3b99-4c22-b7e2-45e0f11181bb', name: 'startDate', type: FieldType.DATE_TIME, label: 'Start Date' },
    { universalIdentifier: 'e56b1a20-3b99-4c22-b7e2-45e0f11181cc', name: 'endDate', type: FieldType.DATE_TIME, label: 'End Date' },
    { universalIdentifier: 'f67b1a20-3b99-4c22-b7e2-45e0f11181dd', name: 'totalQuantity', type: FieldType.NUMBER, label: 'Total Quantity (MT)' },
    { universalIdentifier: 'a78b1a20-3b99-4c22-b7e2-45e0f11181ee', name: 'lmeFormula', type: FieldType.TEXT, label: 'LME Pricing Formula' },
    {
      universalIdentifier: 'b89b1a20-3b99-4c22-b7e2-45e0f11181ff',
      name: 'status',
      type: FieldType.SELECT,
      label: 'Status',
      options: [
        { position: 0, color: 'green', label: 'Draft', value: 'DRAFT' },
        { position: 1, color: 'green', label: 'Active', value: 'ACTIVE' },
        { position: 2, color: 'green', label: 'Expired', value: 'EXPIRED' }
      ]
    }
  ]
});
