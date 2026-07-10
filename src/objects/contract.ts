import { defineObject, defineField } from 'twenty-sdk/define';

export default defineObject({
  nameSingular: 'Contract',
  namePlural: 'Contracts',
  labelSingular: 'Contract',
  labelPlural: 'Contracts',
  description: 'Umbrella agreement for sales',
  fields: {
    name: defineField.text({ label: 'Contract Name' }),
    startDate: defineField.dateTime({ label: 'Start Date' }),
    endDate: defineField.dateTime({ label: 'End Date' }),
    totalQuantity: defineField.number({ label: 'Total Quantity (MT)' }),
    lmeFormula: defineField.text({ label: 'LME Pricing Formula' }),
    status: defineField.select({
      label: 'Status',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Expired', value: 'EXPIRED' }
      ]
    })
  }
});
